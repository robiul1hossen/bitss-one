import { useInView } from "@/hooks/useInView";
import { CheckCircle2 } from "lucide-react";

export default function PromiseCard({ p, i }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${i * 0.08}s` }}
      className={`flex items-start gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 rounded-2xl px-5 py-4 text-left transition-all duration-300
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      <CheckCircle2 size={18} className="text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-white font-semibold text-[13px] sm:text-[14px] leading-snug">
          {p.label}
        </p>
        <p className="text-slate-500 text-[11px] sm:text-[12px] mt-0.5">
          — {p.sub}
        </p>
      </div>
    </div>
  );
}
