import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";
import Tag from "./Tag";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16">
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_65%_30%,rgba(254,242,242,0.9)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-20 lg:py-24">
        <nav className="fu1 flex items-center gap-2 text-[12px] text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-red-500">Why BITSS</span>
        </nav>

        <div className="max-w-3xl">
          <div className="fu1 mb-5">
            <Tag>Why BITSS</Tag>
          </div>
          <h1
            className="fu2 font-['Barlow_Condensed'] font-black leading-[0.88] tracking-tight text-slate-900 mb-6"
            style={{ fontSize: "clamp(48px,8vw,96px)" }}
          >
            WE DON&apos;T FOLLOW.
            <br />
            <span className="text-red-600">OTHERS FOLLOW US.</span>
          </h1>
          <p className="fu3 text-slate-500 text-[16px] sm:text-[18px] leading-relaxed max-w-xl mb-8">
            While others copy — we build. While others rely on third party tools
            — we created our own. BITSS is not just a security product — it is a
            superior security system built from the ground up.
          </p>
          <div className="fu4 flex flex-col xs:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-[14px] transition-all duration-200 shadow-sm shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 w-full xs:w-auto"
            >
              <Zap size={15} /> Get Protected
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-[14px] transition-all duration-200 hover:bg-slate-50 w-full xs:w-auto"
            >
              See All Protections <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
