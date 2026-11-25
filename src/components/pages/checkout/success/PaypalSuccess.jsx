"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, X, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ORDERS_URL = "/dashboard";
const HOME_URL = "/products";
const CHECKOUT_URL = "/checkout";

const short = (a, n = 6) =>
  a && a.length > n * 2 + 1 ? `${a.slice(0, n)}…${a.slice(-n)}` : a || "";

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{children}</span>
    </div>
  );
}

export default function PaypalSuccess() {
  const params = useSearchParams();
  const isSuccess = params.get("status") === "success";
  const orderNumber = params.get("order_number");
  const orderId = params.get("order_id");
  const amount = params.get("amount");
  const currency = (params.get("currency") || "USD").toUpperCase();
  const transactionId = params.get("transaction_id");
  const { token } = useAuth();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!isSuccess || !orderId || !token) return;
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
  }, [isSuccess, orderId, token]);

  const productName = order?.product?.name ?? order?.product_name;
  const amountNum = Number(amount);
  const amountText =
    Number.isFinite(amountNum) && amountNum > 0
      ? amountNum.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  return (
    <main className="min-h-dvh bg-white px-4 py-12 md:py-20">
      <div className="mx-auto w-full max-w-120">
        {/* Heading */}
        <div className="text-center">
          <div
            className={`mx-auto mb-5 grid size-16 place-items-center rounded-full ${
              isSuccess
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-[#ff0000]"
            }`}
          >
            {isSuccess ? (
              <Check size={28} strokeWidth={2.5} />
            ) : (
              <X size={28} strokeWidth={2.5} />
            )}
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            {isSuccess ? "Payment received" : "Payment failed"}
          </h1>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-gray-500">
            {isSuccess
              ? "Thank you for your purchase. A confirmation will be sent to your email."
              : "We could not complete your payment. You have not been charged."}
          </p>
        </div>

        {isSuccess && (
          <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#ff0000] px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">
                Order details
              </p>
              <p className="my-1 text-base font-semibold uppercase leading-tight text-white">
                {productName ?? "Your order"}
              </p>
              {orderNumber && (
                <span className="inline-flex rounded-full bg-black/20 px-2.5 py-0.5 text-[11px] text-white">
                  Order {orderNumber}
                </span>
              )}
            </div>

            <div className="px-5 pb-5 pt-2">
              {orderNumber && <Row label="Order number">{orderNumber}</Row>}
              <Row label="Status">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">
                  Paid
                </span>
              </Row>
              <Row label="Paid with">PayPal</Row>

              {amountText && (
                <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    Amount paid
                  </p>
                  <p className="text-xl font-bold text-[#ff0000]">
                    {amountText}{" "}
                    <span className="text-[11px] font-semibold">
                      {currency}
                    </span>
                  </p>
                </div>
              )}

              {transactionId && (
                <div className="mt-3 border-t border-gray-200 pt-3.5">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Transaction ID
                  </p>
                  <span className="font-mono text-xs text-gray-800">
                    {short(transactionId, 8)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          className={`${isSuccess ? "mt-4" : "mt-7"} grid grid-cols-1 gap-3 min-[380px]:grid-cols-2`}
        >
          <Link
            href={isSuccess ? ORDERS_URL : CHECKOUT_URL}
            className="grid h-12 place-items-center rounded-xl bg-[#ff0000] text-sm font-semibold text-white transition-colors hover:bg-[#d90000]"
          >
            {isSuccess ? "View my orders" : "Try again"}
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
          Secure checkout · Protected by PayPal · Powered by BITSS
        </p>
      </div>
    </main>
  );
}
