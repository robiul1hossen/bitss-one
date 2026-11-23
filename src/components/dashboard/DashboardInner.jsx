"use client";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "@/components/dashboard/OrderCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { AlertCircle, Loader2, RefreshCw, ShoppingBag } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function resolveOrders(data) {
  if (!data) return [];
  // 1. Direct array
  if (Array.isArray(data)) return data;
  // 2. data.data is array
  if (Array.isArray(data.data)) return data.data;
  // 3. Laravel pagination: data.data.data
  if (Array.isArray(data.data?.data)) return data.data.data;
  // 4. data.data.orders
  if (Array.isArray(data.data?.orders)) return data.data.orders;
  // 5. data.orders
  if (Array.isArray(data.orders)) return data.orders;
  // 6. data.items or data.data.items
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data?.items)) return data.data.items;
  // 7. Auto-detect any array inside data.data
  if (typeof data.data === "object" && data.data !== null) {
    for (const key of Object.keys(data.data)) {
      if (Array.isArray(data.data[key])) return data.data[key];
    }
  }
  return [];
}

export default function DashboardInner() {
  const { token, user } = useAuth();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["user-orders", token],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders/index`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok || json.success === false || json.success === "false")
        throw new Error(json.message || "Failed to fetch orders");
      return json;
    },
    enabled: !!token,
    staleTime: 1000 * 10, // 10 seconds
    refetchOnMount: true,
  });

  const rawData = data?.data;
  const orders = resolveOrders(data);

  const apiCounts = rawData?.counts ?? data?.counts;

  // compute fallback stats from orders directly
  const stats = orders?.reduce(
    (acc, o) => {
      const s = (o.status || "").toLowerCase();
      const pStatus = (o.payment_status || "").toLowerCase();
      const pMethod = (o.payment_method || o.payment_type || "").toLowerCase();

      if (s === "active" || pStatus === "active") acc.active++;
      if (
        s === "processing" ||
        s === "pending" ||
        pStatus === "processing" ||
        pStatus === "pending"
      )
        acc.processing++;
      if (s === "expired" || pStatus === "expired") acc.expired++;
      if (s === "paid" || pStatus === "paid" || pStatus === "approved")
        acc.paid++;

      if (
        s.includes("bank") ||
        pMethod.includes("bank") ||
        Boolean(o.bank_payment_status) ||
        Boolean(o.is_bank_transfer)
      ) {
        acc.bank_submitted++;
      }
      return acc;
    },
    { active: 0, processing: 0, expired: 0, paid: 0, bank_submitted: 0 },
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        body{font-family:'Poppins',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp .5s ease forwards .05s;opacity:0}
        .fu2{animation:fadeUp .5s ease forwards .15s;opacity:0}
        .fu3{animation:fadeUp .5s ease forwards .25s;opacity:0}
        .dot-grid{background-image:radial-gradient(circle,#e2e8f0 1.5px,transparent 1.5px);background-size:26px 26px;}
      `}</style>

      <section className="relative min-h-screen bg-slate-50 overflow-hidden pt-16">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <DashboardHeader
            user={user}
            orderCount={orders.length}
            orderData={rawData}
            counts={apiCounts}
            stats={stats}
          />

          {/* Orders list */}
          <div className="fu2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="font-['Outfit'] text-[24px] font-black text-slate-900 tracking-tight">
                  MY ORDERS
                </h2>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  title="Refresh orders list"
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  <RefreshCw
                    size={14}
                    className={isFetching ? "animate-spin text-red-600" : ""}
                  />
                </button>
              </div>
              <span className="text-[12.5px] text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {/* loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={28} className="animate-spin text-red-500" />
                <p className="text-[13px] text-slate-400">
                  Loading your orders…
                </p>
              </div>
            )}

            {/* error */}
            {isError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle
                  size={15}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-red-600 text-[13px]">{error?.message}</p>
              </div>
            )}

            {/* empty */}
            {!isLoading && !isError && orders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <ShoppingBag size={28} className="text-slate-300" />
                </div>
                <div>
                  <p className="font-['Outfit'] text-[18px] font-black text-slate-900 mb-1">
                    No orders yet
                  </p>
                  <p className="text-[13px] text-slate-400 max-w-sm mx-auto">
                    Your orders will appear here once you make a purchase.
                  </p>
                  {user?.email && (
                    <p className="text-[12px] text-slate-500 mt-2 font-mono">
                      Logged in as:{" "}
                      <span className="text-slate-800 font-semibold">
                        {user.email}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* list */}
            {!isLoading && !isError && orders.length > 0 && (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
