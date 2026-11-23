import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function TopicCard({ t, i }) {
  const [ref, inView] = useInView();
  const Icon = t.icon;
  return (
    <Link
      ref={ref}
      href={t.href}
      style={{ transitionDelay: `${i * 0.06}s` }}
      className={`group relative flex flex-col bg-white rounded-2xl border border-slate-200 ${t.hoverBorder} p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: t.accent }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${t.iconBg} flex items-center justify-center`}
        >
          <Icon size={20} strokeWidth={1.75} style={{ color: t.accent }} />
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
          {t.articles} articles
        </span>
      </div>

      <h3 className="font-['Barlow_Condensed'] text-[20px] font-black text-slate-900 mb-2 leading-tight">
        {t.label}
      </h3>
      <p className="text-slate-500 text-[13px] leading-relaxed flex-1 mb-4">
        {t.desc}
      </p>

      <div
        className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${t.accentText} transition-colors`}
      >
        Read articles{" "}
        <ChevronRight
          size={13}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </div>
    </Link>
  );
}
