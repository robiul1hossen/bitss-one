"use client";
import { useCountry } from "@/context/CountryContext";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { fetchCategories } from "./fetchCategories";
import { fetchProducts } from "./fetchProducts";
import { SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ProductCat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedCountry } = useCountry();

  const activeCategoryId = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : null;

  const { data: categories } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch products
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", selectedCountry?.id, activeCategoryId],
    queryFn: () =>
      fetchProducts({
        countryId: selectedCountry?.id,
        // countryId: 1,
        categoryId: activeCategoryId,
      }),
    enabled: !!selectedCountry?.id,
    staleTime: 1000 * 60 * 5,
  });

  const activeCategory = categories?.find((c) => c.id === activeCategoryId);

  function handleCategory(id) {
    if (id === null) {
      router.push("/products");
    } else {
      router.push(`/products?category=${id}`);
    }
  }

  return (
    <div className="mt-40">
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-hide">
            <SlidersHorizontal
              size={14}
              className="text-slate-400 shrink-0 mr-1"
            />

            {/* All tab */}
            <button
              onClick={() => handleCategory(null)}
              className={`shrink-0 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                !activeCategoryId
                  ? "bg-red-600 text-white shadow-sm shadow-red-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              All
            </button>

            {/* Category tabs */}
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCategoryId === cat.id
                    ? "bg-red-600 text-white shadow-sm shadow-red-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
