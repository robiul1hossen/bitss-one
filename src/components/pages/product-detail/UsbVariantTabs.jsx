"use client";
import { Usb, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatPrice } from "@/utils/formatPrice";
import SavingsBadge from "./SavingsBadge";

export default function UsbVariantTabs({
  prices = [],
  selectedId,
  onSelect,
  currencySymbol,
}) {
  // Group rows by variant_name
  const groupMap = {};
  prices.forEach((p) => {
    const key = p.variant_name ?? "Drive";
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(p);
  });

  const groups = Object.keys(groupMap)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map((name) => {
      const items = [...groupMap[name]].sort(
        (a, b) => Number(a.unit) - Number(b.unit),
      );
      // Best value = biggest bundle, shown first
      const best = items[items.length - 1];
      const ordered = [best, ...items.filter((i) => i.id !== best.id)];
      const minPrice = Math.min(...items.map((i) => i.price_after_discount));
      return { name, items: ordered, bestId: best.id, minPrice };
    });

  if (groups.length === 0) return null;

  // Active tab follows the selected plan
  const activeTab =
    prices.find((p) => p.id === selectedId)?.variant_name ?? groups[0].name;

  // Switching tab selects that tab's best-value plan
  const handleTabChange = (name) => {
    const group = groups.find((g) => g.name === name);
    if (group) onSelect(group.items[0].id);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      {/* Tab bar */}

      <TabsList
        className="grid h-auto w-full gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm sm:p-1.5"
        style={{
          gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`,
        }}
      >
        {groups.map((group) => (
          <TabsTrigger
            key={group.name}
            value={group.name}
            className="group flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-transparent px-1.5 py-2 text-sm font-bold text-slate-600 transition-all duration-300 sm:flex-row sm:gap-2 sm:px-3 sm:py-3 data-[state=active]:border-red-700 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <span className="font-['Barlow_Condensed'] text-[17px] font-black leading-none sm:text-[18px]">
              {group.name}
            </span>
            <span className="whitespace-nowrap rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 sm:px-2 sm:text-[10px] group-data-[state=active]:bg-red-500 group-data-[state=active]:text-white">
              <span className="hidden min-[400px]:inline">From </span>
              {currencySymbol}
              {formatPrice(group.minPrice)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab panels */}
      {groups.map((group) => (
        <TabsContent key={group.name} value={group.name} className="mt-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Panel header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600">
                  <Usb size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Barlow_Condensed'] text-lg md:text-[22px] font-normal md:font-black leading-none text-slate-900">
                      {group.name} Storage Drive
                    </h3>
                    <span className="rounded-full w-full text-center md:w-fit bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      {group.items.length} Plans
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Select number of device license keys loaded on this drive
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-[12px] text-slate-500">
                Starts from{" "}
                <span className="font-['Barlow_Condensed'] text-lg md:text-[24px] font-semibold md:font-black text-red-600">
                  {currencySymbol}
                  {formatPrice(group.minPrice)}
                </span>
              </p>
            </div>

            {/* Plan cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {group.items.map((p) => {
                const isSelected = p.id === selectedId;
                const isBest = p.id === group.bestId;
                const hasDisco = p.discount_type && p.discount_amount > 0;
                const keysLabel = `${p.unit} ${Number(p.unit) === 1 ? "Key" : "Keys"}`;

                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelect(p.id)}
                    className={`relative w-full rounded-2xl border-2 bg-white p-6 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                      ${
                        isSelected
                          ? "border-red-500 shadow-xl shadow-red-100/60"
                          : "border-slate-200 hover:border-red-300 hover:shadow-md"
                      }`}
                  >
                    {isBest && (
                      <span className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-md">
                        <Sparkles size={10} className="text-amber-400" />
                        Best Value
                      </span>
                    )}

                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          {group.name} Drive
                        </p>
                        <p className="mt-0.5 font-['Barlow_Condensed'] text-[22px] font-black leading-tight text-slate-900">
                          {keysLabel}
                        </p>
                      </div>
                      <div
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300
                          ${isSelected ? "border-red-500 bg-red-500" : "border-slate-300"}`}
                      >
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>

                    <div className="mb-2 flex items-end gap-2">
                      <span className="font-['Barlow_Condensed'] text-[34px] font-bold leading-none text-slate-900">
                        {currencySymbol}
                        {formatPrice(p.price_after_discount)}
                      </span>
                      {hasDisco && (
                        <span className="mb-1 text-[14px] text-slate-400 line-through">
                          {currencySymbol}
                          {formatPrice(p.original_price)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        one-time payment
                      </span>
                      {hasDisco && (
                        <SavingsBadge
                          discountType={p.discount_type}
                          discountAmount={p.discount_amount}
                          currencySymbol={currencySymbol}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
