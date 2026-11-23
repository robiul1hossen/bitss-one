"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useCountry } from "@/context/CountryContext";
import ProductCard from "@/components/card/ProductCard";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Download,
  Loader2,
  Package,
  SlidersHorizontal,
} from "lucide-react";
import CTA from "@/components/shared/CTA";
import { useEffect, useState } from "react";
import { fetchProducts } from "./fetchProducts";
import { fetchCategories } from "./fetchCategories";
import { Tag } from "./Tag";
import ServerProtection2 from "@/components/pages/products/server-protection/ServerProtection2";

const DIGITAL_STATIC_MENU = [
  { id: "vwar", label: "BITSS VWAR" },
  { id: "ps", label: "BITSS PROTECT SERVER PS" },
  { id: "wap", label: "BITSS WAP" },
  { id: "c", label: "BITSS C" },
  { id: "bundle", label: "BUNDLE PACK" },
];

const PHYSICAL_STATIC_MENU = [
  { id: "usb", label: "BITSS VWAR USB KEY PROTECTION" },
  { id: "retail", label: "BITSS VWAR RETAIL PACK FOR WINDOWS" },
];

const BUNDLE_STATIC_MENU = [
  { id: "special", label: "BITSS SPECIAL BUNDLE PACKS" },
  { id: "digital", label: "BITSS DIGITAL SECURITY BUNDLE" },
  { id: "retail", label: "BITSS RETAIL SECURITY BUNDLE" },
];

function isSelfInstallUsbProduct(p) {
  if (!p) return false;
  const name = (p.name || "").toLowerCase();
  const slug = (p.slug || "").toLowerCase();
  return (
    p.id === 29 ||
    name.includes("self installation") ||
    name.includes("self-installation") ||
    slug.includes("self-installation")
  );
}

function filterDigitalProducts(items = [], tabId) {
  if (!items || !Array.isArray(items)) return [];
  if (tabId === "all" || !tabId) {
    return items.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const slug = (p.slug || "").toLowerCase();
      const isSelfInstall = isSelfInstallUsbProduct(p);
      const isPhysical =
        !isSelfInstall &&
        (p.is_usb ||
          p.category_id === 15 ||
          p.category_id === 16 ||
          p.category_id === 32 ||
          name.includes("usb") ||
          name.includes("retail") ||
          slug.includes("usb") ||
          slug.includes("retail"));
      const isBundle =
        p.category_id === 22 ||
        p.category_id === 33 ||
        name.includes("security pack") ||
        slug.includes("security-pack");
      if (isPhysical || isBundle) return false;
      return (
        p.category_id === 12 ||
        p.category_id === 13 ||
        p.category_id === 14 ||
        p.category_id === 31 ||
        p.id === 74 ||
        isSelfInstall ||
        name.includes("vwar") ||
        name.includes("wap") ||
        name.includes("bitss c") ||
        name.includes("protect server") ||
        name.includes("server")
      );
    });
  }
  switch (tabId) {
    case "vwar":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        const isSelfInstall = isSelfInstallUsbProduct(p);
        const isPhysical =
          !isSelfInstall &&
          (p.is_usb ||
            p.category_id === 15 ||
            p.category_id === 16 ||
            name.includes("usb") ||
            name.includes("retail") ||
            slug.includes("usb") ||
            slug.includes("retail"));
        const isBundle =
          p.category_id === 22 ||
          name.includes("security pack") ||
          slug.includes("security-pack");
        if (isPhysical || isBundle) return false;
        return (
          isSelfInstall ||
          p.category_id === 13 ||
          name.includes("vwar") ||
          slug.includes("vwar")
        );
      });
    case "ps":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        return (
          name.includes("protect server") ||
          name.includes("server protection") ||
          name.includes("server") ||
          slug.includes("server") ||
          slug.includes("ps")
        );
      });
    case "wap":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        const isBundle =
          p.category_id === 22 ||
          name.includes("security pack") ||
          slug.includes("security-pack");
        if (isBundle) return false;
        return (
          p.category_id === 12 ||
          name.includes("wap") ||
          slug.includes("wap")
        );
      });
    case "c":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        const isBundle =
          p.category_id === 22 ||
          name.includes("security pack") ||
          slug.includes("security-pack");
        if (isBundle) return false;
        return (
          p.id === 74 ||
          p.category_id === 14 ||
          slug === "bitss-c-smart-contact-form-spam-protection-for-any-website" ||
          (name.includes("bitss c") && !name.includes("pack"))
        );
      });
    case "bundle":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        const isPhysical =
          !isSelfInstallUsbProduct(p) &&
          (p.is_usb ||
            p.category_id === 15 ||
            p.category_id === 16 ||
            p.category_id === 32 ||
            name.includes("usb") ||
            name.includes("retail") ||
            slug.includes("usb") ||
            slug.includes("retail"));
        if (isPhysical) return false;
        return (
          p.id === 26 ||
          p.id === 27 ||
          p.is_combo ||
          p.category_id === 22 ||
          p.category_id === 33 ||
          name.includes("security pack") ||
          slug.includes("security-pack") ||
          name.includes("protection suite") ||
          slug.includes("protection-suite") ||
          name.includes("bundle") ||
          slug.includes("bundle")
        );
      });
    default:
      return items;
  }
}

