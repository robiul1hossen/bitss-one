"use client";
import React from "react";
import LicenseTable from "../pages/orderDetails/LicenseTable";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Loader2, ShieldCheck } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function InvoiceCredentials({ invoiceId }) {
  const { token } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["invoice-details", invoiceId],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/orders/software-credential/${invoiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Failed to fetch order details");
      return json;
    },
    enabled: !!token && !!invoiceId,
    staleTime: 1000 * 60 * 2,
  });

  const licenseData = data?.data ?? [];

  return (
    <section className="relative min-h-screen bg-slate-50 pt-28 pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <nav className="flex items-center gap-2 text-[12px] text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <span className="text-red-600 font-medium">Software Records</span>
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 text-[12px] font-semibold transition-all shadow-2xs"
          >
            <ArrowLeft size={13} /> Back to Orders
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-semibold tracking-wide uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Software Access
          </div>
          <h1
            className="font-['Outfit'] font-black text-slate-900 leading-none tracking-tight"
            style={{ fontSize: "clamp(28px,4.5vw,44px)" }}
          >
            LICENSE &amp; <span className="text-red-600">SOFTWARE RECORDS</span>
          </h1>
          <p className="text-slate-500 text-[14px] mt-2 max-w-2xl leading-relaxed">
            Your unique license keys, deployment folders, documentation manuals, and software packages. Keep your security keys safe.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
            <Loader2 size={28} className="animate-spin text-red-500" />
            <p className="text-[13px] text-slate-500 font-medium">
              Loading license data…
            </p>
          </div>
        ) : (
          <LicenseTable data={licenseData} />
        )}
      </div>
    </section>
  );
}
