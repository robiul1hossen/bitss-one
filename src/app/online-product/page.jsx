import React, { Suspense } from "react";
import ProductListing from "@/components/pages/products/ProductListing";

export default function OnlineProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
      }
    >
      <ProductListing productType="online" />
    </Suspense>
  );
}
