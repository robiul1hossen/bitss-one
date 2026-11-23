import { FEATURES_BY_PLAN } from "@/data/data";
import { eur, eur0 } from "@/utils/serverProtectrio/eur";

function buildSecondaryLine({
  mode,
  plan,
  activeTerm,
  activeTier,
  qtyForCalc,
}) {
  if (mode === "individual") {
    const total = plan.monthly * activeTerm.months * (1 - activeTerm.discount);
    if (plan.monthly === 0) return "Free forever";
    if (activeTerm.discount > 0) {
      return `Billed ${eur(total)} every 12 months · save ${eur(
        plan.monthly * activeTerm.months - total,
      )}`;
    }
    return `Billed ${eur(total)} every ${
      activeTerm.months === 1 ? "month" : `${activeTerm.months} months`
    }`;
  }

  const partner = activeTier ? plan.tiers[activeTier.id] : null;
  const total =
    partner && qtyForCalc > 0
      ? partner * qtyForCalc * activeTerm.months * (1 - activeTerm.discount)
      : null;

  if (total !== null) {
    return `${qtyForCalc.toLocaleString("en-IE")} servers · ${eur0(total)} / ${
      activeTerm.months === 1 ? "month" : `${activeTerm.months} months`
    }`;
  }
  return "Set a server count above";
}

export default function PlanCard({
  plan,
  mode,
  activeTerm,
  activeTier,
  qtyForCalc,
}) {
  const features = FEATURES_BY_PLAN[plan.id];
  const isRecommended = !!plan.recommended;

  const priceMonthly =
    mode === "individual"
      ? plan.monthly
      : activeTier
        ? plan.tiers[activeTier.id]
        : null;

  const secondaryLine = buildSecondaryLine({
    mode,
    plan,
    activeTerm,
    activeTier,
    qtyForCalc,
  });

  return (
    <div
      className={`flex flex-col rounded-xl border p-6 bg-white transition-all duration-300 ${
        isRecommended ? "border-2 border-red-600 shadow-lg shadow-red-500/10" : "border border-slate-200 shadow-xs hover:border-slate-300"
      }`}
    >
      {isRecommended && (
        <span
          className="self-start text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5 mb-3 tracking-wide uppercase font-['Outfit',sans-serif]"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Recommended
        </span>
      )}

      <h3
        className="font-['Outfit',sans-serif] font-bold text-xl sm:text-2xl text-slate-900 tracking-tight"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {plan.name}
      </h3>
      <p className="text-sm text-slate-500 mt-1 mb-6 leading-relaxed">
        {plan.tagline}
      </p>

      <div className="mb-1 flex items-baseline gap-1">
        <span
          className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {priceMonthly === null || priceMonthly === undefined
            ? "—"
            : eur(priceMonthly)}
        </span>
        <span className="text-sm text-slate-500 font-medium">/server/mo</span>
      </div>

      <div className="text-xs text-slate-500 mb-6 min-h-10">
        {secondaryLine}
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-slate-700">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-4 h-4 mt-0.5 shrink-0 text-red-600"
              aria-hidden="true"
            >
              <path
                d="M3 8.5L6.2 11.5L13 4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        className={`rounded-full py-2.5 px-4 text-sm font-['Outfit',sans-serif] font-bold tracking-tight transition-all active:scale-95 cursor-pointer ${
          isRecommended
            ? "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20"
            : "border border-slate-300 text-slate-900 hover:border-red-600 hover:text-red-600 hover:bg-red-50/50"
        }`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        Get started
      </button>
    </div>
  );
}
