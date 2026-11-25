"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;

// Change these two links to your real pages
const ORDERS_URL = "/dashboard";
const HOME_URL = "/products";

const short = (a, n = 6) => (a ? `${a.slice(0, n)}…${a.slice(-n)}` : "");

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{children}</span>
    </div>
  );
}

export default function CryptoSuccess() {
  const params = useSearchParams();
  const orderNumber = params.get("orderNumber");
  const orderId = params.get("order_id");
  const crypto = (params.get("crypto") || "").toUpperCase();
  const amount = params.get("amount");
  const signature = params.get("signature");
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // only used to show the product name
  useEffect(() => {
    if (!orderId || !token) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders/order/details/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrder(data?.order ?? data?.data ?? data);
      } catch (e) {
        console.error("Order load failed:", e);
      }
    })();
  }, [orderId, token]);

  const productName = order?.product?.name ?? order?.product_name;
  const amountNum = Number(amount);
  const amountText =
    Number.isFinite(amountNum) && amountNum > 0
      ? amountNum.toLocaleString("en-US", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 6,
        })
      : null;

  const copySignature = async () => {
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="min-h-dvh bg-white px-4 py-12 md:py-20">
      <div className="mx-auto w-full max-w-120">
        {/* Heading */}
        <div className="text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            Payment received
          </h1>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-gray-500">
            Your {crypto || "crypto"} payment was confirmed on the Solana
            network.
          </p>
        </div>

        {/* Order card */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-[#ff0000] px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">
              Order details
            </p>
            <p className="my-1 text-base font-semibold uppercase leading-tight text-white">
              {productName ?? "Your order"}
            </p>
            <span className="inline-flex rounded-full bg-black/20 px-2.5 py-0.5 text-[11px] text-white">
              Order {orderNumber}
            </span>
          </div>

          <div className="px-5 pb-5 pt-2">
            <Row label="Order number">{orderNumber}</Row>
            <Row label="Status">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">
                Paid
              </span>
            </Row>
            {crypto && <Row label="Paid with">{crypto} on Solana</Row>}

            {amountText && (
              <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                  Amount paid
                </p>
                <p className="text-xl font-bold text-[#ff0000]">
                  {amountText}{" "}
                  <span className="text-[11px] font-semibold">{crypto}</span>
                </p>
              </div>
            )}

            {signature && (
              <div className="mt-3 border-t border-gray-200 pt-3.5">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Transaction ID
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-gray-800">
                    {short(signature, 8)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={copySignature}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-900"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <a
                      href={`https://solscan.io/tx/${signature}${RPC?.includes("devnet") ? "?cluster=devnet" : ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#ff0000] underline underline-offset-2 hover:text-[#d90000]"
                    >
                      Solscan <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
          <Link
            href={ORDERS_URL}
            className="grid h-12 place-items-center rounded-xl bg-[#ff0000] text-sm font-semibold text-white transition-colors hover:bg-[#d90000]"
          >
            View my orders
          </Link>
          <Link
            href={HOME_URL}
            className="grid h-12 place-items-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-slate-900 transition-colors hover:bg-gray-50"
          >
            Continue shopping
          </Link>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1 text-xs text-gray-500">
          <ShieldCheck size={12} />
          Secure checkout · Verified on-chain · Powered by BITSS
        </p>
      </div>
    </main>
  );
}
