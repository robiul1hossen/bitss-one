"use client";
import { useEffect, useState } from "react";
import { PAYMENT_METHODS, ACCENT } from "@/utils/constants/checkout";
import Image from "next/image";
import { Check, AlertCircle } from "lucide-react";
import { useCountry } from "@/context/CountryContext";
import { isPaypalSupported } from "@/data/paypalSupportedCurrency";

const cryptoMethods = [
  {
    id: "spump",
    label: "SPUMP",
    img: "/icon/spump.webp",
    style: "bg-red-600 text-white",
  },
  {
    id: "usff",
    label: "USFF",
    img: "/icon/usfranc.png",
    style: "bg-red-600 text-white",
  },
  {
    id: "usdc",
    label: "USDC",
    img: "/icon/usdc.webp",
    style: "bg-red-600 text-white",
  },
];

export default function CheckoutPaymentMethod({
  selected,
  onChange,
  product,
  bankInformation,
  selectedCrypto = "spump",
  onCryptoChange,
}) {
  const { selectedCountry } = useCountry();

  const isPhysical = Boolean(product?.is_delivery_address);
  const isBankPaymentIntegrated = (bankInformation?.length ?? 0) > 0;
  const isBankAvailable = !isPhysical && isBankPaymentIntegrated;

  const availableMethods = isBankAvailable
    ? PAYMENT_METHODS
    : PAYMENT_METHODS.filter((m) => m.id !== "bank_transfer");

  useEffect(() => {
    if (!isBankAvailable && selected === "bank_transfer") {
      onChange(availableMethods[0]?.id ?? "stripe");
    }
  }, [isBankAvailable, availableMethods, onChange, selected]);

  const handleCrypto = (id) => {
    if (onCryptoChange) {
      onCryptoChange(id);
    }
  };

  const isSupported = isPaypalSupported(selectedCountry);

  return (
    <div className="fu2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
        <h2 className="font-['Outfit',sans-serif] text-[18px] font-bold text-slate-900">
          Payment Method
        </h2>
        <p className="text-[12px] text-slate-400 mt-0.5">
          Select how you&apos;d like to pay
        </p>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
        {availableMethods.map((m) => {
          const isSelected = selected === m.id;
          const a = ACCENT[m.accent];
          const Icon = m.icon;

          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200
            ${
              isSelected
                ? `${a.border} ${a.bg}`
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                  isSelected ? "bg-white shadow-sm" : "bg-slate-50"
                }`}
              >
                <Icon
                  size={16}
                  className={isSelected ? a.text : "text-slate-400"}
                />
              </div>

              <p
                className={`text-[13px] font-bold mb-0.5 ${
                  isSelected ? "text-slate-900" : "text-slate-700"
                }`}
              >
                {m.label}
              </p>

              <p className="text-[11px] text-slate-400 leading-snug">
                {m.desc}
              </p>

              {m.id === "paypal" && !isSupported && (
                <span className="inline-block mt-1.5 text-[10.5px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-0.5">
                  Not supported ({selectedCountry?.currency_name || "currency"})
                </span>
              )}

              {isSelected && (
                <div
                  className={`absolute top-3 right-3 w-4 h-4 rounded-full ${a.dot} flex items-center justify-center`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected === "paypal" && !isSupported && (
        <div className="mx-4 sm:mx-5 mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[13px] flex items-center gap-2.5">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <span>
            Your selected currency (
            {selectedCountry?.currency_name || "selected"}) is not supported by
            PayPal
          </span>
        </div>
      )}

      {selected === "crypto" && (
        <div className="grid grid-cols-3 gap-2 p-4">
          {cryptoMethods.map((method) => {
            const isSelected = selectedCrypto === method.id;
            const isSpump = method.id === "spump";

            return (
              <div
                key={method.id}
                onClick={() => handleCrypto(method.id)}
                className={`relative border rounded-xl py-3.5 px-2 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer transition ${
                  isSelected
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* 30% discount badge for SPUMP */}
                {isSpump && (
                  <span className="absolute -top-2.5 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs tracking-tight">
                    30% OFF
                  </span>
                )}

                {/* Checkmark: only shows when this token is selected */}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-sky-500">
                    <Check strokeWidth={3.5} stroke="white" />
                  </span>
                )}

                <Image
                  src={method.img}
                  alt={method.label}
                  width={100}
                  height={100}
                  className="w-5 h-5 object-cover"
                />
                <div className="flex items-center gap-1">
                  <h2 className="font-semibold text-lg sm:text-xl">{method.label}</h2>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
