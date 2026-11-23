import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ACADEMY_LINKS,
  CATEGORY_COLORS,
  colors,
  NAV_LINKS,
} from "@/data/navbarData/navData";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Coins,
  HardDrive,
  Loader2,
  Package,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCategoryConfig(cat) {
  const name = (cat?.name || "").toLowerCase();
  const slug = (cat?.slug || "").toLowerCase();
  const id = cat?.id;

  // Digital Security Products -> Lite Green
  if (id === 31 || name.includes("digital") || slug.includes("digital")) {
    return {
      Icon: ShieldCheck,
      cardBg:
        "bg-emerald-50/50 hover:bg-emerald-50/90 border border-emerald-100/80 hover:border-emerald-200/90 hover:shadow-xs",
      iconBox:
        "bg-emerald-100/80 text-[#70C041] border border-emerald-200/50 group-hover:bg-[#70C041] group-hover:text-white",
      titleColor: "text-slate-900 group-hover:text-emerald-950",
      arrowColor: "text-emerald-300 group-hover:text-[#70C041]",
      desc: "Downloadable security software & digital licences",
    };
  }

  // Physical Security Products -> Lite Blue
  if (
    id === 32 ||
    name.includes("physical") ||
    slug.includes("physical") ||
    name.includes("usb")
  ) {
    return {
      Icon: HardDrive,
      cardBg:
        "bg-sky-50/50 hover:bg-sky-50/90 border border-sky-100/80 hover:border-sky-200/90 hover:shadow-xs",
      iconBox:
        "bg-sky-100/80 text-[#0078D4] border border-sky-200/50 group-hover:bg-[#0078D4] group-hover:text-white",
      titleColor: "text-slate-900 group-hover:text-sky-950",
      arrowColor: "text-sky-300 group-hover:text-[#0078D4]",
      desc: "USB installation keys & physical hardware delivery",
    };
  }

  // Fallback
  return {
    Icon: Package,
    cardBg:
      "bg-slate-50/60 hover:bg-slate-100/80 border border-slate-200/70 hover:shadow-xs",
    iconBox: "bg-slate-100 text-slate-700 border border-slate-200",
    titleColor: "text-slate-900",
    arrowColor: "text-slate-300 group-hover:text-slate-600",
    desc:
      cat?.sort_description?.split("\r\n")[0] ||
      "Explore BITSS security products",
  };
}

