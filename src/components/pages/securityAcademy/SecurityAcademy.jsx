"use client";

import { Bug, ShieldCheck, Shield, Usb } from "lucide-react";
import CTA from "@/components/shared/CTA";
import TopicCard from "./TopicCard";
import { PRODUCTS, TOPICS } from "@/data/securityAcademy/securityAcademy";
import Tag from "./Tag";
import Hero from "./Hero";
import ProductCard from "./ProductCard";

export default function SecurityAcademy() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        body { background:#fff; font-family:'Poppins',sans-serif; overflow-x:hidden; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#f1f5f9; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:9999px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .fu1{animation:fadeUp .6s ease forwards .08s;opacity:0}
        .fu2{animation:fadeUp .6s ease forwards .22s;opacity:0}
        .fu3{animation:fadeUp .6s ease forwards .36s;opacity:0}
        .fu4{animation:fadeUp .6s ease forwards .46s;opacity:0}
        .dot-grid{ background-image:radial-gradient(circle,#e2e8f0 1.5px,transparent 1.5px); background-size:26px 26px; }
        .sub-grid{
          background-image: linear-gradient(rgba(220,38,38,.05) 1px,transparent 1px), linear-gradient(90deg,rgba(220,38,38,.05) 1px,transparent 1px);
          background-size:48px 48px;
        }
      `}</style>

      {/* ── HERO ── */}
      <Hero />
      {/* ── TOPICS GRID ── */}
      <section className="relative bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="sub-grid absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-10 sm:mb-14">
            <Tag>Browse Topics</Tag>
            <h2
              className="font-['Barlow_Condensed'] font-black text-slate-900 mt-4 leading-none"
              style={{ fontSize: "clamp(28px,5vw,52px)" }}
            >
              CHOOSE YOUR <span className="text-red-600">TOPIC</span>
            </h2>
            <p className="text-slate-500 text-[14px] mt-3 max-w-md leading-relaxed">
              Each topic covers a specific attack surface with practical,
              authoritative guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOPICS.map((t, i) => (
              <TopicCard key={t.label} t={t} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW BITSS PROTECTS ── */}
      <section className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Intro */}
          <div className="max-w-3xl mb-14 sm:mb-18">
            <Tag>How Bitss Protects Against This</Tag>
            <h2
              className="font-['Barlow_Condensed'] font-black text-slate-900 mt-4 mb-5 leading-none"
              style={{ fontSize: "clamp(28px,5vw,52px)" }}
            >
              PROACTIVE DEFENSE.{" "}
              <span className="text-red-600">EVERY LAYER.</span>
            </h2>
            <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mb-4">
              Cyber threats described across this academy are part of the daily
              reality of the modern internet. Automated attack systems
              continuously scan websites, servers, and networks looking for
              vulnerabilities they can exploit.
            </p>
            <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mb-4">
              At Bitss, we design cybersecurity technologies specifically to
              detect, block, and neutralize these types of threats before they
              can cause damage. Our security systems focus on proactive
              protection rather than simply reacting after an attack has already
              occurred.
            </p>
            <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed">
              By monitoring behavior patterns, filtering malicious traffic, and
              detecting abnormal system activity, Bitss solutions help prevent
              attacks at the earliest stages.
            </p>
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.name} p={p} i={i} />
            ))}
          </div>

          {/* Layered defense callout */}
          <div className="relative rounded-3xl bg-slate-900 overflow-hidden p-8 sm:p-10 lg:p-12">
            <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_0%_50%,rgba(220,38,38,0.10)_0%,transparent_70%)]" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3">
                  A Layered Security Approach
                </p>
                <h3
                  className="font-['Barlow_Condensed'] font-black text-white leading-tight mb-4"
                  style={{ fontSize: "clamp(24px,4vw,42px)" }}
                >
                  ONE ECOSYSTEM.{" "}
                  <span className="text-red-500">FULL CHAIN.</span>
                </h3>
                <p className="text-slate-400 text-[14px] sm:text-[15px] leading-relaxed">
                  Cybersecurity threats rarely rely on a single attack method.
                  Most successful compromises occur when multiple
                  vulnerabilities are exploited together. Bitss security
                  technologies operate as a layered defense system — login
                  protection, malware detection, traffic filtering, and
                  behavioral monitoring working together to reduce your attack
                  surface.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: Shield,
                    label: "Login Protection",
                    desc: "Admin & portal hardening",
                  },
                  {
                    icon: Bug,
                    label: "Malware Detection",
                    desc: "File & behavior scanning",
                  },
                  {
                    icon: ShieldCheck,
                    label: "Traffic Filtering",
                    desc: "Block before it arrives",
                  },
                  {
                    icon: Usb,
                    label: "Media Control",
                    desc: "USB & removable devices",
                  },
                ].map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-colors"
                  >
                    <Icon
                      size={16}
                      className="text-red-400 mb-2"
                      strokeWidth={1.75}
                    />
                    <p className="text-[12px] font-semibold text-white mb-0.5">
                      {label}
                    </p>
                    <p className="text-[11px] text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