function filterPhysicalProductsByTab(items = [], tabId) {
  if (!items || !Array.isArray(items)) return [];
  if (tabId === "all" || !tabId) {
    return items.filter(
      (p) => {
        if (isSelfInstallUsbProduct(p)) return false;
        return (
          p.is_usb ||
          p.category_id === 15 ||
          p.category_id === 16 ||
          p.category_id === 32 ||
          (p.name || "").toLowerCase().includes("usb") ||
          (p.name || "").toLowerCase().includes("retail") ||
          (p.slug || "").toLowerCase().includes("usb") ||
          (p.slug || "").toLowerCase().includes("retail")
        );
      }
    );
  }
  switch (tabId) {
    case "usb":
      return items.filter((p) => {
        if (isSelfInstallUsbProduct(p)) return false;
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        return (
          p.is_usb ||
          p.category_id === 15 ||
          name.includes("usb") ||
          slug.includes("usb")
        );
      });
    case "retail":
      return items.filter((p) => {
        if (isSelfInstallUsbProduct(p)) return false;
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        return (
          p.category_id === 16 ||
          name.includes("retail pack") ||
          slug.includes("retail-pack")
        );
      });
    default:
      return items.filter(
        (p) => {
          if (isSelfInstallUsbProduct(p)) return false;
          const name = (p.name || "").toLowerCase();
          return (
            p.is_usb ||
            p.category_id === 15 ||
            p.category_id === 16 ||
            name.includes("usb") ||
            name.includes("retail")
          );
        }
      );
  }
}

