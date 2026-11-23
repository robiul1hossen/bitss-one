import { Suspense } from "react";
import ProductsClient from "@/components/pages/products/ProductClient";
import ProductCat from "@/components/pages/products/ProductCat";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
