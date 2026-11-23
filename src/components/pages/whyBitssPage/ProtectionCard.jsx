import { useInView } from "@/hooks/useInView";
import { useState } from "react";

export default function ProtectionCard({ item, i }) {
  const [ref, inView] = useInView();
  const [hov, setHov] = useState(false);
  const Icon = item.icon;
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ transitionDelay: `${i * 0.05}s` }}
      className={`relative flex flex-col bg-white rounded-2xl border p-5 sm:p-6 transition-all duration-500
        ${hov ? `border-transparent shadow-xl shadow-slate-200/80 -translate-y-1 ${item.hoverBorder}` : "border-slate-200 shadow-sm"}
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300"
        style={{ background: hov ? "currentColor" : "transparent" }}
      />
      <p className="font-mono text-[10px] tracking-widest text-slate-300 mb-3">
        {String(i + 1).padStart(2, "0")}
      </p>
      <div
        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 transition-all duration-300 ${item.bg} ${hov ? "scale-110" : ""}`}
      >
        <Icon size={20} strokeWidth={1.75} className={item.accent} />
      </div>
      <h3 className="font-['Barlow_Condensed'] text-[18px] sm:text-[20px] font-black text-slate-900 leading-tight mb-2">
        {item.label}
      </h3>
      <p className="text-slate-500 text-[13px] leading-relaxed flex-1">
        {item.desc}
      </p>
      <div className="pt-4 mt-4 border-t border-slate-100">
        <div
          className={`flex items-center gap-2 text-[12px] font-semibold ${item.accent}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${item.dot} animate-pulse`}
          />
          Active protection
        </div>
      </div>
    </div>
  );
}
