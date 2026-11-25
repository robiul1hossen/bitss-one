"use client";

import { Zap } from "lucide-react";
import Tag from "./Tag";
import Hero from "./Hero";
import { COMPARISON, PILLARS, PROMISES, PROTECTIONS } from "@/data/whyBitss";
import ProtectionCard from "./ProtectionCard";
import ComparisonRow from "./ComparisonRow";
import PromiseCard from "./PromiseCard";
import Link from "next/link";

export default function WhyBitssPage() {
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

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── PILLARS STRIP ──────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-12 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-700/30">
            {PILLARS.map((item) => {
              const IIcon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-slate-900 p-6 sm:p-7 lg:p-8 hover:bg-slate-800 transition-colors"
                >
                  <IIcon
                    size={20}
                    strokeWidth={1.5}
                    className="text-red-500 mb-3 sm:mb-4"
                  />
                  <h4 className="font-['Barlow_Condensed'] text-[16px] sm:text-[17px] font-black text-white mb-1.5 sm:mb-2 tracking-wide">
                    {item.label}
                  </h4>
                  <p className="text-slate-400 text-[13px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── COMPARISON TABLE ───────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden">
        <div className="sub-grid absolute inset-0" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12 sm:mb-16">
            <Tag>The Difference</Tag>
            <h2
              className="font-['Barlow_Condensed'] font-black text-slate-900 mt-4 sm:mt-5 mb-3 leading-none"
              style={{ fontSize: "clamp(28px,5vw,54px)" }}
            >
              WHY BITSS IS <span className="text-red-600">SUPERIOR</span>
            </h2>
            <p className="text-slate-500 text-[14px] sm:text-[15px] max-w-sm mx-auto leading-relaxed">
              Side by side — what the industry does vs what we built.
            </p>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
            <div className="bg-slate-200 rounded-xl px-5 py-3 text-center">
              <span className="font-['Barlow_Condensed'] text-[13px] sm:text-[14px] font-black text-slate-500 tracking-wide uppercase">
                What Others Do
              </span>
            </div>
            <div className="bg-red-600 rounded-xl px-5 py-3 text-center">
              <span className="font-['Barlow_Condensed'] text-[13px] sm:text-[14px] font-black text-white tracking-wide uppercase">
                ✅ What BITSS Does
              </span>
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {COMPARISON.map((row, i) => (
              <ComparisonRow key={i} row={row} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTECTIONS GRID ───────────────────────────────────────────── */}
      <section
        id="protections"
        className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden"
      >
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-14">
            <div>
              <Tag>Your Safety is Our Priority</Tag>
              <h2
                className="font-['Barlow_Condensed'] font-black text-slate-900 mt-4 leading-none"
                style={{ fontSize: "clamp(28px,5vw,54px)" }}
              >
                10 LAYERS OF <span className="text-red-600">PROTECTION</span>
              </h2>
            </div>
            <p className="text-slate-500 text-[14px] max-w-xs sm:max-w-sm leading-relaxed">
              Every attack vector covered — from SQL injections to hidden
              rootkits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {PROTECTIONS.map((item, i) => (
              <ProtectionCard key={item.label} item={item} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROMISE ────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(220,38,38,0.12)_0%,transparent_70%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <Tag>The BITSS Promise</Tag>
          <h2
            className="font-['Barlow_Condensed'] font-black text-white mt-4 sm:mt-5 mb-4 leading-none"
            style={{ fontSize: "clamp(28px,5vw,54px)" }}
          >
            YOUR DATA IS SAFE —{" "}
            <span className="text-red-500">NOT BECAUSE WE SAY SO.</span>
          </h2>
          <p className="text-slate-400 text-[14px] sm:text-[15px] leading-relaxed mb-12 max-w-lg mx-auto">
            Because we built the system that makes it so.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {PROMISES.map((p, i) => (
              <PromiseCard key={i} p={p} i={i} />
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="mailto:support@bobosohomail.com"
              className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-[14px] sm:text-[15px] transition-all duration-300 shadow-lg shadow-red-900/40 hover:-translate-y-0.5 w-full xs:w-auto"
            >
              <Zap size={16} /> Request a Demo
            </Link>
            <Link
              href="tel:+0033666100010"
              className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-[14px] sm:text-[15px] transition-all duration-300 hover:bg-slate-800 w-full xs:w-auto"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
