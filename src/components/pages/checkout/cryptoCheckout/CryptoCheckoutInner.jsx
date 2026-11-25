"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatAmount } from "@/utils/formatPrice";
import { toBaseUnits } from "@/utils/toBaseUnits";
import { getCurrencySymbol } from "@/utils/orderHelpers";
import OrderDetails from "./OrderDetails";
import TokenBreakdown from "./TokenBreakdown";
import ChooseWallet from "./ChooseWallet";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// TODO: LIVE TRANSITION CHECKLIST:
// 1. RPC & MINT CONFIGURATION: Verify NEXT_PUBLIC_RPC_ENDPOINT (currently devnet) and NEXT_PUBLIC_SPUMP_MINT_ADDRESS (currently devnet test mint) are switched to Mainnet.
// 2. RECEIVER WALLET: Confirm NEXT_PUBLIC_RECEIVER_ADDRESS matches the live merchant treasury wallet.
// 3. SUPPORTED TOKENS: Currently only "SOL" and "SPUMP" are supported here.
//    If "USFF" and "USDC" from CheckoutPaymentMethod are enabled for live launch, add their SPL token mint addresses and extend SUPPORTED and handlePay() accordingly.
const RECEIVER = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS;
const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const MINT_ADDRESS = process.env.NEXT_PUBLIC_SPUMP_MINT_ADDRESS;

const SUPPORTED = ["SOL", "SPUMP"];
const FEE_BUFFER = 10_000;
const NEW_ACCOUNT_BUFFER = 3_000_000;

const THEME = {
  "--brand": "#e7000b",
  "--brand-hover": "#e7000b",
  "--brand-pill": "#ffffff",
};

