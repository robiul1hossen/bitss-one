import { ChevronRight } from "lucide-react";
import React from "react";
import Tag from "./Tag";
import Link from "next/link";

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
          <span className="text-red-500">Security Academy</span>
        </nav>

        <div className="max-w-3xl">
          <div className="fu1 mb-5">
            <Tag>Free Resource</Tag>
          </div>
          <h1
            className="fu2 font-['Barlow_Condensed'] font-black leading-[0.88] tracking-tight text-slate-900 mb-6"
            style={{ fontSize: "clamp(48px,8vw,88px)" }}
          >
            SECURITY
            <br />
            <span className="text-red-600">ACADEMY</span>
          </h1>
          <p className="fu3 text-slate-500 text-[16px] sm:text-[18px] leading-relaxed max-w-xl mb-8">
            Free cybersecurity guides written for business owners — covering
            every attack surface from website login pages to server
            infrastructure.
          </p>
          <div className="fu4 flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-2 text-[13px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 6
              topics
            </span>
            <span className="flex items-center gap-2 text-[13px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 30
              articles
            </span>
            <span className="flex items-center gap-2 text-[13px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
              Always free
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
