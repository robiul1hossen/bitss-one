"use client";
import {
  ShieldCheck,
  Package,
  Layers,
  Usb,
  Tag,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { getBasePrice } from "@/hooks/useProductDetail";
import { useCountry } from "@/context/CountryContext";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import ProductImageGrid from "./ProductImageGrid";

// ── Badge helpers ─────────────────────────────────────────────────────────────
function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    combo: "bg-violet-50 text-violet-700 border-violet-200",
    usb: "bg-emerald-50 text-emerald-700 border-emerald-200",
    variant: "bg-sky-50 text-sky-700 border-sky-200",
    red: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

// ── Animated pulse dot ────────────────────────────────────────────────────────
function LiveDot({ color = "bg-red-500" }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}
      />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ProductDetailHero({ product, selectedVariantId }) {
  const { selectedCountry } = useCountry();

  const allSubs = product?.subscriptions ?? [];
  const isUsb = product?.is_usb;
  const isRetailPack = Boolean(
    product?.name?.toLowerCase().includes("retail pack"),
  );

  const displayPrice = (() => {
    if (!allSubs.length) return null;

    if (isUsb) {
      // USB: pick lowest price_after_discount across all sub rows
      return Math.min(...allSubs.map((s) => Number(s.price_after_discount)));
    }

    // Subscription or one-time: pick the lowest price_after_discount
    return Math.min(...allSubs.map((s) => Number(s.price_after_discount)));
  })();

  // Show strikethrough only if ANY sub row has a discount
  const lowestSub = allSubs.length
    ? allSubs.reduce((a, b) =>
        Number(a.price_after_discount) <= Number(b.price_after_discount)
          ? a
          : b,
      )
    : null;

  const hasDiscount =
    lowestSub?.discount_type && Number(lowestSub?.discount_amount) > 0;

  const originalPrice = hasDiscount ? lowestSub?.original_price : null;

  const basePrice = displayPrice;

  const currencySymbol = selectedCountry?.currency_icon
    ? new DOMParser().parseFromString(
        selectedCountry.currency_icon,
        "text/html",
      ).body.textContent
    : "$";

  if (!product) return null;

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Top accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle,#e2e8f0 1.5px,transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_40%,rgba(254,242,242,0.85)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-40 pb-12 sm:pb-16">
        {/* TOP: Badges & Product Name Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 mb-3.5">
            {product.is_combo && (
              <Badge variant="combo">
                <Layers size={11} /> Bundle Pack
              </Badge>
            )}
            {product.is_usb && (
              <Badge variant="usb">
                <Usb size={11} /> USB Product
              </Badge>
            )}
            {isRetailPack && (
              <Badge variant="combo">
                <Package size={11} /> Retail Pack
              </Badge>
            )}
            {product.is_variant && (
              <Badge variant="variant">
                <Tag size={11} /> Multiple Variants
              </Badge>
            )}
            <Badge variant="red">
              <LiveDot color="bg-red-500" /> Available Now
            </Badge>
          </div>

          <h1
            className="font-['Outfit'] font-bold leading-[1.1] text-slate-900 tracking-tight"
            style={{ fontSize: "clamp(24px,3vw,42px)" }}
          >
            {product.name}
          </h1>
        </div>

        {/* TWO-COLUMN HERO: Image Cards on Left & Feature Box on Right — Exactly Aligned! */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* LEFT — Product Image Pack Cards & Description */}
          <div className="flex-1 min-w-0 w-full">
            {/* Image Grid only if product has images from backend */}
            {product?.images && product.images.length > 0 && (
              <ProductImageGrid
                images={product.images}
                productName={product.name}
                product={product}
              />
            )}

            {/* Rich HTML description from SunEditor */}
            {product.description && (
              <div
                id="editor_description"
                className="sun-editor-content text-slate-500 text-[15px] sm:text-[16px] leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </div>

          {/* RIGHT — Price & All Features showcase box */}
          <div className="w-full lg:w-[420px] shrink-0 flex justify-center lg:justify-end">
            <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500" />
              <div className="p-6 sm:p-7">
                {/* Top: Icon & Starting from */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                    {product.is_combo ? (
                      <Layers
                        size={24}
                        strokeWidth={1.5}
                        className="text-red-600"
                      />
                    ) : product.is_usb ? (
                      <Usb
                        size={24}
                        strokeWidth={1.5}
                        className="text-red-600"
                      />
                    ) : (
                      <Package
                        size={24}
                        strokeWidth={1.5}
                        className="text-red-600"
                      />
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10.5px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    What&apos;s Included
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                  Starting from
                </p>

                {basePrice != null ? (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span
                      className="font-['Outfit'] font-black text-slate-900 leading-none tracking-tight"
                      style={{ fontSize: "clamp(32px,4vw,44px)" }}
                    >
                      {currencySymbol}
                      {formatPrice(displayPrice)}
                    </span>
                    {hasDiscount && originalPrice != null && (
                      <span className="text-[15px] text-slate-400 line-through mb-1">
                        {currencySymbol}
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[16px] text-slate-500 mb-1">
                    Contact for pricing
                  </p>
                )}

                <p className="text-[12px] text-slate-400 mb-5">
                  {isRetailPack
                    ? "per retail pack · physical delivery"
                    : product.is_usb
                      ? "per pack · plug & play ready"
                      : "per license · billed annually"}
                </p>

                {/* Divider */}
                <div className="border-t border-slate-100 mb-5" />

                {/* Section Title: TOP FEATURES */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-['Outfit'] font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight leading-none">
                    TOP <span className="text-red-600">FEATURES</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {Math.min(product.details?.length || 0, 5)} features
                    included
                  </span>
                </div>

                {/* Feature cards list: rendered in professional individual boxes (TOP 5) */}
                <div className="space-y-2 mb-5">
                  {product.details?.slice(0, 5).map((d, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-red-200 hover:shadow-xs transition-all duration-200"
                    >
                      <div className="w-6 h-6 rounded-lg bg-red-50 border border-red-100 group-hover:bg-red-100/80 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                        <CheckCircle2
                          size={13}
                          strokeWidth={2.5}
                          className="text-red-600"
                        />
                      </div>
                      <p className="text-[12.5px] text-slate-700 font-semibold leading-snug">
                        {d}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Trust strip */}
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-50/90 border border-slate-100 mb-5 text-center">
                  <div className="p-1">
                    <span className="text-sm">🛡️</span>
                    <p className="text-[10px] font-bold text-slate-800 leading-tight mt-0.5">
                      Enterprise
                    </p>
                    <p className="text-[9px] text-slate-400">Battle-tested</p>
                  </div>
                  <div className="p-1 border-x border-slate-200/60">
                    <span className="text-sm">⚡</span>
                    <p className="text-[10px] font-bold text-slate-800 leading-tight mt-0.5">
                      Real-time
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Instant response
                    </p>
                  </div>
                  <div className="p-1">
                    <span className="text-sm">📋</span>
                    <p className="text-[10px] font-bold text-slate-800 leading-tight mt-0.5">
                      Compliance
                    </p>
                    <p className="text-[9px] text-slate-400">GDPR ready</p>
                  </div>
                </div>

                <a
                  href="#pricing"
                  className="flex items-center justify-center gap-2 w-full py-2 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-[12px] sm:text-[14px] shadow-md shadow-red-600/20 active:scale-98 transition-all duration-300"
                >
                  View Plans <ChevronRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
