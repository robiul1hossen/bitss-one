import { Tag } from "lucide-react";

export default function SavingsBadge({
  discountType,
  discountAmount,
  currencySymbol,
}) {
  if (!discountAmount) return null;
  const type = discountType?.toLowerCase();
  if (type === "percent" || type === "percentage") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
        <Tag size={9} /> Save {discountAmount}%
      </span>
    );
  }
  if (type === "flat") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
        <Tag size={9} /> Save {currencySymbol}
        {discountAmount}
      </span>
    );
  }
  return null;
}
