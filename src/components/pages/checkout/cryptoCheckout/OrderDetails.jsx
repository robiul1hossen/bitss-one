import { cn } from "@/lib/utils";
import { money } from "@/utils/money";
import React from "react";

export default function OrderDetails({
  productName,
  orderNumber,
  amountText,
  fiat,
  fiatCurrency,
  crypto,
  wallet,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="bg-(--brand) px-4 py-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-200">
          Order Details
        </p>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold leading-tight text-white">
              {productName}
            </p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-(--brand-pill) px-2 py-0.5 text-[11px] text-gray-700">
              Order {orderNumber}
            </span>
          </div>
          <p className="text-lg font-bold text-white">
            {money(fiat, fiatCurrency)}
          </p>
        </div>
      </div>

      <div className="space-y-3 bg-white px-4 py-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order number</span>
          <span className="text-gray-700">{orderNumber}</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-medium">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{money(fiat, fiatCurrency)}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            You Pay
          </p>
          <p className="text-lg font-bold tracking-tight text-(--brand)">
            {amountText}{" "}
            <span className="text-xs font-medium tracking-wide">{crypto}</span>
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-1.5 text-xs",
            wallet ? "text-green-500" : "text-gray-400",
          )}
        >
          <div
            className={cn(
              "size-1.5 shrink-0 rounded-sm border",
              wallet ? "border-green-400 bg-green-400" : "border-gray-300",
            )}
          />
          {wallet ? `${wallet.name} connected` : "No wallet connected"}
        </div>
      </div>
    </div>
  );
}
