"use client";

import { useState } from "react";
import PlanCard from "./ServerProtectionCard2";
import PrivateRoute from "@/components/shared/PrivateRoute";

/* -data- */

const FEATURES_BY_PLAN = {
  free: [
    "Basic malware scanning",
    "Manual scan",
    "Standard support",
    "1 server protection",
    "Daily updates",
  ],
  standard: [
    "Advanced malware scanning",
    "Real-time protection",
    "Automatic updates",
    "1 server protection",
    "Priority support",
  ],
  "standard-ssl": [
    "Everything in Standard",
    "SSL certificate (Let's Encrypt)",
    "Encrypted data transmission",
    "HTTPS enforcement",
    "Better security & trust",
  ],
  premium: [
    "Everything in Standard",
    "Web application firewall (WAF)",
    "DDoS protection",
    "Malware removal support",
    "Performance optimization",
  ],
  "premium-ssl": [
    "Everything in Premium",
    "Premium SSL certificate",
    "Encrypted data transmission",
    "HTTPS enforcement",
    "Green address bar",
  ],
};

const INDIVIDUAL_PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Get essential protection running today.",
    monthly: 0,
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Advanced protection for everyday server usage.",
    monthly: 29.5,
  },
  {
    id: "standard-ssl",
    name: "Standard + SSL",
    tagline: "Enhanced protection with SSL encryption.",
    monthly: 49.5,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Complete protection for mission-critical servers.",
    monthly: 59.5,
    recommended: true,
  },
  {
    id: "premium-ssl",
    name: "Premium + SSL",
    tagline: "Ultimate protection with SSL encryption.",
    monthly: 79.5,
  },
];

const VOLUME_TIERS = [
  {
    id: "1000",
    label: "1,000 servers",
    minQty: 1000,
    partnerPct: 60,
    marginPct: 40,
  },
  {
    id: "3000",
    label: "3,000 servers",
    minQty: 3000,
    partnerPct: 50,
    marginPct: 50,
  },
  {
    id: "6000",
    label: "6,000 servers",
    minQty: 6000,
    partnerPct: 45,
    marginPct: 55,
  },
  {
    id: "10000",
    label: "10,000+ servers",
    minQty: 10000,
    partnerPct: 40,
    marginPct: 60,
  },
];

const ENTERPRISE_PLANS = [
  {
    id: "standard",
    name: "Standard",
    tagline: "Advanced protection for everyday server usage.",
    tiers: { 1000: 17.7, 3000: 14.75, 6000: 13.28, 10000: 11.8 },
  },
  {
    id: "standard-ssl",
    name: "Standard + SSL",
    tagline: "Enhanced protection with SSL encryption.",
    tiers: { 1000: 29.7, 3000: 24.75, 6000: 22.28, 10000: 19.8 },
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Complete protection for mission-critical servers.",
    recommended: true,
    tiers: { 1000: 35.7, 3000: 29.75, 6000: 26.78, 10000: 23.8 },
  },
  {
    id: "premium-ssl",
    name: "Premium + SSL",
    tagline: "Ultimate protection with SSL encryption.",
    tiers: { 1000: 47.7, 3000: 39.75, 6000: 35.78, 10000: 31.8 },
  },
];

const TERMS = [
  { id: "1", label: "1 month", months: 1, discount: 0 },
  { id: "6", label: "6 months", months: 6, discount: 0 },
  { id: "12", label: "12 months", months: 12, discount: 0.1 },
];

function resolveTierForQty(qty) {
  if (!qty || qty < 1000) return null;
  if (qty >= 10000) return "10000";
  if (qty >= 6000) return "6000";
  if (qty >= 3000) return "3000";
  return "1000";
}

const eur = (n) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
const eur0 = (n) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

/* pieces  */

function SegButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-['Outfit',sans-serif] font-bold tracking-tight transition-colors cursor-pointer ${
        active
          ? "bg-red-600 text-white shadow-xs"
          : "text-slate-600 hover:text-slate-900"
      }`}
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {children}
    </button>
  );
}

/*  component  */

export default function ServerProtection2() {
  const [mode, setMode] = useState("individual"); // individual | enterprise
  const [term, setTerm] = useState("1"); // 1 | 6 | 12
  const [tierId, setTierId] = useState("1000");
  const [useCustom, setUseCustom] = useState(false);
  const [customQty, setCustomQty] = useState("");

  const activeTierId = useCustom
    ? resolveTierForQty(Number(customQty))
    : tierId;
  const activeTier = VOLUME_TIERS.find((t) => t.id === activeTierId) || null;
  const qtyForCalc = useCustom
    ? Number(customQty) || 0
    : activeTier?.minQty || 0;
  const activeTerm = TERMS.find((t) => t.id === term);

  const plans = mode === "individual" ? INDIVIDUAL_PLANS : ENTERPRISE_PLANS;

  return (
    <section className="bg-slate-50 text-slate-900 px-6 md:px-10 py-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="mb-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs sm:text-[13px] font-['Outfit',sans-serif] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            BITSS PS — Protect Servers (all servers including nodes)
          </span>
        </div>
        <h2
          className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight whitespace-normal sm:whitespace-nowrap"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Choose the plan that protects your servers
        </h2>
        <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
          Malware scanning, SSL, and DDoS defense, priced for a single box or a
          ten-thousand-server fleet. Pick how you buy, then how many servers
          you&apos;re covering.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-full border border-slate-200 p-1 bg-white shadow-xs">
          <SegButton
            active={mode === "individual"}
            onClick={() => setMode("individual")}
          >
            Individual
          </SegButton>
          <SegButton
            active={mode === "enterprise"}
            onClick={() => setMode("enterprise")}
          >
            Enterprise
          </SegButton>
        </div>
      </div>

      {/* Enterprise: server count selector */}
      {mode === "enterprise" && (
        <div className="mb-6">
          <p className="text-center text-xs text-slate-500 mb-3">
            Select your licence commitment. One licence protects one server.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {VOLUME_TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setUseCustom(false);
                  setTierId(t.id);
                }}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  !useCustom && tierId === t.id
                    ? "border-red-600 text-red-600 bg-red-50"
                    : "border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400"
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={() => setUseCustom(true)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                useCustom
                  ? "border-red-600 text-red-600 bg-red-50"
                  : "border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400"
              }`}
            >
              Custom
            </button>
          </div>

          {useCustom && (
            <div className="mt-4 flex flex-col items-center gap-1">
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={customQty}
                onChange={(e) => setCustomQty(e.target.value)}
                placeholder="Enter number of servers"
                style={{ fontVariantNumeric: "tabular-nums" }}
                className="w-64 text-center bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600"
              />
              {Number(customQty) > 0 && !activeTier && (
                <p className="text-xs text-red-600">
                  Partner pricing starts at 1,000 servers — contact sales below
                  that.
                </p>
              )}
              {activeTier && (
                <p className="text-xs text-slate-500">
                  Priced at the {activeTier.label} tier.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Billing term toggle: 1 / 6 / 12 months */}
      <div className="flex justify-center items-center gap-1 text-sm mb-10">
        <div className="inline-flex rounded-full border border-slate-200 p-1 bg-white shadow-xs">
          {TERMS.map((t) => (
            <SegButton
              key={t.id}
              active={term === t.id}
              onClick={() => setTerm(t.id)}
            >
              {t.label}
              {t.discount > 0 && (
                <span
                  className={`${term === t.id ? "ml-1.5 text-white" : "ml-1.5 text-red-600"}`}
                >
                  save 10%
                </span>
              )}
            </SegButton>
          ))}
        </div>
      </div>

      {/* Plan cards */}

      <div
        className={`max-w-7xl grid gap-4  mx-auto pb-16 grid-cols-1 sm:grid-cols-2 ${mode === "individual" ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}
      >
        {plans.map((plan) => (
          <div key={plan.id}>
            {mode === "enterprise" ? (
              // <PrivateRoute>
              <PlanCard
                plan={plan}
                mode={"enterprise"}
                activeTerm={activeTerm}
                activeTier={activeTier}
                qtyForCalc={qtyForCalc}
              />
            ) : (
              // </PrivateRoute>
              // <PrivateRoute>
              <PlanCard
                plan={plan}
                mode={"individual"}
                activeTerm={activeTerm}
                activeTier={activeTier}
                qtyForCalc={qtyForCalc}
              />
              // </PrivateRoute>
            )}
          </div>
        ))}
      </div>

      {/* Enterprise spec panel */}
      {mode === "enterprise" && (
        <div className="max-w-6xl mx-auto pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-10">
            <div className="border-l-2 border-red-600 pl-4">
              <h4 className="font-semibold text-sm text-slate-900 mb-3">
                Volume structure
              </h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {VOLUME_TIERS.map((t) => (
                  <li key={t.id}>
                    <span className="text-slate-900">{t.label}:</span> partner
                    pays {t.partnerPct}% of retail, keeps a {t.marginPct}% gross
                    margin reselling at retail.
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-2 border-slate-200 pl-4">
              <h4 className="font-semibold text-sm text-slate-900 mb-3">
                Payment terms
              </h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  Minimum subscription: 1 month, billed monthly, 6-month or
                  12-month.
                </li>
                <li>1 & 6-month payment: monthly price × term.</li>
                <li>12-month payment: monthly price × 12, less 10%.</li>
                <li>
                  Hosting partners may package and resell services per their
                  commercial agreement.
                </li>
              </ul>
            </div>
            <div className="border-l-2 border-slate-200 pl-4">
              <h4 className="font-semibold text-sm text-slate-900 mb-3">
                Mixing products
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your licence commitment can be any mix of Standard, Standard +
                SSL, Premium and Premium + SSL. The final bulk invoice is
                calculated from your selected product mix and the volume tier it
                qualifies for.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-slate-500 pt-10 border-t border-slate-200">
        All plans include a 30-day money-back guarantee. Cancel anytime.
      </div>
    </section>
  );
}
