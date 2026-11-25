import { cn } from "@/lib/utils";
import { ChevronRight, ShieldCheck, Wallet } from "lucide-react";
import React from "react";

const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const wallets = [
  { name: "Phantom", letter: "P", color: "bg-purple-100 text-purple-700" },
  { name: "Solflare", letter: "S", color: "bg-orange-100 text-orange-700" },
];

export default function ChooseWallet({
  wallet,
  walletError,
  txError,
  onConnect,
  onDisconnect,
  onHandlePay,
  status,
  signature,
  validLink,
  order,
  amountText,
  crypto,
}) {
  const labelCls =
    "text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2";

  const short = (a) => (a ? `${a.slice(0, 4)}…${a.slice(-4)}` : "");

  const payLabel = () => {
    if (isSuccess) return "✓ Payment Complete";
    if (status === "awaiting") return "Approve in your wallet…";
    if (status === "verifying") return "Verifying payment…";
    if (isLoading) return "Processing…";
    if (!wallet) return "Connect a Wallet";
    return `Pay ${amountText} ${crypto}`;
  };

  const isLoading = [
    "building",
    "awaiting",
    "confirming",
    "verifying",
  ].includes(status);
  const isSuccess = status === "success";
  const isPending = status === "pending";

  const canPay =
    !!wallet && validLink && !!order && !isLoading && !isSuccess && !isPending;

  return (
    <div>
      <p className={labelCls}>Choose Wallet</p>
      <div className="flex flex-col gap-2">
        {wallets.map(({ name, letter, color }) => {
          const connected = wallet?.name === name;
          return (
            <button
              key={name}
              type="button"
              disabled={isLoading}
              onClick={() => (connected ? onDisconnect() : onConnect(name))}
              className={cn(
                "group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all disabled:cursor-not-allowed disabled:opacity-60",
                connected
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                    color,
                  )}
                >
                  {letter}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {name}
                </span>
              </div>
              {connected ? (
                <span className="font-mono text-xs text-green-600">
                  {short(wallet.publicKey)}
                </span>
              ) : (
                <ChevronRight
                  size={16}
                  className="text-gray-400 transition-colors group-hover:text-gray-600"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium",
          wallet ? "text-green-500" : "text-gray-400",
        )}
      >
        {wallet ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            {wallet.name} connected
          </>
        ) : (
          <>
            <Wallet size={16} />
            Connect a wallet
          </>
        )}
      </div>

      {walletError && (
        <p role="alert" className="mt-1 text-center text-xs text-red-500">
          {walletError}
        </p>
      )}
      {txError && (
        <p
          role="alert"
          className={cn(
            "mt-1 text-center text-xs",
            isPending ? "text-amber-500" : "text-red-500",
          )}
        >
          {txError}
        </p>
      )}
      {signature && (
        <a
          href={`https://solscan.io/tx/${signature}${RPC?.includes("devnet") ? "?cluster=devnet" : ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-center text-xs text-blue-500 underline"
        >
          View on Solscan
        </a>
      )}

      <button
        type="button"
        onClick={onHandlePay}
        disabled={!canPay}
        className={cn(
          "mt-3 w-full rounded-xl py-3.5 text-sm font-semibold transition-all",
          isSuccess &&
            "cursor-default border border-green-200 bg-green-50 text-green-600",
          canPay &&
            "cursor-pointer bg-(--brand) text-white hover:bg-(--brand-hover)",
          !canPay &&
            !isSuccess &&
            "cursor-not-allowed bg-gray-100 text-gray-400",
        )}
      >
        {payLabel()}
      </button>

      {isPending && signature && (
        <button
          type="button"
          onClick={() => verifyPayment(signature)}
          className="mt-2 w-full cursor-pointer rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Check payment again
        </button>
      )}

      <div className="mt-3 pb-2 text-center">
        <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
          <ShieldCheck size={12} />
          Secure checkout · Verified on-chain · Powered by BITSS
        </p>
      </div>
    </div>
  );
}
