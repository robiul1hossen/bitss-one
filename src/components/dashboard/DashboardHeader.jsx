import Image from "next/image";

export default function DashboardHeader({
  user,
  orderData,
  counts: propCounts,
  stats,
  orderCount,
}) {
  const counts = propCounts ?? orderData?.counts;

  const totalOrders =
    counts?.total_orders ??
    counts?.total ??
    orderData?.total ??
    orderCount ??
    0;
  const activeOrders = counts?.active_orders ?? stats?.active ?? 0;
  const processingOrders = counts?.processing_orders ?? stats?.processing ?? 0;
  const paidOrders = counts?.paid_orders ?? stats?.paid ?? 0;
  const bankSubmitted =
    counts?.bank_payment_submitted_requests ?? stats?.bank_submitted ?? 0;
  const expiredOrders = counts?.expired_orders ?? stats?.expired ?? 0;

  return (
    <div className="fu1 mb-8">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 relative shrink-0">
          <Image
            src="/img/logo.png"
            alt="BITSS Logo"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-['Outfit'] text-[20px] font-black text-slate-900 tracking-tight leading-none">
          BITSS
        </span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-semibold tracking-wide uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            My Dashboard
          </span>
          <h1
            className="font-['Outfit'] font-black text-slate-900 leading-none tracking-tight"
            style={{ fontSize: "clamp(28px,5vw,46px)" }}
          >
            WELCOME BACK,{" "}
            <span className="text-red-600">
              {user?.name?.split(" ")[0]?.toUpperCase()}.
            </span>
          </h1>
          <p className="text-slate-500 text-[14px] mt-2">
            Manage your security subscriptions, orders, and software license records.
            {user?.email && (
              <span className="block sm:inline sm:ml-2 text-slate-400 text-[12px] font-mono">
                (Account: {user.email})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* stats cards */}
      <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {[
          { label: "Total Orders", value: totalOrders },
          {
            label: "Active",
            value: activeOrders,
            activeColor: "text-emerald-600",
          },
          {
            label: "Processing",
            value: processingOrders,
            activeColor: "text-amber-600",
          },
          {
            label: "Paid",
            value: paidOrders,
            activeColor: "text-blue-600",
          },
          {
            label: "Bank Submitted",
            value: bankSubmitted,
            activeColor: "text-indigo-600",
          },
          { label: "Expired", value: expiredOrders },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="text-[11px] font-semibold text-slate-500 leading-tight">
              {s.label}
            </div>
            <div
              className={`font-['Outfit'] text-[24px] sm:text-[26px] font-black mt-2 leading-none ${
                s.activeColor && Number(s.value) > 0 ? s.activeColor : "text-slate-900"
              }`}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
