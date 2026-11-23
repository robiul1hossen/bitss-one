import { useInView } from "@/hooks/useInView";
import { CheckCircle2 } from "lucide-react";

export default function ProductCard({ p, i }) {
  const [ref, inView] = useInView();
  const Icon = p.icon;
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${i * 0.08}s` }}
      className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon size={18} strokeWidth={1.75} style={{ color: p.accent }} />
        </div>
        <div>
          <h3 className="font-['Barlow_Condensed'] text-[18px] font-black text-slate-900 leading-tight">
            {p.name}
          </h3>
          <p
            className={`text-[10px] font-semibold uppercase tracking-wide ${p.accentText}`}
          >
            {p.full}
          </p>
        </div>
      </div>
      <p className="text-slate-500 text-[13px] leading-relaxed mb-4">
        {p.desc}
      </p>
      <ul className="space-y-1.5">
        {p.points.map((pt) => (
          <li
            key={pt}
            className="flex items-center gap-2 text-[12px] text-slate-600"
          >
            <CheckCircle2
              size={12}
              strokeWidth={2}
              style={{ color: p.accent }}
              className="shrink-0"
            />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}
