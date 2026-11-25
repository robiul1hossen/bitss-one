"use client";

import { ChevronRight, BookOpen, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/shared/CTA";
import { useActiveSection } from "../useActiveSection";
import { OTHER_TOPICS, SECTIONS } from "@/data/securityAcademy/serverSecurity";
import Hero from "./Hero";
import SectionBlock from "./SectionBlock";

export default function ServerSecurity() {
  const sectionIds = SECTIONS.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds);
  const scrollTo = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

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
        .dot-grid{ background-image:radial-gradient(circle,#e2e8f0 1.5px,transparent 1.5px); background-size:26px 26px; }
        .sub-grid{
          background-image: linear-gradient(rgba(220,38,38,.05) 1px,transparent 1px), linear-gradient(90deg,rgba(220,38,38,.05) 1px,transparent 1px);
          background-size:48px 48px;
        }
      `}</style>

      {/* ── HERO ── */}
      <Hero />

      {/* ── MAIN CONTENT ── */}
      <div className="relative bg-slate-50">
        <div className="sub-grid absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-18 lg:py-20">
          <div className="lg:grid lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-12 lg:gap-16 items-start">
            {/* Sticky Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">
                  In This Guide
                </p>
                <nav className="flex flex-col gap-1">
                  {SECTIONS.map((s) => {
                    const isActive = activeSection === s.id;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => scrollTo(s.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${isActive ? "bg-white shadow-sm border border-slate-100" : "hover:bg-white/60"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? s.iconBg : "bg-slate-100 group-hover:bg-slate-200"}`}
                        >
                          <Icon
                            size={12}
                            style={{ color: isActive ? s.accent : "#94a3b8" }}
                          />
                        </div>
                        <span
                          className={`text-[12px] font-medium leading-tight transition-colors ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}
                        >
                          {s.title}
                        </span>
                        {isActive && (
                          <div
                            className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: s.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-8 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center mb-3">
                    <ShieldCheck size={15} className="text-white" />
                  </div>
                  <p className="font-['Barlow_Condensed'] text-[15px] font-black text-white mb-1">
                    SECURE YOUR SERVER
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
                    Bitss VWAR Web scans your server-side files and database
                    continuously — detecting intrusions before damage spreads.
                  </p>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[12px] font-semibold transition-colors"
                  >
                    Get Protected <ArrowRight size={11} />
                  </Link>
                </div>

                <div className="mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">
                    Other Topics
                  </p>
                  <div className="flex flex-col gap-1">
                    {OTHER_TOPICS.map((t) => (
                      <Link
                        key={t.label}
                        href={t.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <BookOpen
                          size={11}
                          className="shrink-0 text-slate-300"
                        />
                        {t.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Article Sections */}
            <main className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
              {SECTIONS.map((s, i) => (
                <SectionBlock key={s.id} s={s} index={i} />
              ))}

              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                    Next Topic
                  </p>
                  <Link
                    href="/security-academy/spam-protection"
                    className="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-800 hover:text-red-600 transition-colors"
                  >
                    Spam Protection <ChevronRight size={15} />
                  </Link>
                </div>
                <Link
                  href="/security-academy"
                  className="inline-flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-800 transition-colors"
                >
                  ← Back to Security Academy
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>

      <CTA />
    </>
  );
}
