"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
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
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right text-gray-800">{children}</span>
    </div>
  );
}

function OrderConfirmationInner() {
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
    <main className="min-h-dvh py-14 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          {/* Heading */}
          <div className="text-center">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Check size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Payment received
            </h1>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              Your {crypto || "crypto"} payment was confirmed on the Solana
              network.
            </p>
          </div>

          {/* Order card */}
          <div className="mt-10 overflow-hidden rounded-xl border border-gray-200">
            <div className="bg-red-600 px-4 py-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-red-100">
                Order Details
              </p>
              <p className="text-base font-semibold leading-tight text-white">
                {productName ?? "Your order"}
              </p>
              <span className="mt-1.5 inline-flex items-center rounded-full bg-red-700/60 px-2 py-0.5 text-[11px] text-red-50">
                Order {orderNumber}
              </span>
            </div>

            <div className="space-y-3 bg-white px-4 py-3">
              <Row label="Order number">{orderNumber}</Row>
              <Row label="Status">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  Paid
                </span>
              </Row>
              {crypto && <Row label="Paid with">{crypto} on Solana</Row>}

              {amountText && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount Paid
                  </p>
                  <p className="text-lg font-bold tracking-tight text-red-600">
                    {amountText}{" "}
                    <span className="text-xs font-medium tracking-wide">
                      {crypto}
                    </span>
                  </p>
                </div>
              )}

              {signature && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Transaction ID
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-gray-700">
                      {short(signature, 8)}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={copySignature}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-800"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <a
                        href={`https://solscan.io/tx/${signature}${RPC?.includes("devnet") ? "?cluster=devnet" : ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-red-600 underline underline-offset-2 hover:text-red-700"
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
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={ORDERS_URL}
              className="w-full rounded-xl bg-red-600 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              View my orders
            </Link>
            <Link
              href={HOME_URL}
              className="w-full rounded-xl border border-gray-200 py-3.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Continue shopping
            </Link>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
            <ShieldCheck size={12} />
            Secure checkout · Verified on-chain · Powered by BITSS
          </p>
        </div>
      </div>
    </main>
  );
}

// useSearchParams() needs Suspense, so it is wrapped here
export default function CryptoSuccess() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationInner />
    </Suspense>
  );
}
