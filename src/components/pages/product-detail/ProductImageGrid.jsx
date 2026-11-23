"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowUpRight,
} from "lucide-react";

export default function ProductImageGrid({ images, productName, product }) {
  // Strict check: only render when images array has items
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const [mounted, setMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const touchDistRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ─── Lightbox Controls ───────────────────────────────────────────────────────
  const openLightbox = (index) => {
    setActiveIdx(index);
    setZoomScale(1);
    setPanPos({ x: 0, y: 0 });
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomScale(1);
    setPanPos({ x: 0, y: 0 });
    document.body.style.overflow = "";
  };

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % images.length);
    setZoomScale(1);
    setPanPos({ x: 0, y: 0 });
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
    setZoomScale(1);
    setPanPos({ x: 0, y: 0 });
  }, [images.length]);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.5, 3.5));
  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPos({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomScale(1);
    setPanPos({ x: 0, y: 0 });
  };

  // Keyboard navigation & Esc key listener
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomScale((prev) => Math.min(prev + 0.25, 3.5));
    } else {
      setZoomScale((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPanPos({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Drag & Pan handlers
  const handleMouseDown = (e) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomScale > 1) {
      setPanPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Pinch & Pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      touchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1 && zoomScale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panPos.x,
        y: e.touches[0].clientY - panPos.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistRef.current) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchDistRef.current;
      setZoomScale((prev) => Math.min(Math.max(prev * ratio, 1), 3.5));
      touchDistRef.current = currentDist;
    } else if (e.touches.length === 1 && isDragging && zoomScale > 1) {
      setPanPos({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
    setIsDragging(false);
  };


  // ─── Unified Pack Detection (Variant packs or Single/Retail packs) ───────────────
  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;

  // Format label for dropdown options (Keys for USB or Duration/Licenses for software)
  const formatOptionLabel = (opt) => {
    if (opt.unit) {
      return `${opt.unit} ${Number(opt.unit) === 1 ? "Key" : "Keys"}`;
    }
    if (opt.duration) {
      if (opt.duration === 12) return "1 Year";
      if (opt.duration === 24) return "2 Years";
      if (opt.duration === 36) return "3 Years";
      return `${opt.duration} Months`;
    }
    return "1 License";
  };

  // Group packs: either per variant (e.g. 16GB, 32GB, 64GB) or single/retail pack
  const packColumns = useMemo(() => {
    // 1. If product has variants (e.g. USB 16GB, 32GB, 64GB)
    if (hasVariants) {
      return variants.map((v, vIdx) => {
        const frontImgIdx = vIdx * 2;
        const backImgIdx = vIdx * 2 + 1;
        const frontImage = images[frontImgIdx] || images[0];
        const backImage = images[backImgIdx] || null;

        const variantSubs =
          product?.subscriptions?.filter((s) => s.variant_id === v.id) || [];
        variantSubs.sort((a, b) => {
          if (a.unit && b.unit) return Number(a.unit) - Number(b.unit);
          return Number(a.price_after_discount) - Number(b.price_after_discount);
        });

        return {
          id: v.id,
          title: v.name,
          badge: "BITSS",
          frontImage,
          frontImgIdx: frontImgIdx < images.length ? frontImgIdx : 0,
          backImage,
          backImgIdx: backImgIdx < images.length ? backImgIdx : null,
          options: variantSubs,
        };
      });
    }

    // 2. If product has NO variants (e.g. Retail Pack)
    const subs = [...(product?.subscriptions || [])];
    subs.sort((a, b) => {
      if (a.duration && b.duration) return Number(a.duration) - Number(b.duration);
      return Number(a.price_after_discount) - Number(b.price_after_discount);
    });

    const isRetailPack = Boolean(
      product?.name?.toLowerCase().includes("retail pack")
    );

    // Retail pack with 4 images: First two English, second two French (2 grid)
    if (images.length >= 4) {
      return [
        {
          id: "pack-en",
          title: isRetailPack ? "Retail Pack (English)" : "English Edition",
          badge: "EN",
          frontImage: images[0],
          frontImgIdx: 0,
          backImage: images[1] || null,
          backImgIdx: 1,
          options: subs,
        },
        {
          id: "pack-fr",
          title: isRetailPack ? "Retail Pack (French)" : "French Edition",
          badge: "FR",
          frontImage: images[2],
          frontImgIdx: 2,
          backImage: images[3] || null,
          backImgIdx: 3,
          options: subs,
        },
      ];
    }

    let defaultTitle = isRetailPack ? "Retail Pack" : (product?.name || "Product Pack");

    return [
      {
        id: "main-pack",
        title: defaultTitle,
        badge: "BITSS",
        frontImage: images[0],
        frontImgIdx: 0,
        backImage: images[1] || null,
        backImgIdx: images[1] ? 1 : null,
        options: subs,
      },
    ];
  }, [hasVariants, variants, images, product?.subscriptions, product?.name]);

  // ─── Grid & Layout Helpers (Desktop 3 grid, Mobile 2 grid, Left-Aligned) ───
  const prodName = (product?.name || "").toLowerCase();
  const prodSlug = (product?.slug || "").toLowerCase();
  const isSelfInstall =
    prodSlug.includes("self-installation") ||
    prodName.includes("self installation");
  const isUsbPhysical =
    (product?.id === 31 ||
      product?.is_usb ||
      prodName.includes("usb flash memory") ||
      prodSlug.includes("usb-flash-memory")) &&
    !isSelfInstall;
  const isRetailPack =
    product?.id === 28 ||
    prodName.includes("retail pack") ||
    prodSlug.includes("retail-pack");

  const isSingle = packColumns.length === 1;
  const isDouble = packColumns.length === 2;
  const isTriple = packColumns.length === 3;

  // Outer container: left-aligned with product title & content
  const getContainerClass = () => {
    if (isSingle) {
      // 1 Pack: Left-aligned
      return "flex justify-start w-full";
    }
    if (isDouble) {
      // 2 Packs: 2 columns, left-aligned
      return "grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-5 max-w-2xl justify-start w-full";
    }
    if (isTriple) {
      // 3 Packs: 2 grid on mobile, 3 grid on desktop
      return "grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5 w-full";
    }
    // 4+ Packs: 2 on mobile, 4 on desktop
    return "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full";
  };

  // Card classes: professional left alignment
  const getCardClass = () => {
    const base =
      "bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-red-300 transition-all flex flex-col overflow-hidden p-2 sm:p-3";

    if (isSingle) {
      return `${base} w-full max-w-[320px] sm:max-w-[360px]`;
    }
    return `${base} w-full`;
  };

  // Bigger, high-visibility image container height
  const getImageHeightClass = () => {
    if (isSingle) {
      return "h-[180px] sm:h-[230px] lg:h-[250px]";
    }
    if (isDouble) {
      return "h-[160px] sm:h-[210px] lg:h-[235px]";
    }
    return "h-[150px] sm:h-[195px] lg:h-[220px]";
  };

  return (
    <div className="w-full mb-8 select-none">
      {/* ─── UNIFIED PACK CARDS: 3 on Desktop, 2 on Mobile, Centered if < 3 ─── */}
      <div className={getContainerClass()}>
        {packColumns.map((pack, idx) => {
          return (
            <div key={pack.id} className={getCardClass(idx)}>
              {/* Card Header (e.g. 16GB, Retail Pack (English)) */}
              <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-slate-100 mb-2">
                <span className="font-['Outfit'] text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate pr-1">
                  {pack.title}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase shrink-0 font-poppins">
                  {pack.badge || "BITSS"}
                </span>
              </div>

              {/* Stacked Images Container: Front top & Back below (Bigger, High Visibility) */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                {/* 1. FRONT IMAGE (TOP) */}
                <div
                  onClick={() => openLightbox(pack.frontImgIdx)}
                  className={`group relative w-full ${getImageHeightClass()} bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-xl sm:rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 flex items-center justify-center cursor-pointer hover:border-red-400 hover:shadow-md transition-all overflow-hidden`}
                  title="Tap to enlarge Front view"
                >
                  <span className="absolute top-1.5 left-1.5 z-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/95 border border-slate-200/90 px-1.5 py-0.5 rounded-md shadow-2xs backdrop-blur-xs">
                    Front
                  </span>
                  <div className="absolute top-1.5 right-1.5 z-10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white p-1 rounded-md shadow-xs flex items-center gap-0.5">
                    <Maximize2 size={11} />
                  </div>
                  <div className="relative w-full h-full">
                    <Image
                      src={pack.frontImage.url}
                      fill
                      className="object-contain p-1 sm:p-1.5 drop-shadow-md group-hover:scale-106 transition-transform duration-300"
                      alt={`${pack.title} Front`}
                      sizes="(max-width: 640px) 50vw, 33vw"
                      priority={idx === 0}
                    />
                  </div>
                </div>

                {/* 2. BACK IMAGE (BELOW) */}
                {pack.backImage && (
                  <div
                    onClick={() => openLightbox(pack.backImgIdx)}
                    className={`group relative w-full ${getImageHeightClass()} bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-xl sm:rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 flex items-center justify-center cursor-pointer hover:border-red-400 hover:shadow-md transition-all overflow-hidden`}
                    title="Tap to enlarge Back view"
                  >
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/95 border border-slate-200/90 px-1.5 py-0.5 rounded-md shadow-2xs backdrop-blur-xs">
                      Back
                    </span>
                    <div className="absolute top-1.5 right-1.5 z-10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white p-1 rounded-md shadow-xs flex items-center gap-0.5">
                      <Maximize2 size={11} />
                    </div>
                    <div className="relative w-full h-full">
                      <Image
                        src={pack.backImage.url}
                        fill
                        className="object-contain p-1 sm:p-1.5 drop-shadow-md group-hover:scale-106 transition-transform duration-300"
                        alt={`${pack.title} Back`}
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── CALLOUT BANNER: FOR EXISTING USB KEYS ─── */}
      {isUsbPhysical && (
        <div className="mt-5 rounded-2xl border border-[#70C041]/35 bg-gradient-to-r from-[#70C041]/[0.09] via-emerald-50/30 to-[#70C041]/[0.05] p-3.5 sm:p-4 lg:px-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 sm:gap-4">
            {/* Left: Single-Level All-Caps Professional Green Text in Outfit */}
            <p className="font-['Outfit'] uppercase tracking-tight leading-snug text-[13.5px] sm:text-[15px] lg:text-[16px]">
              <span className="font-black text-[#316914]">
                FOR EXISTING USB KEYS
              </span>
              <span className="text-[#70C041]/70 mx-2 font-black">—</span>
              <span className="font-extrabold text-[#478f21]">
                GET ONLINE PRODUCT FOR IMMEDIATE USB KEY PROTECTION.
              </span>
            </p>

            {/* Right: Animated Branded CTA Button in Outfit */}
            <a
              href="https://bitss.one/products/bitss-vwar-usb-flash-memory-key-protection-self-installation"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#70C041] hover:bg-[#5ca530] text-white font-['Outfit'] font-black text-[13px] sm:text-[13.5px] uppercase tracking-wider animate-cta-pulse transition-all shrink-0 cursor-pointer group/cta self-start lg:self-auto"
            >
              {/* Shimmer sweep effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-cta-shimmer pointer-events-none" />
              <span className="relative z-10">PAY &amp; DOWNLOAD</span>
              <ArrowUpRight
                size={16}
                className="relative z-10 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform shrink-0 stroke-[2.5]"
              />
            </a>
          </div>
        </div>
      )}

      {/* ─── CALLOUT BANNER: FOR RETAIL PACK (WINDOWS DEVICE) ─── */}
      {isRetailPack && (
        <div className="mt-5 rounded-2xl border border-[#70C041]/35 bg-gradient-to-r from-[#70C041]/[0.09] via-emerald-50/30 to-[#70C041]/[0.05] p-3.5 sm:p-4 lg:px-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 sm:gap-4">
            {/* Left: All-Caps Professional Green Text in Outfit with line break after BUY */}
            <p className="font-['Outfit'] uppercase tracking-tight leading-snug text-[13.5px] sm:text-[15px] lg:text-[16px]">
              <span className="font-black text-[#316914]">
                FOR IMMEDIATE WINDOW DEVICE PROTECTION
              </span>
              <span className="text-[#70C041]/70 mx-2 font-black">—</span>
              <span className="font-extrabold text-[#478f21]">
                BUY <br />
                ONLINE PRODUCT FOR INSTANT DOWNLOAD.
              </span>
            </p>

            {/* Right: Animated Branded CTA Button in Outfit */}
            <a
              href="https://bitss.one/products/bitss-vwar-for-windows-device"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#70C041] hover:bg-[#5ca530] text-white font-['Outfit'] font-black text-[13px] sm:text-[13.5px] uppercase tracking-wider animate-cta-pulse transition-all shrink-0 cursor-pointer group/cta self-start lg:self-auto"
            >
              {/* Shimmer sweep effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-cta-shimmer pointer-events-none" />
              <span className="relative z-10">PAY &amp; DOWNLOAD</span>
              <ArrowUpRight
                size={16}
                className="relative z-10 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform shrink-0 stroke-[2.5]"
              />
            </a>
          </div>
        </div>
      )}

      {/* ─── 30% OPACITY TRANSPARENT BLUR LIGHTBOX MODAL ─── */}
      {mounted &&
        lightboxOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999999] text-white flex flex-col justify-between select-none animate-in fade-in duration-200 overflow-hidden"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            onWheel={handleWheel}
            onMouseUp={handleMouseUp}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            {/* Top Minimal Controls: Index Counter & Floating Close Button */}
            <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 pointer-events-auto">
              <span
                className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full text-white/90 border border-white/15 shadow-lg"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                {String(activeIdx + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="w-10 h-10 rounded-full hover:bg-red-600 active:scale-95 text-white border border-white/15 shadow-xl flex items-center justify-center cursor-pointer transition-all group"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
                aria-label="Close"
                title="Close (Esc)"
              >
                <X
                  size={18}
                  className="stroke-[2.5] group-hover:rotate-90 transition-transform duration-200"
                />
              </button>
            </div>

            {/* Main Zoomable Viewport */}
            <div
              className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-4 sm:p-8"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={() => {
                if (zoomScale > 1) handleResetZoom();
                else setZoomScale(2);
              }}
            >
              {/* Prev Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 sm:left-8 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft
                    size={22}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                </button>
              )}

              {/* Product Center Canvas */}
              <div
                style={{
                  transform: `scale(${zoomScale}) translate(${
                    panPos.x / zoomScale
                  }px, ${panPos.y / zoomScale}px)`,
                  transition: isDragging
                    ? "none"
                    : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="relative w-full h-full max-w-4xl max-h-[72vh] flex items-center justify-center pointer-events-none"
              >
                <Image
                  src={images[activeIdx].url}
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none"
                  alt={`Zoomed view ${activeIdx + 1}`}
                  priority
                />
              </div>

              {/* Next Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 sm:right-8 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight
                    size={22}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              )}
            </div>

            {/* Bottom Floating Controls Dock */}
            <footer className="w-full pb-5 sm:pb-7 pt-2 px-4 z-30 shrink-0 pointer-events-none">
              <div className="pointer-events-auto flex flex-col items-center gap-2.5 sm:gap-3 max-w-2xl mx-auto">
                {/* Zoom Controls Segmented Pill */}
                <div className="inline-flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/15 shadow-xl">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomOut();
                    }}
                    disabled={zoomScale <= 1}
                    className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/5 text-white transition-colors cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetZoom();
                    }}
                    className="px-3 sm:px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
                    title="Reset Zoom (100%)"
                  >
                    {Math.round(zoomScale * 100)}%
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomIn();
                    }}
                    disabled={zoomScale >= 3.5}
                    className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/5 text-white transition-colors cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <ZoomIn size={15} />
                  </button>

                  {zoomScale > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetZoom();
                      }}
                      className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw size={15} />
                    </button>
                  )}
                </div>

                {/* Thumbnails Navigation Bar */}
                {images.length > 1 && (
                  <div className="flex items-center justify-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/15 shadow-xl max-w-full overflow-x-auto">
                    {images.map((img, i) => (
                      <button
                        key={img.id || i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIdx(i);
                          setZoomScale(1);
                          setPanPos({ x: 0, y: 0 });
                        }}
                        className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeIdx === i
                            ? "border-red-500 scale-108 shadow-[0_0_18px_rgba(239,68,68,0.5)] ring-2 ring-red-500/40 bg-white/10"
                            : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/40"
                        }`}
                      >
                        <Image
                          src={img.url}
                          fill
                          className="object-contain p-1 bg-white/5"
                          alt={`Thumbnail ${i + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </footer>
          </div>,
          document.body
        )}
    </div>
  );
}
