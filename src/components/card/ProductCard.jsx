"use client";

import { ChevronRight, ShieldCheck, Package, Usb, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

// ─── Stack Logo SVGs (WordPress, Windows, JavaScript, Server) ─────────────────
function WordPressLogo({ className = "w-5 h-5", style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.087 18.777L6.47 6.425a9.497 9.497 0 0 1 4.443-1.113c.89 0 1.748.125 2.56.353l-2.56 13.112zm4.195-1.248l3.195-9.35c.95 1.12 1.547 2.535 1.67 4.077-.123.63-.448 1.95-1.025 3.024l-3.84 2.249zm-8.495-3.07L2.43 8.35a9.475 9.475 0 0 1 4.183-1.921zm10.74-9.336c.03.18.045.37.045.57 0 1.34-.69 2.56-1.74 3.23l-3.21-9.15c2.19.86 3.97 2.45 4.905 5.35zM12 21.6A9.6 9.6 0 1 1 21.6 12 9.61 9.61 0 0 1 12 21.6z" />
    </svg>
  );
}

function WindowsLogo({ className = "w-4.5 h-4.5", style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.573L24 0v11.551H10.949V1.876zM0 12.6h9.75V22.05L0 20.701V12.6zm10.949 0H24V24l-13.051-1.875V12.6z" />
    </svg>
  );
}

function JavaScriptLogo({ className = "w-4.5 h-4.5", style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034-1.2.03-2.101.555-2.626 1.426-.765 1.29-.405 3.03.885 3.75 1.35.795 2.506.946 2.761 1.606.255.66-.18 1.155-1.29 1.185-.886.015-1.471-.345-1.921-.93l-1.815 1.05c.345.69.75 1.185 1.305 1.53 1.095.66 2.716.735 3.841.226 1.17-.525 1.74-1.44 1.88-2.439v-.004zm-8.882-6.526h-2.146v7.351c0 1.395-.12 2.16-.72 2.655-.585.48-1.47.45-2.07.24-.39-.15-.72-.375-.975-.69-.21-.24-.36-.48-.48-.735l1.86-1.14c.12.21.24.405.42.54.24.165.6.27.9.15.345-.135.45-.495.45-1.17v-7.201H9.885v-1.92h3.267v1.92z" />
    </svg>
  );
}

function ServerLogo({ className = "w-4.5 h-4.5", style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

// ─── Framework / Tech Badge SVGs (JS, React, Node, PHP, Astro, HTML) ─────────
function JSBadgeLogo({ className = "w-3.5 h-3.5 text-white" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034-1.2.03-2.101.555-2.626 1.426-.765 1.29-.405 3.03.885 3.75 1.35.795 2.506.946 2.761 1.606.255.66-.18 1.155-1.29 1.185-.886.015-1.471-.345-1.921-.93l-1.815 1.05c.345.69.75 1.185 1.305 1.53 1.095.66 2.716.735 3.841.226 1.17-.525 1.74-1.44 1.88-2.439v-.004zm-8.882-6.526h-2.146v7.351c0 1.395-.12 2.16-.72 2.655-.585.48-1.47.45-2.07.24-.39-.15-.72-.375-.975-.69-.21-.24-.36-.48-.48-.735l1.86-1.14c.12.21.24.405.42.54.24.165.6.27.9.15.345-.135.45-.495.45-1.17v-7.201H9.885v-1.92h3.267v1.92z" />
    </svg>
  );
}

function ReactBadgeLogo({ className = "w-3.5 h-3.5 text-white" }) {
  return (
    <svg viewBox="-11.5 -10.23 23 20.46" fill="currentColor" className={className}>
      <circle cx="0" cy="0" r="2.05" />
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function NodeBadgeLogo({ className = "w-3.5 h-3.5 text-white" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a1.5 1.5 0 0 0-.75.2L4.5 6.2a1.5 1.5 0 0 0-.75 1.3v8a1.5 1.5 0 0 0 .75 1.3l6.75 4a1.5 1.5 0 0 0 1.5 0l6.75-4a1.5 1.5 0 0 0 .75-1.3v-8a1.5 1.5 0 0 0-.75-1.3L12.75 2.2A1.5 1.5 0 0 0 12 2zm-1 5.5h2v9h-2v-9z" />
    </svg>
  );
}

function PhpBadgeLogo({ className = "w-3.5 h-3.5 text-white" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3C6.48 3 2 7.03 2 12s4.48 9 10 9 10-4.03 10-9-4.48-9-10-9zm-6.2 12.2l1.2-6.4h1.7c1.3 0 2.2.8 2 2.1-.3 1.5-1.4 2.3-2.6 2.3H7.1l-.5 2h-.8zm3.6-2.8l.9-4.8h1.7c.8 0 1.3.5 1.1 1.3-.2.9-.8 1.4-1.6 1.4h-1.3l-.4 2.1h-.4zm6.6 2.8l1.2-6.4h1.7c1.3 0 2.2.8 2 2.1-.3 1.5-1.4 2.3-2.6 2.3h-1l-.5 2h-.8z" />
    </svg>
  );
}

function AstroBadgeLogo({ className = "w-3.5 h-3.5 text-white" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.5 18c-.4-.5-.6-1.1-.6-1.8 0-1.8 1.5-3.7 4.1-3.7 2.6 0 4.1 1.9 4.1 3.7 0 .7-.2 1.3-.6 1.8 2.1-1.4 3.5-3.8 3.5-6.5C19 6.8 15.9 3 12 3S5 6.8 5 11.5c0 2.7 1.4 5.1 3.5 6.5zm3.5-10.5l4.2 9h-1.8l-.9-2h-3.1l-.9 2H7.8l4.2-9zm-.8 5.2h1.6L12 11l-.8 1.7z" />
    </svg>
  );
}

function HtmlBadgeLogo({ className = "w-3.5 h-3.5 text-white" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 2l1.6 18.2L12 22l7.4-1.8L21 2H3zm15.1 5.3h-8.9l.2 2.4h8.5l-.8 8.8-4.9 1.4-4.9-1.4-.3-3.6h2.4l.2 1.8 2.6.7 2.6-.7.3-3.2H6.9l-.7-8.2h12.2l-.2 2z" />
    </svg>
  );
}

const BITSS_C_BADGES = [
  { name: "JS", bg: "bg-[#F59E0B]", darkColor: "#B45309", Icon: JSBadgeLogo },
  { name: "REACT", bg: "bg-[#0284C7]", darkColor: "#0369A1", Icon: ReactBadgeLogo },
  { name: "NODE", bg: "bg-[#16A34A]", darkColor: "#15803D", Icon: NodeBadgeLogo },
  { name: "PHP", bg: "bg-[#6366F1]", darkColor: "#4338CA", Icon: PhpBadgeLogo },
  { name: "ASTRO", bg: "bg-[#8B5CF6]", darkColor: "#6D28D9", Icon: AstroBadgeLogo },
  { name: "HTML", bg: "bg-[#EA580C]", darkColor: "#C2410C", Icon: HtmlBadgeLogo },
];

// ─── Resolve Stack Info & Unified Color Accent per Product (Official Brand Colors) ───
export function resolveStack(product) {
  if (!product) {
    return {
      type: "wp",
      label: "WordPress",
      Icon: WordPressLogo,
      bannerBg: "bg-[#0073AA]", // Official WordPress Blue
      darkColor: "#005177",
      accent: "#0073AA",
      hoverBorder: "hover:border-sky-300",
      accentDot: "bg-[#0073AA]",
      accentBtn: "text-[#0073AA] hover:text-[#005177]",
      shadowColor: "shadow-sky-500/10",
    };
  }

  const name = (product.name || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();
  const id = product.id;

  // BITSS C (Multi-framework contact form protection)
  if (
    id === 74 ||
    slug.includes("bitss-c") ||
    (name.includes("bitss c") && !name.includes("pack") && !name.includes("suite"))
  ) {
    return {
      type: "bitss-c",
      label: "Multi-Stack",
      Icon: JavaScriptLogo,
      bannerBg: "bg-[#D97706]",
      darkColor: "#92400E",
      accent: "#D97706",
      hoverBorder: "hover:border-amber-300",
      accentDot: "bg-[#D97706]",
      accentBtn: "text-[#D97706] hover:text-[#92400e]",
      shadowColor: "shadow-amber-500/10",
    };
  }

  // Windows & Web Suite (Bundle)
  if (
    id === 27 ||
    (name.includes("windows") && (name.includes("web") || name.includes("wordpress"))) ||
    slug.includes("web-windows") ||
    ((name.includes("windows") || slug.includes("windows")) &&
      (name.includes("web") || slug.includes("web") || name.includes("wordpress")))
  ) {
    return {
      type: "win-web",
      label: "Windows & WordPress",
      Icon: WindowsLogo,
      bannerBg: "bg-[#0078D4]",
      darkColor: "#004E8C",
      accent: "#0078D4",
      hoverBorder: "hover:border-blue-300",
      accentDot: "bg-[#0078D4]",
      accentBtn: "text-[#0078D4] hover:text-[#004e8c]",
      shadowColor: "shadow-blue-500/10",
    };
  }

  // JavaScript Stack (Official JS Gold/Amber)
  if (name.includes("javascript") || slug.includes("javascript") || name.includes("js")) {
    return {
      type: "js",
      label: "JavaScript",
      Icon: JavaScriptLogo,
      bannerBg: "bg-[#D97706]",
      darkColor: "#92400E",
      accent: "#D97706",
      hoverBorder: "hover:border-amber-300",
      accentDot: "bg-[#D97706]",
      accentBtn: "text-[#D97706] hover:text-[#92400e]",
      shadowColor: "shadow-amber-500/10",
    };
  }

  // Pure Windows Stack (Official Windows Blue)
  if (
    name.includes("windows") ||
    slug.includes("windows") ||
    product.is_usb ||
    name.includes("usb") ||
    slug.includes("usb") ||
    name.includes("retail") ||
    slug.includes("retail")
  ) {
    return {
      type: "win",
      label: "Windows",
      Icon: WindowsLogo,
      bannerBg: "bg-[#0078D4]", // Official Windows Blue
      darkColor: "#004E8C",
      accent: "#0078D4",
      hoverBorder: "hover:border-blue-300",
      accentDot: "bg-[#0078D4]",
      accentBtn: "text-[#0078D4] hover:text-[#004e8c]",
      shadowColor: "shadow-blue-500/10",
    };
  }

  // Server Stack
  if (name.includes("server") || slug.includes("server") || slug.includes("ps-")) {
    return {
      type: "server",
      label: "Server Security",
      Icon: ServerLogo,
      bannerBg: "bg-[#059669]",
      darkColor: "#064E3B",
      accent: "#059669",
      hoverBorder: "hover:border-emerald-300",
      accentDot: "bg-[#059669]",
      accentBtn: "text-[#059669] hover:text-[#064e3b]",
      shadowColor: "shadow-emerald-500/10",
    };
  }

  // Default: WordPress (Official WordPress Blue)
  return {
    type: "wp",
    label: "WordPress",
    Icon: WordPressLogo,
    bannerBg: "bg-[#0073AA]",
    darkColor: "#005177",
    accent: "#0073AA",
    hoverBorder: "hover:border-sky-300",
    accentDot: "bg-[#0073AA]",
    accentBtn: "text-[#0073AA] hover:text-[#005177]",
    shadowColor: "shadow-sky-500/10",
  };
}

// ─── Resolve Product Sub Heading (Dynamic with Static Fallback) ─────────────
export function getProductSubHeading(product) {
  if (!product) return "";
  if (product.sub_heading) return product.sub_heading;
  if (product.sub_title) return product.sub_title;
  if (product.subtitle) return product.subtitle;
  if (product.subHeading) return product.subHeading;

  const id = product.id;
  const name = (product.name || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();

  // 1. BITSS VWAR for WordPress
  if (
    id === 23 ||
    slug === "bitss-vwar-website-database-protection-for-wordpress" ||
    (name.includes("vwar") && name.includes("wordpress") && !name.includes("pack") && !name.includes("bundle"))
  ) {
    return "Website Database & Malware  Protection for WordPress";
  }

  // 2. BITSS VWAR for Windows
  if (
    id === 25 ||
    slug === "bitss-vwar-malware-intrusion-protection-digital-version-for-windows-device" ||
    (name.includes("vwar") && name.includes("windows") && !slug.includes("retail") && !name.includes("pack") && !name.includes("suite"))
  ) {
    return "Malware - Intrusion Protection For Windows Device";
  }

  // 3. BITSS WAP for WordPress
  if (
    id === 24 ||
    slug === "bitss-wap-internal-firewall-for-website-database" ||
    (name.includes("wap") && (name.includes("wordpress") || slug.includes("internal-firewall-for-website-database")) && !name.includes("pack"))
  ) {
    return "Admin Access Protection and Internal Firewall for website database";
  }

  // 4. BITSS WAP for JavaScript
  if (
    id === 39 ||
    slug === "bitss-wap-advanced-built-in-internal-firewall-providing-maximum-protection-for-javascript" ||
    (name.includes("wap") && (name.includes("javascript") || name.includes("js")) && !name.includes("pack"))
  ) {
    return "Admin Access Protection and Internal Firewall for website database";
  }

  // 5. BITSS C
  if (
    id === 74 ||
    slug === "bitss-c-contact-page-protection-for-any-website" ||
    (name.includes("bitss c") && !name.includes("pack"))
  ) {
    return "Contact Form Protection for Any Website — Fully compatible with HTML5, Vanilla JavaScript, PHP, Laravel, Astro, React, Next.js, Vue.js, WordPress, and more.";
  }

  // 6. BITSS VWAR USB Flash Memory Key Protection
  if (
    id === 31 ||
    id === 29 ||
    name.includes("usb flash memory") ||
    slug.includes("usb-flash-memory") ||
    (name.includes("vwar") && (name.includes("usb") || slug.includes("usb")))
  ) {
    return "Get Your USB BITSS Protected: Secure your files instantly with built-in anti-malware defense.";
  }

  // Retail Pack (ID 28)
  if (id === 28 || name.includes("retail pack") || slug.includes("retail-pack")) {
    return "Offline Advanced Windows Device Protection (Designed for Windows Laptop & Desktop Device)";
  }

  // Bundle: BITSS Advanced Web Database Security Pack (ID 26)
  if (id === 26 || name.includes("advanced web database") || slug.includes("advanced-web-database")) {
    return (
      <span className="block">
        <span className="block font-bold text-slate-900 mb-1">
          This Complete Website Security Pack Includes:
        </span>
        <span className="block font-semibold text-slate-700 text-[13px] sm:text-[13.5px] leading-relaxed space-y-0.5">
          <span className="block">• 1x BITSS WAP for WordPress</span>
          <span className="block">• 1x BITSS VWAR for WordPress</span>
          <span className="block">• 1x BITSS C Contact Form Protection (Any Website)</span>
        </span>
      </span>
    );
  }

  // Bundle: BITSS Web & Windows Protection Suite (ID 27)
  if (id === 27 || name.includes("web & windows") || slug.includes("web-windows")) {
    return (
      <span className="block">
        <span className="block font-bold text-slate-900 mb-1">
          This Complete Digital Protection Suite Includes:
        </span>
        <span className="block font-semibold text-slate-700 text-[13px] sm:text-[13.5px] leading-relaxed space-y-0.5">
          <span className="block">• 1x BITSS WAP for WordPress</span>
          <span className="block">• 1x BITSS VWAR for WordPress</span>
          <span className="block">• 1x BITSS VWAR for Windows Devices</span>
          <span className="block">• 1x BITSS C Contact Form Protection (Any Website)</span>
        </span>
      </span>
    );
  }

  return "";
}

export default function ProductCard({ product, i, className = "" }) {
  const [ref, inView] = useInView();
  const [hov, setHov] = useState(false);

  const stack = resolveStack(product);
  const subHeading = getProductSubHeading(product);

  const prodName = (product?.name || "").toLowerCase();
  const prodSlug = (product?.slug || "").toLowerCase();
  const prodId = product?.id;

  const isBitssC =
    prodId === 74 ||
    prodSlug.includes("bitss-c") ||
    (prodName.includes("bitss c") && !prodName.includes("pack") && !prodName.includes("suite"));

  const isWebAndWindows =
    prodId === 27 ||
    (prodName.includes("web") && prodName.includes("windows")) ||
    prodSlug.includes("web-windows") ||
    stack.type === "win-web";

  const isUsbOrRetail =
    !isWebAndWindows &&
    (Boolean(product?.is_usb) ||
      prodId === 28 ||
      prodId === 29 ||
      prodId === 31 ||
      prodName.includes("usb") ||
      prodSlug.includes("usb") ||
      prodName.includes("retail") ||
      prodSlug.includes("retail"));

  // Show first 4 details max
  const features = (product.details || []).slice(0, 4);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ transitionDelay: `${i * 0.06}s` }}
      className={`relative flex h-full flex-col bg-white rounded-2xl border p-4 sm:p-6 cursor-default transition-all duration-500 
        ${hov ? `border-transparent shadow-xl ${stack.shadowColor} -translate-y-1 ${stack.hoverBorder}` : "border-slate-200 shadow-sm"}
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${isBitssC ? "sm:col-span-2" : ""}
        ${className}
      `}
    >
      {/* Top accent bar matching product logo color */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300"
        style={{ background: hov ? stack.accent : "transparent" }}
      />

      {/* Top Header: Index on left, Stack Label on right above corner */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3.5 min-h-[32px]">
        <p
          className={`font-mono text-[11px] font-semibold tracking-widest transition-colors duration-300 pt-1 shrink-0 ${hov ? "font-bold" : "text-slate-300"}`}
          style={{ color: hov ? stack.accent : undefined }}
        >
          {String(i + 1).padStart(2, "0")}
        </p>

        {/* Labels on right above corner */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end flex-1 min-w-0">
          {/* 1. Web & Windows Bundle Suite: Render BOTH Windows and WordPress badges together */}
          {isWebAndWindows ? (
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap justify-end">
              {/* Windows Badge */}
              <div
                className={`relative inline-flex items-center overflow-hidden rounded-full pl-1.5 pr-2.5 sm:pr-3 py-0.5 sm:py-1 shadow-xs transition-all duration-300 shrink-0 ${
                  hov ? "shadow-md scale-[1.02]" : ""
                } bg-[#0078D4]`}
              >
                <svg
                  className="absolute -bottom-2 -left-2 w-14 h-14 pointer-events-none opacity-30"
                  viewBox="0 0 100 100"
                  fill="#004E8C"
                >
                  <circle cx="22" cy="78" r="28" />
                  <circle cx="58" cy="85" r="14" />
                  <circle cx="36" cy="48" r="10" />
                </svg>
                <div
                  className="relative shrink-0 w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center shadow-xs border border-white/25"
                  style={{ backgroundColor: "#004E8C" }}
                  title="WINDOWS"
                >
                  <WindowsLogo className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <span className="relative font-['Outfit'] font-black text-white text-[10px] sm:text-[11.5px] uppercase leading-none tracking-wide ml-1.5 sm:ml-2 mr-0.5">
                  WINDOWS
                </span>
              </div>

              {/* WordPress Badge */}
              <div
                className={`relative inline-flex items-center overflow-hidden rounded-full pl-1.5 pr-2.5 sm:pr-3 py-0.5 sm:py-1 shadow-xs transition-all duration-300 shrink-0 ${
                  hov ? "shadow-md scale-[1.02]" : ""
                } bg-[#0073AA]`}
              >
                <svg
                  className="absolute -bottom-2 -left-2 w-14 h-14 pointer-events-none opacity-30"
                  viewBox="0 0 100 100"
                  fill="#005177"
                >
                  <circle cx="22" cy="78" r="28" />
                  <circle cx="58" cy="85" r="14" />
                  <circle cx="36" cy="48" r="10" />
                </svg>
                <div
                  className="relative shrink-0 w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center shadow-xs border border-white/25"
                  style={{ backgroundColor: "#005177" }}
                  title="WORDPRESS"
                >
                  <WordPressLogo className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <span className="relative font-['Outfit'] font-black text-white text-[10px] sm:text-[11.5px] uppercase leading-none tracking-wide ml-1.5 sm:ml-2 mr-0.5">
                  WORDPRESS
                </span>
              </div>
            </div>
          ) : isBitssC ? (
            /* 2. BITSS C: Render tech badges: JS, REACT, NODE, PHP, ASTRO, HTML */
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap justify-end flex-1 min-w-0 py-0.5">
              {BITSS_C_BADGES.map((b) => (
                <div
                  key={b.name}
                  className={`relative inline-flex items-center overflow-hidden rounded-full pl-1.5 pr-2 sm:pr-2.5 py-0.5 sm:py-1 shadow-xs transition-all duration-300 shrink-0 ${
                    hov ? "shadow-md scale-[1.02]" : ""
                  } ${b.bg}`}
                >
                  {/* Decorative fluid bubbles matching reference image */}
                  <svg
                    className="absolute -bottom-2 -left-2 w-14 h-14 pointer-events-none opacity-30"
                    viewBox="0 0 100 100"
                    fill={b.darkColor}
                  >
                    <circle cx="22" cy="78" r="28" />
                    <circle cx="58" cy="85" r="14" />
                    <circle cx="36" cy="48" r="10" />
                  </svg>

                  {/* Circular icon badge */}
                  <div
                    className="relative shrink-0 w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center shadow-xs border border-white/25"
                    style={{ backgroundColor: b.darkColor }}
                    title={b.name}
                  >
                    <b.Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>

                  {/* Platform / Tech Label (Capital) */}
                  <span className="relative font-['Outfit'] font-black text-white text-[10px] sm:text-[11.5px] uppercase leading-none tracking-wide ml-1 sm:ml-1.5 mr-0.5">
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* 3. Standard Stack & USB Badge */
            <>
              {stack?.label && (
                <div
                  className={`relative inline-flex items-center overflow-hidden rounded-full pl-1.5 pr-2.5 sm:pr-3 py-0.5 sm:py-1 shadow-xs transition-all duration-300 shrink-0 ${
                    hov ? "shadow-md scale-[1.02]" : ""
                  } ${stack.bannerBg}`}
                >
                  {/* Decorative fluid bubbles matching reference image */}
                  <svg
                    className="absolute -bottom-2 -left-2 w-14 h-14 pointer-events-none opacity-30"
                    viewBox="0 0 100 100"
                    fill={stack.darkColor}
                  >
                    <circle cx="22" cy="78" r="28" />
                    <circle cx="58" cy="85" r="14" />
                    <circle cx="36" cy="48" r="10" />
                  </svg>

                  {/* Circular icon badge */}
                  <div
                    className="relative shrink-0 w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center shadow-xs border border-white/25"
                    style={{ backgroundColor: stack.darkColor }}
                    title={stack.label}
                  >
                    <stack.Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>

                  {/* Platform Label */}
                  <span className="relative font-['Outfit'] font-black text-white text-[10px] sm:text-[11.5px] uppercase leading-none tracking-wide ml-1.5 sm:ml-2 mr-0.5">
                    {stack.label}
                  </span>
                </div>
              )}

              {/* Separate Red USB Label for USB products & Retail Pack */}
              {isUsbOrRetail && (
                <div
                  className={`relative inline-flex items-center overflow-hidden rounded-full pl-1.5 pr-2.5 sm:pr-3 py-0.5 sm:py-1 shadow-xs transition-all duration-300 shrink-0 ${
                    hov ? "shadow-md scale-[1.02]" : ""
                  } bg-red-600`}
                >
                  {/* Decorative fluid bubbles in dark red */}
                  <svg
                    className="absolute -bottom-2 -left-2 w-14 h-14 pointer-events-none opacity-30"
                    viewBox="0 0 100 100"
                    fill="#991b1b"
                  >
                    <circle cx="22" cy="78" r="28" />
                    <circle cx="58" cy="85" r="14" />
                    <circle cx="36" cy="48" r="10" />
                  </svg>

                  {/* Circular USB icon badge */}
                  <div
                    className="relative shrink-0 w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center shadow-xs border border-white/25"
                    style={{ backgroundColor: "#991b1b" }}
                    title="USB"
                  >
                    <Usb className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={2.2} />
                  </div>

                  {/* USB Label */}
                  <span className="relative font-['Outfit'] font-black text-white text-[10px] sm:text-[11.5px] uppercase leading-none tracking-wide ml-1.5 sm:ml-2 mr-0.5">
                    USB
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Name / Heading */}
      <h3
        className="font-outfit text-[20px] sm:text-[24px] font-black text-slate-950 leading-tight mb-2 tracking-tight break-words"
        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900 }}
      >
        {product.name}
      </h3>

      {/* Sub Heading / Descriptive Sub-text below each product title */}
      {subHeading && (
        <div
          className="font-poppins text-[14px] sm:text-[15px] font-bold text-slate-800 leading-snug mb-2.5"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {subHeading}
        </div>
      )}

      {/* Description */}
      <p className="text-slate-500 text-[12.5px] leading-relaxed mb-3">
        {(product.description || "").replace(/<[^>]*>/g, "").slice(0, 100)}
        {(product.description || "").replace(/<[^>]*>/g, "").length > 100
          ? "…"
          : ""}
      </p>

      {/* Features */}
      <div className="mb-4">
        {features.length > 0 && (
          <ul className="space-y-1.5">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-[12px] text-slate-500"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${stack.accentDot}`}
                />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA */}
      <div className="pt-3.5 border-t border-slate-100 mt-auto">
        <Link
          href={`/products/${product.slug}`}
          className={`inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wide transition-colors ${stack.accentBtn}`}
        >
          View Details <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}
