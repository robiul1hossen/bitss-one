import { ChevronRight, Layers, Package, Usb } from "lucide-react";
import Link from "next/link";

const COMBO_COLORS = [
  {
    bg: "bg-red-50",
    border: "border-red-100",
    icon: "text-red-500",
    dot: "bg-red-400",
  },
  {
    bg: "bg-sky-50",
    border: "border-sky-100",
    icon: "text-sky-500",
    dot: "bg-sky-400",
  },
  {
    bg: "bg-violet-50",
    border: "border-violet-100",
    icon: "text-violet-500",
    dot: "bg-violet-400",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: "text-emerald-500",
    dot: "bg-emerald-400",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: "text-amber-500",
    dot: "bg-amber-400",
  },
];

export default function ComboProductCard({ comboProduct, index }) {
  const c = COMBO_COLORS[index % COMBO_COLORS.length];

  return (
    <Link
      href={`/products/${comboProduct.slug}`}
      className="group flex items-start gap-4 p-5 rounded-2xl border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 hover:border-slate-300"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.bg} border ${c.border}`}
      >
        {comboProduct.is_usb ? (
          <Usb size={18} strokeWidth={1.75} className={c.icon} />
        ) : comboProduct.is_combo ? (
          <Layers size={18} strokeWidth={1.75} className={c.icon} />
        ) : (
          <Package size={18} strokeWidth={1.75} className={c.icon} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-['Barlow_Condensed'] text-[16px] font-black text-slate-900 leading-tight group-hover:text-red-600 transition-colors truncate">
            {comboProduct.name}
          </h4>
          {comboProduct.pivot?.quantity > 1 && (
            <span className="shrink-0 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              ×{comboProduct.pivot.quantity}
            </span>
          )}
        </div>

        {comboProduct.sort_description && (
          <p
            className="text-[12px] text-slate-400 mt-1 line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: comboProduct.sort_description }}
          />
        )}
      </div>

      <ChevronRight
        size={15}
        className="text-slate-300 group-hover:text-red-400 shrink-0 mt-1 transition-colors"
      />
    </Link>
  );
}
