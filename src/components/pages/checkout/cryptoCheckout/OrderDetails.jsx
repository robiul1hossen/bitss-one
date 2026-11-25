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
  const isSpump = crypto?.toUpperCase() === "SPUMP";
  const numFiat = Number(fiat) || 0;

  const productPrice = numFiat;
  const discountAmount = isSpump ? Number((productPrice * 0.3).toFixed(2)) : 0;
  const netPrice = isSpump
    ? Number((productPrice - discountAmount).toFixed(2))
    : productPrice;

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
          <div className="text-right w-32">
            <p className="text-lg font-bold text-white">
              {money(netPrice, fiatCurrency)}
            </p>
            {isSpump && (
              <span className="inline-block w-full text-[10.5px] font-medium text-emerald-200 bg-white/20 px-2 py-0.5 rounded-full">
                30% SPUMP OFF
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 bg-white px-4 py-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order number</span>
          <span className="text-gray-700 font-mono">{orderNumber}</span>
        </div>

        {isSpump ? (
          <div className="space-y-2 border-t border-gray-100 pt-2.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Product price</span>
              <span className="text-gray-700 font-medium">
                {money(productPrice, fiatCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-emerald-600 font-medium">
              <span>SPUMP Discount (30%)</span>
              <span>−{money(discountAmount, fiatCurrency)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 text-sm font-semibold text-gray-900">
              <span>Net Price / Discounted</span>
              <span className="text-gray-900">
                {money(netPrice, fiatCurrency)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-medium">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{money(fiat, fiatCurrency)}</span>
          </div>
        )}

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
