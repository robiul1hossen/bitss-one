import { durationLabel } from "@/utils/checkoutUtils";
import { Package } from "lucide-react";

export default function CheckoutProductCard({
  product,
  subId,
  variantId,
  unit,
  priceRow,
}) {
  return (
    <div className="fu2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <Package size={20} className="text-red-500" />
        </div>
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
            Selected Product
          </p>
          <p className="font-['Outfit',sans-serif] text-[16px] sm:text-[18px] font-bold text-slate-900 leading-snug">
            {product.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto pl-14 sm:pl-0">
        {subId && !product.is_usb && (
          <span className="text-[10px] sm:text-[11px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
            {durationLabel(priceRow?.duration ?? null)}
          </span>
        )}
        {variantId && (
          <span className="text-[10px] sm:text-[11px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
            {priceRow?.variant_name ?? `Variant #${variantId}`}
          </span>
        )}
        {unit && !variantId && (
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
            {unit} {Number(unit) === 1 ? "Key" : "Keys"}
          </span>
        )}
      </div>
    </div>
  );
}