function filterBundleProductsByTab(items = [], tabId) {
  if (!items || !Array.isArray(items)) return [];
  if (tabId === "all" || !tabId) {
    return items.filter(
      (p) =>
        p.id === 26 ||
        p.id === 27 ||
        p.category_id === 22 ||
        p.category_id === 33 ||
        (p.name || "").toLowerCase().includes("bundle") ||
        (p.name || "").toLowerCase().includes("security pack") ||
        (p.name || "").toLowerCase().includes("protection suite") ||
        (p.slug || "").toLowerCase().includes("bundle") ||
        (p.slug || "").toLowerCase().includes("security-pack") ||
        (p.slug || "").toLowerCase().includes("protection-suite")
    );
  }
  switch (tabId) {
    case "special":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        return (
          p.id === 26 ||
          p.id === 27 ||
          p.category_id === 22 ||
          p.category_id === 33 ||
          name.includes("advanced web database security pack") ||
          slug.includes("advanced-web-database-security-pack") ||
          name.includes("web & windows protection suite") ||
          slug.includes("web-windows-protection-suite") ||
          (name.includes("special") && name.includes("bundle"))
        );
      });
    case "digital":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        return (
          (name.includes("digital security bundle") ||
            slug.includes("digital-security-bundle")) &&
          p.id !== 26 &&
          p.id !== 27
        );
      });
    case "retail":
      return items.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        return (
          (name.includes("retail security bundle") ||
            slug.includes("retail-security-bundle")) &&
          p.id !== 28 &&
          p.id !== 27
        );
      });
    default:
      return items;
  }
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedCountry } = useCountry();

  const [isMounted, setIsMounted] = useState(false);
  const [activeDigitalTab, setActiveDigitalTab] = useState("vwar");
  const [activePhysicalTab, setActivePhysicalTab] = useState("usb");
  const [activeBundleTab, setActiveBundleTab] = useState("special");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isFromAllProducts, setIsFromAllProducts] = useState(true);

  const [selectedCatId, setSelectedCatId] = useState(() => {
    const cat = searchParams.get("category");
    return cat ? Number(cat) : null;
  });

  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCatId(cat ? Number(cat) : null);
    setIsFromAllProducts(true);
    // On mobile view, keep previous system of auto-scrolling to products
    if (cat && typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(() => {
        scrollToProducts();
      }, 300);
    }
  }, [searchParams]);

  const activeCategoryId = selectedCatId;

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const activeCategory = categories?.find((c) => c.id === activeCategoryId);

  const isDigitalCategory =
    activeCategoryId === 31 ||
    activeCategory?.slug === "digital-security-products" ||
    activeCategory?.name?.toLowerCase().includes("digital security");

  const isPhysicalCategory =
    activeCategoryId === 32 ||
    activeCategory?.slug === "physical-security-products" ||
    activeCategory?.name?.toLowerCase().includes("physical security");

  const isBundleCategory =
    activeCategoryId === 33 ||
    activeCategoryId === 22 ||
    activeCategory?.slug === "bundles-packs" ||
    activeCategory?.slug === "bitss-special-bundle-pack" ||
    activeCategory?.name?.toLowerCase().includes("bundles & packs") ||
    activeCategory?.name?.toLowerCase().includes("bundle");

  const isMetaCategory =
    isDigitalCategory || isPhysicalCategory || isBundleCategory;

  // Fetch products (always fetch all so client-side switching between categories is instantaneous with no reload)
  const {
    data: rawProducts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products-all-client", selectedCountry?.id],
    queryFn: () =>
      fetchProducts({
        countryId: selectedCountry?.id,
        categoryId: null,
      }),
    enabled: !!selectedCountry?.id,
    staleTime: 1000 * 60 * 5,
  });

  const allProductsData = rawProducts || [];

  // Digital counts
  const digitalCounts = {
    vwar: filterDigitalProducts(allProductsData, "vwar").length,
    ps: filterDigitalProducts(allProductsData, "ps").length || 1,
    wap: filterDigitalProducts(allProductsData, "wap").length,
    c: filterDigitalProducts(allProductsData, "c").length,
    bundle: filterDigitalProducts(allProductsData, "bundle").length,
  };

  // Physical counts
  const physicalCounts = {
    usb: filterPhysicalProductsByTab(allProductsData, "usb").length,
    retail: filterPhysicalProductsByTab(allProductsData, "retail").length,
  };

  // Bundle counts
  const bundleCounts = {
    special: filterBundleProductsByTab(allProductsData, "special").length,
    digital: filterBundleProductsByTab(allProductsData, "digital").length,
    retail: filterBundleProductsByTab(allProductsData, "retail").length,
  };

  const digitalTotalCount =
    (digitalCounts.vwar || 0) +
    (digitalCounts.ps || 1) +
    (digitalCounts.wap || 0) +
    (digitalCounts.c || 0) +
    (digitalCounts.bundle || 0);

  const physicalTotalCount =
    (physicalCounts.usb || 0) +
    (physicalCounts.retail || 0);

  const bundleTotalCount =
    (bundleCounts.special || 0) +
    (bundleCounts.digital || 0) +
    (bundleCounts.retail || 0);

  const getCategoryCount = (cat) => {
    if (
      cat.id === 31 ||
      cat.slug === "digital-security-products" ||
      cat.name?.toLowerCase().includes("digital")
    ) {
      return digitalTotalCount;
    }
    if (
      cat.id === 32 ||
      cat.slug === "physical-security-products" ||
      cat.name?.toLowerCase().includes("physical")
    ) {
      return physicalTotalCount;
    }
    if (
      cat.id === 33 ||
      cat.id === 22 ||
      cat.slug === "bundles-packs" ||
      cat.name?.toLowerCase().includes("bundle")
    ) {
      return bundleTotalCount;
    }
    return allProductsData.filter((p) => p.category_id === cat.id).length;
  };

  const allTotalCount =
    digitalTotalCount + physicalTotalCount + bundleTotalCount;

  let products = allProductsData;
  let activeTabLabel = "";

  if (isDigitalCategory) {
    products = filterDigitalProducts(allProductsData, activeDigitalTab);
    activeTabLabel =
      DIGITAL_STATIC_MENU.find((m) => m.id === activeDigitalTab)?.label ||
      "BITSS VWAR";
  } else if (isPhysicalCategory) {
    products = filterPhysicalProductsByTab(allProductsData, activePhysicalTab);
    activeTabLabel =
      PHYSICAL_STATIC_MENU.find((m) => m.id === activePhysicalTab)?.label ||
      "BITSS VWAR USB KEY PROTECTION";
  } else if (isBundleCategory) {
    products = filterBundleProductsByTab(allProductsData, activeBundleTab);
    activeTabLabel =
      BUNDLE_STATIC_MENU.find((m) => m.id === activeBundleTab)?.label ||
      "BITSS Special Bundle Packs";
  }

  const scrollToProducts = () => {
    setTimeout(() => {
      const bar = document.querySelector(".category-filter-bar");
      if (bar) {
        const navH = 68;
        const targetY =
          bar.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      } else {
        const el = document.getElementById("products-section");
        if (el) {
          const targetY =
            el.getBoundingClientRect().top + window.pageYOffset - 124;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        }
      }
    }, 60);
  };

  function handleCategory(id) {
    setSelectedCatId(id);
    setActiveDigitalTab("vwar");
    setActivePhysicalTab("usb");
    setActiveBundleTab("special");
    if (id === null) {
      window.history.replaceState(null, "", "/products");
    } else {
      window.history.replaceState(null, "", `/products?category=${id}`);
    }
    // On mobile view, keep previous system of auto-scrolling to products
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      scrollToProducts();
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        body { background:#fff; font-family:'Poppins',sans-serif; overflow-x:hidden; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:9999px; }
        ::-webkit-scrollbar-thumb:hover { background:#94a3b8; }
        .scrollbar-hide::-webkit-scrollbar { display:none !important; width:0 !important; height:0 !important; }
        .scrollbar-hide { -ms-overflow-style:none !important; scrollbar-width:none !important; }
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
      <section className="relative overflow-hidden bg-white pt-[96px] sm:pt-[118px] lg:pt-[122px]">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_65%_30%,rgba(254,242,242,0.9)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-2 sm:pt-3 lg:pt-3.5 pb-5 sm:pb-7 lg:pb-8">
          {/* Breadcrumb */}
          <nav className="fu1 flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[12.5px] font-medium text-slate-400 mb-3.5 sm:mb-5 flex-wrap">
            <Link href="/" className="hover:text-slate-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/products"
              className="hover:text-slate-600 transition-colors"
            >
              Products
            </Link>
            <ChevronRight size={12} />
            <span
              className={
                isDigitalCategory
                  ? "text-[#70C041] font-semibold"
                  : isPhysicalCategory
                  ? "text-[#0078D4] font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {activeCategory?.name ||
                (isDigitalCategory
                  ? "Digital Security Products"
                  : isPhysicalCategory
                  ? "Physical Security Products"
                  : "All Products")}
            </span>
          </nav>

          <div className="max-w-4xl">
            <div className="fu1 mb-3">
              {isDigitalCategory ? (
                <span className="font-['Outfit'] inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#70C041]/10 border border-[#70C041]/30 text-[#70C041] text-[11px] font-bold tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70C041] animate-pulse" />
                  ONLINE PURCHASE
                </span>
              ) : isPhysicalCategory ? (
                <span className="font-['Outfit'] inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0078D4]/10 border border-[#0078D4]/30 text-[#0078D4] text-[11px] font-bold tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] animate-pulse" />
                  DOORSTEP DELIVERY
                </span>
              ) : (
                <Tag>{activeCategory ? activeCategory.name : "All Products"}</Tag>
              )}
            </div>
            <h1
              className="fu2 font-['Outfit'] font-black leading-[0.98] tracking-tight text-slate-900 mb-3 sm:mb-4 uppercase"
            >
              {isDigitalCategory ? (
                <>
                  <span
                    className="text-[#70C041] block font-black leading-[0.9] tracking-tight text-5xl md:text-7xl"
                    style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 900 }}
                  >
                    DIGITAL SECURITY
                    <br />
                    PRODUCTS
                  </span>
                  <span
                    className="text-slate-900 block font-extrabold tracking-normal mt-2 sm:mt-2.5 leading-snug"
                    style={{ fontSize: "clamp(15px, 2vw, 22px)" }}
                  >
                    PAY ONLINE AND DOWNLOAD INSTANTLY.
                  </span>
                </>
              ) : isPhysicalCategory ? (
                <>
                  <span
                    className="text-[#0078D4] block font-black leading-[0.9] tracking-tight text-5xl md:text-7xl"
                    style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 900 }}
                  >
                    PHYSICAL SECURITY
                    <br />
                    PACKS
                  </span>
                  <span
                    className="text-slate-900 block font-extrabold tracking-normal mt-2 sm:mt-2.5 leading-snug"
                    style={{ fontSize: "clamp(15px, 2vw, 22px)" }}
                  >
                    ORDER ONLINE AND RECEIVE DELIVERY TO YOUR ADDRESS.
                  </span>
                </>
              ) : activeCategory ? (
                <>
                  <span
                    className="block font-black leading-[0.9] tracking-tight text-5xl md:text-7xl text-slate-900"
                    style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 900 }}
                  >
                    {activeCategory.name
                      .toUpperCase()
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}
                    <br />
                    <span className="text-red-600">
                      {activeCategory.name
                        .toUpperCase()
                        .split(" ")
                        .slice(2)
                        .join(" ") || "PRODUCTS"}
                    </span>
                  </span>
                  <span
                    className="text-slate-900 block font-extrabold tracking-normal mt-2 sm:mt-2.5 leading-snug"
                    style={{ fontSize: "clamp(15px, 2vw, 22px)" }}
                  >
                    {activeCategory.sort_description ||
                      "BROWSE PRODUCTS IN THIS CATEGORY."}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="block font-black leading-[0.9] tracking-tight text-5xl md:text-7xl text-slate-900"
                    style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 900 }}
                  >
                    THE COMPLETE
                    <br />
                    <span className="text-red-600">SECURITY SUITE</span>
                  </span>
                  <span
                    className="text-slate-900 block font-extrabold tracking-normal mt-2 sm:mt-2.5 leading-snug"
                    style={{ fontSize: "clamp(15px, 2vw, 22px)" }}
                  >
                    Every product purpose-built for a specific attack layer — no overlap, no gaps.
                  </span>
                </>
              )}
            </h1>
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER TABS: SUBMENU SYSTEM FOR ALL PRODUCTS, AS USUAL FOR OTHERS ── */}
      {isFromAllProducts ? (
        <>
          {/* Main Category Bar */}
          <div className="category-filter-bar sticky top-[68px] z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-xs py-2 sm:py-2.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div
                className="flex items-center overflow-x-auto scrollbar-hide py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth touch-pan-x sm:justify-center flex-nowrap"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="inline-flex items-center gap-1 sm:gap-2 bg-white rounded-full border border-slate-200/90 shadow-xs p-1 sm:p-1.5 shrink-0 my-auto flex-nowrap">
                  {/* All tab */}
                  <button
                    type="button"
                    onClick={(e) => {
                      handleCategory(null);
                      e.currentTarget.scrollIntoView?.({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                      });
                    }}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                      !activeCategoryId
                        ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                        : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-['Outfit'] font-black text-[12px] sm:text-[13px] tracking-tight whitespace-nowrap uppercase">
                      All
                    </span>
                    <span
                      className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap uppercase ${
                        !activeCategoryId
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {allTotalCount} {allTotalCount === 1 ? "PRODUCT" : "PRODUCTS"}
                    </span>
                  </button>

                  {/* Category tabs */}
                  {categories?.map((cat) => {
                    const isActive = activeCategoryId === cat.id;
                    const count = getCategoryCount(cat);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={(e) => {
                          handleCategory(cat.id);
                          e.currentTarget.scrollIntoView?.({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center",
                          });
                        }}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                          isActive
                            ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                            : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-['Outfit'] font-black text-[12px] sm:text-[13px] tracking-tight whitespace-nowrap uppercase">
                          {cat.name}
                        </span>
                        <span
                          className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap uppercase ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {count} {count === 1 ? "PRODUCT" : "PRODUCTS"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Category Pill Bar (Dynamically appears when category is selected) */}
          {(isDigitalCategory || isPhysicalCategory || isBundleCategory) && (
            <div className="sub-category-filter-bar sticky top-[120px] z-30 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200/80 py-1.5 sm:py-2 transition-all">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div
                  className="w-full overflow-x-auto scrollbar-hide py-0.5 scroll-smooth touch-pan-x"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <div className="flex w-max min-w-full justify-start sm:justify-center px-2">
                    <div className="inline-flex items-center gap-1 sm:gap-2 bg-white rounded-full border border-slate-200/90 shadow-xs p-1 sm:p-1.5 shrink-0 my-auto flex-nowrap">
                    {isDigitalCategory &&
                      DIGITAL_STATIC_MENU.map((item) => {
                        const isActive = activeDigitalTab === item.id;
                        const count = digitalCounts[item.id] ?? 0;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                              setActiveDigitalTab(item.id);
                              e.currentTarget.scrollIntoView?.({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "center",
                              });
                              scrollToProducts();
                            }}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                              isActive
                                ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                                : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <span className="font-['Outfit'] font-black text-[12px] sm:text-[13px] tracking-tight whitespace-nowrap uppercase">
                              {item.label}
                            </span>
                            <span
                              className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap uppercase ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {item.id === "ps"
                                ? "SUITE"
                                : `${count} ${count === 1 ? "PRODUCT" : "PRODUCTS"}`}
                            </span>
                          </button>
                        );
                      })}

                    {isPhysicalCategory &&
                      PHYSICAL_STATIC_MENU.map((item) => {
                        const isActive = activePhysicalTab === item.id;
                        const count = physicalCounts[item.id] ?? 0;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                              setActivePhysicalTab(item.id);
                              e.currentTarget.scrollIntoView?.({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "center",
                              });
                              scrollToProducts();
                            }}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                              isActive
                                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                                : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <span className="font-['Outfit'] font-black text-[12px] sm:text-[13px] tracking-tight whitespace-nowrap uppercase">
                              {item.label}
                            </span>
                            <span
                              className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap uppercase ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {count} {count === 1 ? "PRODUCT" : "PRODUCTS"}
                            </span>
                          </button>
                        );
                      })}

                    {isBundleCategory &&
                      BUNDLE_STATIC_MENU.map((item) => {
                        const isActive = activeBundleTab === item.id;
                        const count = bundleCounts[item.id] ?? 0;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                              setActiveBundleTab(item.id);
                              e.currentTarget.scrollIntoView?.({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "center",
                              });
                              scrollToProducts();
                            }}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                              isActive
                                ? "bg-slate-900 text-white shadow-xs"
                                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <span className="font-['Outfit'] font-bold text-[12px] tracking-tight whitespace-nowrap uppercase">
                              {item.label}
                            </span>
                            <span
                              className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap uppercase ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {count} {count === 1 ? "PRODUCT" : "PRODUCTS"}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </>
      ) : (
        /* Others keep as usual: single menu bar */
        isDigitalCategory ? (
          <div className="category-filter-bar sticky top-[68px] z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm py-2 sm:py-2.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div
                className="w-full overflow-x-auto scrollbar-hide py-1 scroll-smooth touch-pan-x"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="flex w-max min-w-full justify-start sm:justify-center px-2">
                  <div className="inline-flex items-center gap-1 sm:gap-2 bg-white rounded-full border border-slate-200/90 shadow-xs p-1 sm:p-1.5 shrink-0 my-auto flex-nowrap">
                    {DIGITAL_STATIC_MENU.map((item) => {
                      const isActive = activeDigitalTab === item.id;
                      const count = digitalCounts[item.id] ?? 0;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            setActiveDigitalTab(item.id);
                            e.currentTarget.scrollIntoView?.({
                              behavior: "smooth",
                              block: "nearest",
                              inline: "center",
                            });
                            scrollToProducts();
                          }}
                          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                            isActive
                              ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                              : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <span className="font-['Outfit'] font-black text-[12px] sm:text-[13px] tracking-tight whitespace-nowrap uppercase">
                            {item.label}
                          </span>
                          <span
                            className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap uppercase ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item.id === "ps"
                              ? "SUITE"
                              : `${count} ${count === 1 ? "PRODUCT" : "PRODUCTS"}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isPhysicalCategory ? (
          <div className="category-filter-bar sticky top-[68px] z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm py-2 sm:py-2.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div
                className="flex items-center overflow-x-auto scrollbar-hide py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth touch-pan-x sm:justify-center flex-nowrap"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="inline-flex items-center gap-1 sm:gap-2 bg-white rounded-full border border-slate-200/90 shadow-xs p-1 sm:p-1.5 shrink-0 my-auto flex-nowrap">
                  {PHYSICAL_STATIC_MENU.map((item) => {
                    const isActive = activePhysicalTab === item.id;
                    const count = physicalCounts[item.id] ?? 0;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => {
                          setActivePhysicalTab(item.id);
                          e.currentTarget.scrollIntoView?.({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center",
                          });
                          scrollToProducts();
                        }}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                          isActive
                            ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                            : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-['Outfit'] font-black text-[12px] sm:text-[13px] tracking-tight whitespace-nowrap uppercase">
                          {item.label}
                        </span>
                        <span
                          className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap uppercase ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {count} {count === 1 ? "Product" : "Products"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : isBundleCategory ? (
          <div className="category-filter-bar sticky top-[68px] z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm py-2 sm:py-2.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div
                className="flex items-center overflow-x-auto scrollbar-hide py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth touch-pan-x sm:justify-center flex-nowrap"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="inline-flex items-center gap-1 sm:gap-2 bg-white rounded-full border border-slate-200/90 shadow-xs p-1 sm:p-1.5 shrink-0 my-auto flex-nowrap">
                  {BUNDLE_STATIC_MENU.map((item) => {
                    const isActive = activeBundleTab === item.id;
                    const count = bundleCounts[item.id] ?? 0;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => {
                          setActiveBundleTab(item.id);
                          e.currentTarget.scrollIntoView?.({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center",
                          });
                          scrollToProducts();
                        }}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                          isActive
                            ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                            : "text-slate-800 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-['Outfit'] font-bold text-[12px] tracking-tight whitespace-nowrap">
                          {item.label}
                        </span>
                        <span
                          className={`text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {count} {count === 1 ? "Product" : "Products"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* ── PRODUCTS SECTION OR SERVER PROTECTION FULL DETAILS ── */}
      {isDigitalCategory && activeDigitalTab === "ps" ? (
        /* Preview full details of https://preview.bitss.one/bitss-server-protection */
        <div
          id="products-section"
          className="w-full bg-slate-50 border-t border-slate-100 scroll-mt-28 sm:scroll-mt-36"
        >
          <ServerProtection2 />
        </div>
      ) : (
        <section
          id="products-section"
          className="relative pt-4 sm:pt-6 pb-16 sm:pb-20 lg:pb-24 bg-white overflow-hidden scroll-mt-28 sm:scroll-mt-36"
        >
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <Tag>
                  {isLoading
                    ? "Loading…"
                    : `${products?.length} Product${products?.length !== 1 ? "s" : ""}`}
                </Tag>
                <h2
                  className="font-['Outfit'] font-black text-slate-900 mt-2 sm:mt-2.5 leading-none uppercase"
                  style={{ fontSize: "clamp(24px,4vw,43px)" }}
                >
                  {isMetaCategory ? (
                    <>
                      {activeDigitalTab === "wap" ? "BITSS WAP INTERNAL FIREWALL" : activeTabLabel}{" "}
                      <span className="text-red-600">PRODUCTS</span>
                    </>
                  ) : activeCategory ? (
                    <>
                      <span className="text-red-600">
                        {activeCategory.name}
                      </span>
                    </>
                  ) : (
                    <>
                      ALL <span className="text-red-600">PRODUCTS</span>
                    </>
                  )}
                </h2>
              </div>
              {isMounted && selectedCountry && (
                <div className="flex items-center gap-2 text-[13px] text-slate-400">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: selectedCountry?.currency_icon,
                    }}
                    className="text-slate-600 font-semibold"
                  />
                  <span>
                    Showing prices for{" "}
                    <span className="text-slate-700 font-semibold">
                      {selectedCountry?.country_name}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
                <Loader2 size={22} className="animate-spin text-red-500" />
                <span className="text-[14px]">Loading products…</span>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-slate-500 text-[14px]">
                  Could not load products. Please try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && products?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <SlidersHorizontal size={22} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-[14px] text-center max-w-xs">
                  No products found for this section.
                </p>
              </div>
            )}

            {/* Grid */}
            {!isLoading && !isError && products?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} i={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
