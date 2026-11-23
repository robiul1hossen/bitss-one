import { useInView } from "@/hooks/useInView";
import { CheckCircle2 } from "lucide-react";

export default function SectionBlock({ s, index }) {
  const [ref, inView] = useInView();
  const Icon = s.icon;
  return (
    <div
      id={s.id}
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      {/* Section header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`shrink-0 w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center`}
        >
          <Icon size={22} strokeWidth={1.75} style={{ color: s.accent }} />
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-widest text-slate-300 mb-1">
            {s.num}
          </p>
          <h2
            className="font-['Barlow_Condensed'] font-black text-slate-900 leading-tight"
            style={{ fontSize: "clamp(22px,3.5vw,34px)" }}
          >
            {s.title}
          </h2>
        </div>
      </div>

      {/* Callout box */}
      <div
        className={`flex gap-3 p-4 rounded-2xl border ${s.accentBg} ${s.accentBorder} mb-6`}
      >
        <div className={`shrink-0 mt-0.5 w-1 rounded-full ${s.accentDot}`} />
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${s.accentText}`}
          >
            {s.calloutLabel}
          </p>
          <p className="text-slate-700 text-[13px] leading-relaxed font-medium">
            {s.callout}
          </p>
        </div>
      </div>

      {/* Body paragraphs */}
      <div className="space-y-4 mb-6">
        {s.body.map((para, i) => (
          <p key={i} className="text-slate-600 text-[15px] leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Bullet list */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Key Defenses
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {s.bullets.map((b) => (
            <li
              key={b}
              className="flex items-center gap-2.5 text-[13px] text-slate-600"
            >
              <CheckCircle2
                size={14}
                strokeWidth={2}
                style={{ color: s.accent }}
                className="shrink-0"
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
