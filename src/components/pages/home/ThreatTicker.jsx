import { TICKER } from "@/data/home/data";

export default function ThreatTicker() {
  return (
    <div className="relative bg-slate-900 py-2.5 sm:py-3 overflow-hidden">
      <div className="absolute left-0 inset-y-0 z-10 flex items-center px-4 sm:px-5 bg-red-600">
        <span className="font-['Barlow_Condensed'] text-[9px] sm:text-[10px] font-black tracking-[0.22em] text-white uppercase whitespace-nowrap">
          LIVE SHIELD
        </span>
      </div>
      <div className="ml-24 sm:ml-32 overflow-hidden">
        <div className="ticker flex gap-8 sm:gap-10 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 sm:gap-3 shrink-0"
            >
              <span
                className={`font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.18em] ${t.color}`}
              >
                [{t.type}]
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] text-slate-400">
                {t.msg}
              </span>
              <span className="text-slate-700">·</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-0 inset-y-0 w-12 sm:w-16 bg-linear-to-l from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
}
