import { WHY } from "@/data/home/data";
import React from "react";

export default function WhyBitss() {
  return (
    <div className="bg-slate-900 py-12 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-700/30">
          {WHY.map((item) => {
            const IIcon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-slate-900 p-6 sm:p-7 lg:p-8 hover:bg-slate-800 transition-colors"
              >
                <IIcon
                  size={20}
                  strokeWidth={1.5}
                  className="text-red-500 mb-3 sm:mb-4"
                />
                <h4 className="font-['Barlow_Condensed'] text-[16px] sm:text-[17px] font-black text-white mb-1.5 sm:mb-2 tracking-wide">
                  {item.label}
                </h4>
                <p className="text-slate-400 text-[13px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
