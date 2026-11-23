import { money } from "@/utils/money";
import { Coins, RefreshCw } from "lucide-react";
import React from "react";

export default function TokenBreakdown({
  fiat,
  fiatCurrency,
  crypto,
  amountText,
}) {
  const labelCls =
    "text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2";
  return (
    <div>
      <p className={labelCls}>Payment Breakdown</p>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {[
          [
            "Service Price",
            money(fiat, fiatCurrency),
            RefreshCw,
          ],
          ["Pay With", crypto, Coins],
          ["Network", "Solana", RefreshCw],
        ].map(([label, value, Icon]) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-2.5"
          >
            <div className="flex items-center gap-2">
              <Icon size={14} className="text-gray-400" />
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Coins size={14} className="text-gray-400" />
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              You Pay
            </span>
          </div>
          <span className="text-sm font-semibold text-(--brand)">
            {amountText}{" "}
            <span className="text-xs font-medium tracking-wide">{crypto}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
