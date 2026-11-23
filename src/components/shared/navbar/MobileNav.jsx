import { useAuth } from "@/context/AuthContext";
import { useCountry } from "@/context/CountryContext";
import { ACADEMY_LINKS } from "@/data/navbarData/navData";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ChevronDown,
  Coins,
  Globe,
  HardDrive,
  Loader2,
  Package,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MobileNav({ menuOpen, setMenuOpen }) {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    clearAuth,
  } = useAuth();
  const { selectedCountry, resetCountry, selectCountry } = useCountry();
  const [academyOpen, setAcademyOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [langOptions, setLangOptions] = useState([]);
  async function fetchCategories() {
    const res = await fetch(`${BASE_URL}/all-categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return json.data;
  }

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/countries`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return json.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => {
        const options = Array.from(
          document.querySelectorAll(".goog-te-combo option"),
        ).filter((o) => o.value !== "");
        setLangOptions(options.map((o) => ({ value: o.value, text: o.text })));
      }, 350);
    }
  }, [menuOpen]);
  function handleLogout() {
    clearAuth();
    setUserMenuOpen(false);
  }

  return (
    <div>
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-90 h-full transition-all duration-300 overflow-y-auto ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white border-t border-slate-100 px-4 pb-5 pt-3 flex flex-col gap-1 min-h-full">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 text-[15px] text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Home
          </Link>

          {/* Products — dynamic accordion */}
          <div>
            <button
              onClick={() => setProductsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-[15px] text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Products
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {productsOpen && (
              <div className="ml-3 mt-1 border-l-2 border-slate-100 pl-3 flex flex-col gap-1.5">
                <Link
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-bold text-white bg-slate-900 rounded-xl transition-colors shadow-xs"
                >
                  <Package size={15} className="text-white shrink-0" />
                  <span className="flex-1">All Products</span>
                  <span className="text-[9px] font-extrabold text-red-400 bg-white/10 px-1.5 py-0.5 rounded leading-none uppercase">
                    Suite
                  </span>
                </Link>
                <div className="my-0.5 border-t border-slate-100" />
                {isLoading && (
                  <div className="flex items-center gap-2 px-2 py-2 text-slate-400">
                    <Loader2 size={12} className="animate-spin" />
                    <span className="text-[12px]">Loading…</span>
                  </div>
                )}
                {isError && (
                  <p className="px-2 py-1 text-[12px] text-slate-400">
                    Could not load categories
                  </p>
                )}
                {categories?.map((cat) => {
                  const name = (cat.name || "").toLowerCase();
                  const isDigital = cat.id === 31 || name.includes("digital");
                  const isPhysical = cat.id === 32 || name.includes("physical");
                  const Icon = isDigital
                    ? ShieldCheck
                    : isPhysical
                      ? HardDrive
                      : Package;
                  const bgClass = isDigital
                    ? "bg-emerald-50/60 border border-emerald-100 text-slate-900 font-bold"
                    : isPhysical
                      ? "bg-sky-50/60 border border-sky-100 text-slate-900 font-bold"
                      : "text-slate-600 hover:text-red-600 hover:bg-slate-50";
                  const iconBoxClass = isDigital
                    ? "bg-emerald-100/90 text-[#70C041]"
                    : isPhysical
                      ? "bg-sky-100/90 text-[#0078D4]"
                      : "bg-slate-100 text-slate-600";

                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 text-[13px] rounded-xl transition-colors ${bgClass}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBoxClass}`}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  );
                })}

                {/* BITSS Crypto Security - Insights & Audits — Reddish accent */}
                <a
                  href="https://cryptoaudit.bitss.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-bold rounded-xl transition-colors bg-rose-50/60 border border-rose-100 text-slate-900"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100/90 text-red-500 flex items-center justify-center shrink-0">
                    <Coins size={14} />
                  </div>
                  <span className="flex-1 truncate">
                    BITSS Crypto Security - Insights & Audits
                  </span>
                  <ArrowUpRight size={14} className="text-red-400 shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* Academy with accordion */}
          <div>
            <button
              onClick={() => setAcademyOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-[15px] text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Academy
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${academyOpen ? "rotate-180" : ""}`}
              />
            </button>

            {academyOpen && (
              <div className="ml-3 mt-1 border-l-2 border-red-100 pl-3 flex flex-col gap-0.5">
                <Link
                  href="/security-academy"
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-1.5 text-[13px] text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                >
                  View all Academy
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <p className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-1">
                  Security Academy
                </p>
                {ACADEMY_LINKS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Icon size={13} className="text-slate-400 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/#bundles"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 text-[15px] text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Pricing
          </Link>

          <Link
            href="/why-bitss"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 text-[15px] text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Why BITSS
          </Link>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 text-[15px] text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Contact
          </Link>

          {/* Translate — mobile */}
          <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors">
            <Globe size={15} className="text-slate-400 shrink-0" />
            <span className="text-[15px] text-slate-700 font-medium">
              Translate
            </span>
            <select
              onChange={(e) => {
                const desktopSelect = document.querySelector(".goog-te-combo");
                if (desktopSelect) {
                  desktopSelect.value = e.target.value;
                  desktopSelect.dispatchEvent(
                    new Event("change", { bubbles: true }),
                  );
                }
              }}
              className="ml-auto text-[13px] text-slate-500 border-none outline-none bg-transparent cursor-pointer"
            >
              <option value="">Select Language</option>
              {isLoading
                ? "loading..."
                : langOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.text}
                    </option>
                  ))}
            </select>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Region
            </p>
            <div className="grid grid-cols-3 gap-1.5 px-2 pb-2">
              {countries?.map((country) => (
                <button
                  key={country.id}
                  onClick={() => {
                    selectCountry(country);
                    setMenuOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all duration-150 cursor-pointer
                          ${
                            selectedCountry?.id === country.id
                              ? "border-red-300 bg-red-50"
                              : "border-slate-100 hover:border-red-200 hover:bg-red-50"
                          }`}
                >
                  <span
                    className="text-[15px] font-black leading-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: country.currency_icon }}
                  />
                  <span className="text-[9px] font-bold text-slate-500 text-center">
                    {country.abbreviation}
                  </span>
                </button>
              ))}
            </div>
            {selectedCountry && (
              <button
                onClick={() => resetCountry()}
                className="mx-2 w-[calc(100%-16px)] py-2 rounded-xl border border-slate-200 text-[12px] text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
              >
                Reset region
              </button>
            )}
          </div>

          <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-black text-red-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-center text-[14px] font-semibold hover:bg-slate-50 transition-colors"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center text-[14px] font-semibold hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-red-600 text-white text-center text-[15px] font-semibold"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="pt-4 pb-2 flex justify-center">
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-200 text-[13px] font-medium"
            >
              <X size={15} />
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
