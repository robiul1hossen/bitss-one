import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SECTIONS } from "@/data/securityAcademy/serverSecurity";
import Tag from "../Tag";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16">
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_65%_30%,rgba(254,242,242,0.9)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-24">
        <nav className="fu1 flex items-center gap-2 text-[12px] text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <a
            href="/security-academy"
            className="hover:text-slate-600 transition-colors"
          >
            Security Academy
          </a>
          <ChevronRight size={12} />
          <span className="text-red-500">Server Security</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
          <div>
            <div className="fu1 mb-5">
              <Tag>Security Academy</Tag>
            </div>
            <h1
              className="fu2 font-['Barlow_Condensed'] font-black leading-[0.88] tracking-tight text-slate-900 mb-5"
              style={{ fontSize: "clamp(44px,7vw,80px)" }}
            >
              SERVER
              <br />
              <span className="text-red-600">SECURITY</span>
            </h1>
            <p className="fu3 text-slate-500 text-[15px] sm:text-[16px] leading-relaxed max-w-md">
              From firewalls and SSH hardening to DNS protection and intrusion
              detection — everything you need to lock down your server
              infrastructure.
            </p>
          </div>

          <div className="fu3 grid grid-cols-1 gap-2">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-left transition-all duration-200 group shadow-sm"
                >
                  <span className="font-mono text-[10px] text-slate-300 w-5 shrink-0">
                    {s.num}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={13} style={{ color: s.accent }} />
                  </div>
                  <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors font-medium flex-1">
                    {s.title}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-slate-300 group-hover:text-red-500 transition-colors shrink-0"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