export default function NavbarCenter() {
  const [productOpen, setProductOpen] = useState(false);
  const [academyOpen, setAcademyOpen] = useState(false);

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
  return (
    <div className="flex items-center">
      <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
        <Link
          href="/"
          className="px-3 py-1.5 text-[14px] rounded-lg transition-colors font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50"
        >
          Home
        </Link>
      </div>

      <div className="flex gap-1 lg:gap-1.5 items-center">
        <DropdownMenu open={productOpen} onOpenChange={setProductOpen}>
          <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors font-semibold outline-none cursor-pointer">
            Products
            <ChevronDown
              size={13}
              className="transition-transform duration-200 data-[state=open]:rotate-180"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={18}
            className="z-[150] w-[380px] sm:w-[410px] rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 bg-white p-2.5 overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
              {/* All Products */}
              <Link
                href="/products"
                onClick={() => setProductOpen(false)}
                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 transition-all duration-200 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                  <Package size={17} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-white block">
                      All Products
                    </span>
                    <span className="text-[9px] font-extrabold text-red-400 bg-white/10 px-1.5 py-0.5 rounded leading-none uppercase tracking-wide">
                      Full Suite
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 group-hover:text-white/80 mt-0.5 transition-colors truncate">
                    Browse our full security product range
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 shrink-0 transition-all"
                />
              </Link>

              <div className="my-0.5 border-t border-slate-100" />

              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-4 text-slate-400">
                  <Loader2 size={13} className="animate-spin" />
                  <span className="text-[11px]">Loading categories…</span>
                </div>
              )}
              {isError && (
                <div className="flex items-center justify-center py-4 text-slate-400">
                  <span className="text-[11px]">Could not load categories</span>
                </div>
              )}
              {categories && (
                <TooltipProvider delayDuration={120}>
                  <div className="flex flex-col gap-1.5">
                    {categories.map((cat) => {
                      const cfg = getCategoryConfig(cat);
                      const { Icon } = cfg;
                      const tooltipSide = "right";

                      const linkContent = (
                        <Link
                          href={`/products?category=${cat.id}`}
                          onClick={() => setProductOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${cfg.cardBg} transition-all duration-150 group`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${cfg.iconBox}`}
                          >
                            <Icon size={17} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-[13px] font-bold ${cfg.titleColor} leading-tight block`}
                            >
                              {cat.name}
                            </span>
                            <span className="text-[11px] text-slate-500 group-hover:text-slate-600 truncate block mt-0.5">
                              {cfg.desc}
                            </span>
                          </div>
                          <ChevronRight
                            size={14}
                            className={`${cfg.arrowColor} group-hover:translate-x-0.5 shrink-0 transition-all`}
                          />
                        </Link>
                      );

                      if (!cat.tooltip)
                        return <div key={cat.id}>{linkContent}</div>;

                      return (
                        <Tooltip key={cat.id}>
                          <TooltipTrigger asChild>
                            <div className="h-full">{linkContent}</div>
                          </TooltipTrigger>
                          <TooltipContent
                            side={tooltipSide}
                            sideOffset={10}
                            avoidCollisions={false}
                            className="bg-white border-2 border-red-200 text-slate-700 text-xs leading-relaxed shadow-2xl max-w-64 p-3 rounded-xl z-[9999]"
                          >
                            <p className="font-medium text-slate-800 text-[11px] leading-relaxed">
                              {cat.tooltip}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}

                    {/* BITSS Crypto Audit — Reddish accent */}
                    <a
                      href="https://cryptoaudit.bitss.one"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setProductOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-50/90 border border-rose-100/80 hover:border-rose-200 hover:shadow-xs transition-all duration-150 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-red-500 border border-rose-200/50 group-hover:bg-red-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                        <Coins size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900 group-hover:text-rose-950 leading-tight block">
                            BITSS Crypto Security - Insights & Audits
                          </span>
                          <span className="text-[9px] font-extrabold text-red-500 bg-red-100/80 px-1.5 py-0.5 rounded leading-none uppercase tracking-wide shrink-0">
                            Web3
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 group-hover:text-slate-600 truncate block mt-0.5">
                          Smart contract &amp; blockchain security audits
                        </span>
                      </div>
                      <ArrowUpRight
                        size={14}
                        className="text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 transition-all"
                      />
                    </a>
                  </div>
                </TooltipProvider>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {NAV_LINKS.map((l) =>
          l.dropdown ? (
            <DropdownMenu
              key={l.label}
              open={academyOpen}
              onOpenChange={setAcademyOpen}
            >
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors font-semibold outline-none cursor-pointer">
                {l.label}
                <ChevronDown
                  size={13}
                  className="transition-transform duration-200 data-[state=open]:rotate-180"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={18}
                className="z-[150] w-72 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden p-0"
              >
                {/* Header banner */}
                <Link
                  href="/security-academy"
                  onClick={() => setAcademyOpen(false)}
                  className="group flex items-center gap-3 px-4 py-6 mt-3 bg-linear-to-br from-slate-900 to-slate-800 hover:from-red-700 hover:to-red-900 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                    <BookOpen size={17} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-white">
                        Security Academy
                      </span>
                      <span className="text-[9px] font-black text-red-400 group-hover:text-white bg-white/10 px-1.5 py-0.5 rounded-md leading-none tracking-wide uppercase">
                        FREE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 group-hover:text-white/70 mt-0.5 transition-colors truncate">
                      Free guides on every attack surface
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-500 group-hover:text-white shrink-0 transition-colors"
                  />
                </Link>

                {/* Links grid */}
                <div className="p-3 grid grid-cols-2 gap-1.5">
                  {ACADEMY_LINKS.map(({ label, href, icon: Icon }, i) => {
                    const c = colors[i % colors.length];
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setAcademyOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${c.bg} transition-all duration-150 group`}
                      >
                        <Icon size={14} className={`shrink-0 ${c.icon}`} />
                        <span className="text-[12px] font-medium text-slate-700 group-hover:text-slate-900 leading-tight">
                          {label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              key={l.label}
              href={l.href}
              className="px-3 py-1.5 text-[14px] rounded-lg transition-colors font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50"
              target={l.label === "Crypto" ? "_blank" : undefined}
            >
              {l.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
