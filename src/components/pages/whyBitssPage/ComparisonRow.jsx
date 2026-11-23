import { useInView } from "@/hooks/useInView";

export default function ComparisonRow({ row, i }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${i * 0.06}s` }}
      className={`grid grid-cols-2 gap-3 sm:gap-4 transition-all duration-500
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {/* Others */}
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 border border-slate-200 shadow-sm">
        <span className="text-slate-300 text-[16px] shrink-0">✗</span>
        <p className="text-slate-500 text-[12px] sm:text-[13px] leading-snug">
          {row.others}
        </p>
      </div>
      {/* BITSS */}
      <div className="flex items-center gap-3 bg-red-50 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 border border-red-100 shadow-sm">
        <span className="text-red-500 text-[16px] shrink-0">✓</span>
        <p className="text-slate-700 text-[12px] sm:text-[13px] font-medium leading-snug">
          {row.bitss}
        </p>
      </div>
    </div>
  );
}
