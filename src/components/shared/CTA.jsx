import { Clock, Mail, Phone, Zap } from "lucide-react";

const buttons = [
  {
    href: "mailto:support@bobosohomail.com",
    icon: Mail,
    label: "Request a Demo",
    primary: true,
  },
  {
    href: "tel:+0033666100010",
    icon: Phone,
    label: "Talk to an Expert",
    primary: false,
  },
];

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "support@bobosohomail.com",
    href: "mailto:support@bobosohomail.com",
  },
  {
    icon: Phone,
    label: "Hotline",
    value: "+0033 666 100 010",
    href: "tel:+0033666100010",
  },
  {
    icon: Clock,
    label: "Support",
    value: "24/7 · 365 days",
    href: null,
  },
];

export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative py-10 sm:py-14 bg-slate-950 overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-amber-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(220,38,38,0.12)_0%,transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase mb-3.5 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Start Today
        </span>

        <h2
          className="font-['Outfit'] font-black text-white leading-tight tracking-tight mb-3"
          style={{ fontSize: "clamp(26px,4vw,42px)" }}
        >
          READY TO{" "}
          <span className="text-red-500">FIGHT BACK?</span>
        </h2>

        <p className="text-slate-400 text-[13px] sm:text-[15px] leading-relaxed max-w-xl mx-auto mb-6 sm:mb-7 px-2 sm:px-0">
          Request a free demo and see Bitss in action across all five security
          layers — or get a custom quote for your organization.
        </p>

        {/* CTA Buttons — side-by-side on mobile and desktop (compact) */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-2.5 mb-5 sm:mb-6 max-w-xs sm:max-w-sm mx-auto w-full px-1 sm:px-0">
          {buttons.map(({ href, icon: Icon, label, primary }) =>
            primary ? (
              <a
                key={label}
                href={href}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] sm:text-[13px] transition-all duration-200 shadow-sm shadow-red-900/40 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> {label}
              </a>
            ) : (
              <a
                key={label}
                href={href}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-700/80 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-[11px] sm:text-[13px] transition-all duration-200 hover:bg-slate-800/80 whitespace-nowrap"
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> {label}
              </a>
            ),
          )}
        </div>

        {/* Contact strip — 3 columns across in one line on mobile too */}
        <div className="grid grid-cols-3 gap-1.5 xs:gap-3 sm:gap-6 pt-3.5 sm:pt-5 border-t border-slate-800/80">
          {contacts.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="text-center group min-w-0">
              <div className="flex items-center justify-center mb-1 sm:mb-1.5">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-red-500/40 group-hover:bg-red-500/10 flex items-center justify-center transition-all duration-200">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
                </div>
              </div>
              <div className="font-mono text-[7.5px] sm:text-[9.5px] text-slate-400 tracking-wider uppercase mb-0.5 font-semibold">
                {label}
              </div>
              {href ? (
                <a
                  href={href}
                  className="text-[8px] xs:text-[10px] sm:text-[13px] text-white hover:text-red-400 font-medium transition-colors duration-200 whitespace-nowrap tracking-tight xs:tracking-normal block truncate sm:overflow-visible"
                >
                  {value}
                </a>
              ) : (
                <span className="text-[8px] xs:text-[10px] sm:text-[13px] text-white font-medium whitespace-nowrap tracking-tight xs:tracking-normal block truncate sm:overflow-visible">
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
