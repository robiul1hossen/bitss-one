"use client";
import Tag from "@/components/ui/tag";
import React from "react";
import BundleCard from "./BundleCard";
import { BUNDLES } from "@/data/home/data";

export default function BundleOffers() {
  return (
    <section
      id="bundles"
      className="relative py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden"
    >
      <div className="sub-grid absolute inset-0" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12 sm:mb-16">
          <Tag>Bundle Offers</Tag>
          <h2
            className="font-['Barlow_Condensed'] font-black text-slate-900 mt-4 sm:mt-5 mb-3 sm:mb-4 leading-none"
            style={{ fontSize: "clamp(28px,5vw,54px)" }}
          >
            CHOOSE YOUR <span className="text-red-600">COVERAGE</span>
          </h2>
          <p className="text-slate-500 text-[14px] sm:text-[15px] max-w-sm mx-auto leading-relaxed">
            Bundle packages ensure nothing falls through the cracks — at better
            value than buying separately.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-5 sm:gap-6 items-stretch justify-center">
          {BUNDLES.map((b, i) => (
            <BundleCard key={b.name} b={b} i={i} />
          ))}
        </div>

        <p className="text-center mt-6 sm:mt-8 text-[12px] text-slate-400">
          Bundle pricing available on request · Custom enterprise plans
          supported
        </p>
      </div>
    </section>
  );
}