export default function CryptoCheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const orderNumber = params.get("order_number");
  const crypto = (params.get("crypto") || "").toUpperCase();
  const amount = params.get("amount");
  const isSol = crypto === "SOL";
  const validLink = SUPPORTED.includes(crypto) && Number(amount) > 0;

  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [txError, setTxError] = useState(null);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    if (!orderId || !validLink) return;
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders/order/details/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrder(data?.order ?? data?.data ?? data);
        setOrderError(null);
      } catch (e) {
        console.error("Order load failed:", e);
        setOrderError("Could not load your order. Refresh the page to retry.");
      }
    })();
  }, [orderId, token, validLink]);

  const fiat = Number(order?.amount);
  const fiatCurrency = getCurrencySymbol(order?.country?.currency_icon);
  const productName =
    order?.product?.name ?? order?.product_name ?? "Bitss order";
  const amountText = validLink ? formatAmount(amount) : null;

  const connectWallet = async (name) => {
    setWalletError(null);
    try {
      const provider =
        name === "Phantom" ? window?.phantom?.solana : window?.solflare;
      const ok =
        name === "Phantom" ? provider?.isPhantom : provider?.isSolflare;
      if (!ok) throw new Error(`${name} is not installed in this browser.`);

      const resp = await provider.connect();
      let key = resp?.publicKey ?? provider.publicKey;
      if (!key) {
        await new Promise((r) => setTimeout(r, 150)); // Solflare sets it a moment later
        key = provider.publicKey;
      }
      if (!key) throw new Error("Wallet gave no address. Unlock it and retry.");
      setWallet({ provider, name, publicKey: key.toString() });
    } catch (e) {
      setWalletError(
        e?.code === 4001
          ? "You rejected the connection request."
          : (e?.message ?? `Could not connect ${name}.`),
      );
    }
  };

  const disconnectWallet = async () => {
    try {
      await wallet?.provider?.disconnect();
    } catch {
      /* ignore */
    }
    setWallet(null);
  };

  const verifyPayment = async (sig) => {
    setStatus("verifying");
    setTxError(null);
    try {
      const res = await fetch(`${BASE_URL}/payment/crypto/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          order_id: Number(orderId),
          currency: crypto,
          signature: sig,
          sender_wallet: wallet?.publicKey,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        throw new Error(
          data?.message ||
            (data?.errors ? JSON.stringify(data.errors) : `HTTP ${res.status}`),
        );
      }
      setStatus("success");
      setTimeout(
        () =>
          router.push(
            `/checkout/crypto-payment/crypto-success?order_id=${orderId}&crypto=${crypto}&signature=${sig}&amount=${amount}&orderNumber=${orderNumber}`,
          ),
        1500,
      );
    } catch (e) {
      console.error("Verify failed:", e);
      setStatus("pending");
      setTxError(
        "Payment sent but verification is pending. Your funds are safe. Save your transaction ID." +
          (process.env.NODE_ENV !== "production" && e?.message
            ? ` [dev only: ${e.message}]`
            : ""),
      );
    }
  };

  const handlePay = async () => {
    if (!wallet || !validLink || !RECEIVER || !RPC) return;
    setStatus("building");
    setTxError(null);
    setSignature(null);

    let sig = null;
    try {
      const connection = new Connection(RPC, "confirmed");
      const from = new PublicKey(wallet.publicKey);
      const to = new PublicKey(RECEIVER);
      const tx = new Transaction();

      if (isSol) {
        const lamports = toBaseUnits(amount, 9);
        if (!lamports) throw new Error("Invalid payment amount.");

        const balance = await connection.getBalance(from);
        if (balance < Number(lamports) + FEE_BUFFER) {
          throw new Error("Not enough SOL in this wallet.");
        }

        tx.add(
          SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: to,
            lamports: Number(lamports),
          }),
        );
      } else {
        // SPUMP: SPL token transfer
        if (!MINT_ADDRESS) throw new Error("SPUMP payment is not configured.");
        const mint = new PublicKey(MINT_ADDRESS);

        // SPUMP uses "decimals" (e.g. 9): 1 SPUMP = 1,000,000 smallest units
        const mintInfo = await connection.getParsedAccountInfo(mint);
        const decimals = mintInfo.value?.data?.parsed?.info?.decimals ?? 9;
        const rawAmount = toBaseUnits(amount, decimals);
        if (!rawAmount) throw new Error("Invalid payment amount.");

        const fromATA = await getAssociatedTokenAddress(mint, from);
        const toATA = await getAssociatedTokenAddress(mint, to);

        // does the person have enough SPUMP?
        let senderAccount;
        try {
          senderAccount = await getAccount(connection, fromATA);
        } catch (e) {
          console.error("Sender token account check failed:", e);
          throw new Error(
            e?.name === "TokenAccountNotFoundError"
              ? "This wallet has no SPUMP tokens."
              : "Could not check your SPUMP balance. Please try again.",
          );
        }
        if (senderAccount.amount < rawAmount) {
          throw new Error("Not enough SPUMP in this wallet.");
        }

        // create our token account first if it does not exist yet
        let receiverMissing = false;
        try {
          await getAccount(connection, toATA);
        } catch (e) {
          if (e?.name !== "TokenAccountNotFoundError") throw e;
          receiverMissing = true;
          tx.add(
            createAssociatedTokenAccountInstruction(from, toATA, to, mint),
          );
        }

        // SPUMP payments still need a little SOL for the network fee
        const solBalance = await connection.getBalance(from);
        if (solBalance < (receiverMissing ? NEW_ACCOUNT_BUFFER : FEE_BUFFER)) {
          throw new Error("Not enough SOL in this wallet for the network fee.");
        }

        tx.add(createTransferInstruction(fromATA, toATA, from, rawAmount));
      }

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = from;

      setStatus("awaiting");
      const signed = await wallet.provider.signTransaction(tx);

      setStatus("confirming");
      sig = await connection.sendRawTransaction(signed.serialize());
      setSignature(sig);
      const conf = await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        "confirmed",
      );
      if (conf.value.err) {
        setTxError("The transaction failed on Solana. No funds were moved.");
        setStatus("error");
        return;
      }
    } catch (e) {
      if (sig) {
        setStatus("pending");
        setTxError(
          "We could not confirm your transaction yet. Check Solscan before paying again.",
        );
      } else {
        setTxError(
          e?.code === 4001
            ? "You rejected the transaction. No funds were sent."
            : (e?.message ?? "Transaction failed."),
        );
        setStatus("error");
      }
      return;
    }
    await verifyPayment(sig);
  };

  if (!orderId || !validLink) {
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <p className="text-sm text-gray-500">
          This payment link is not valid. Please go back and create the order
          again.
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <p className="text-sm text-gray-500">
          {orderError ?? "Loading your order…"}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh py-14 md:py-28" style={THEME}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading */}
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft size={14} /> Back to checkout
            </button>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Complete your payment
            </h1>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              Connect your Solana wallet to pay with {crypto}.
            </p>
          </div>

          {/* Right: cards */}
          <div className="space-y-3">
            {/* Order details */}
            <OrderDetails
              amountText={amountText}
              crypto={crypto}
              fiat={fiat}
              fiatCurrency={fiatCurrency}
              orderNumber={orderNumber}
              productName={productName}
              wallet={wallet}
            />
            {/* Payment breakdown */}
            <TokenBreakdown
              amountText={amountText}
              crypto={crypto}
              fiat={fiat}
              fiatCurrency={fiatCurrency}
            />

            {/* Choose wallet */}
            <ChooseWallet
              wallet={wallet}
              walletError={walletError}
              txError={txError}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              onHandlePay={handlePay}
              status={status}
              signature={signature}
              validLink={validLink}
              order={order}
              amountText={amountText}
              crypto={crypto}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
