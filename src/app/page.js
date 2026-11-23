import Products from "@/components/pages/home/Products";
import Hero from "@/components/pages/home/Hero";
import CoreServicesHeader from "@/components/pages/home/CoreServicesHeader";
import CoreServices from "@/components/pages/home/CoreServices";
import CTA from "@/components/shared/CTA";

import "swiper/css";
import "swiper/css/navigation";
import ThreatTicker from "@/components/pages/home/ThreatTicker";
import WhyBitss from "@/components/pages/home/WhyBitss";
import BundleOffers from "@/components/pages/home/BundleOffers";
import Testimonials from "@/components/pages/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        body { background:#fff; font-family:'Poppins',sans-serif; overflow-x:hidden; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#f1f5f9; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:9999px; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-11px)} }
        @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        // .fu1{animation:fadeUp .6s ease forwards .08s;opacity:0}
        .fu2{animation:fadeUp .6s ease forwards .20s;opacity:0}
        .fu3{animation:fadeUp .6s ease forwards .33s;opacity:0}
        .fu4{animation:fadeUp .6s ease forwards .46s;opacity:0}
        .fu5{animation:fadeUp .6s ease forwards .60s;opacity:0}
        .shield-float{animation:floatY 4.5s ease-in-out infinite}
        .spin-cw {animation:spinRing 24s linear infinite}
        .spin-ccw{animation:spinRing 18s linear infinite reverse}
        .ticker  {animation:ticker 40s linear infinite}
        .dot-grid{
          background-image:radial-gradient(circle,#e2e8f0 1.5px,transparent 1.5px);
          background-size:26px 26px;
        }
        .sub-grid{
          background-image:
            linear-gradient(rgba(220,38,38,.05) 1px,transparent 1px),
            linear-gradient(90deg,rgba(220,38,38,.05) 1px,transparent 1px);
          background-size:48px 48px;
        }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── THREAT TICKER ──────────────────────────────────────────────── */}
      <ThreatTicker />

      {/* ── CORE SERVICES HEADER ───────────────────────────────────────── */}
      <CoreServicesHeader />

      {/* ── CORE SERVICES CARDS ────────────────────────────────────────── */}
      <CoreServices />

      {/* ── ECOSYSTEM ──────────────────────────────────────────────────── */}
      {/* <Ecosystem /> */}

      {/* ── PRODUCTS ───────────────────────────────────────────────────── */}
      <Products />

      {/* ── WHY BITSS STRIP ────────────────────────────────────────────── */}
      <WhyBitss />
      {/* ── BUNDLES ────────────────────────────────────────────────────── */}
      <BundleOffers />

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <Testimonials />

      <CTA />
    </>
  );
}
