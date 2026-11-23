"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInView } from "@/hooks/useInView";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BundleCard({ b, i }) {
  const [ref, inView] = useInView();
  const Icon = b.icon;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${i * 0.1}s` }}
      className={`relative w-full sm:flex-1 sm:min-w-60 sm:max-w-85 rounded-2xl border-2 p-6 sm:p-8 transition-all duration-500
        ${b.border} ${b.bg}
        ${b.popular ? "shadow-2xl shadow-red-100 sm:scale-[1.03]" : "shadow-sm hover:shadow-lg hover:-translate-y-1"}
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      {b.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-4 sm:px-5 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-red-200">
          ★ Most Popular
        </div>
      )}

      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div
          className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${b.iconBg}`}
        >
          <Icon size={21} strokeWidth={1.75} className={b.iconColor} />
        </div>
      </div>

      <h3 className="font-['Barlow_Condensed'] text-[22px] sm:text-[24px] font-black text-slate-900 mb-1">
        {b.name}
      </h3>
      <p className="text-slate-500 text-[13px] mb-5 sm:mb-6 leading-relaxed">
        {b.desc}
      </p>

      <TooltipProvider delayDuration={150}>
        <ul className="space-y-2.5 mb-6 sm:mb-8">
          {b.products.map((prod) => {
            const detail = b.fullDesc?.find((f) => f.title === prod);
            return (
              <li key={prod}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 text-[13px] text-slate-700 hover:text-red-600 cursor-default w-fit">
                      <CheckCircle2
                        size={14}
                        strokeWidth={2}
                        className={`shrink-0 ${b.checkColor}`}
                      />
                      {prod}
                    </div>
                  </TooltipTrigger>
                  {detail && (
                    <TooltipContent
                      side="top"
                      className="bg-white border border-red-200 text-neutral-600 text-sm leading-relaxed shadow-lg max-w-64"
                    >
                      {detail.text}
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </TooltipProvider>

      <Link
        href="/contact"
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-[14px] tracking-wide transition-all duration-300 ${b.btnClass}`}
      >
        Request a Demo <ArrowRight size={14} />
      </Link>
    </div>
  );
}
