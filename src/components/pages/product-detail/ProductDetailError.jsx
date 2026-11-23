import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ProductDetailError({ message }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h2 className="font-['Barlow_Condensed'] text-[28px] font-black text-slate-900 mb-2">
          PRODUCT NOT FOUND
        </h2>
        <p className="text-slate-500 text-[14px] mb-6">
          {message ?? "We couldn't load this product. Please try again."}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-[14px] transition-all"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>
    </div>
  );
}
