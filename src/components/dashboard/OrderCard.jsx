import Link from "next/link";
import {
  ChevronRight,
  Usb,
  Layers,
  Box,
  Files,
  Shapes,
  ShieldCheck,
} from "lucide-react";
import {
  getCurrencySymbol,
  getProductTypeBadge,
  getStatusBadge,
  getPaymentMethodLabel,
  getPaymentStatusBadge,
  formatDate,
} from "@/utils/orderHelpers";
import { formatPrice } from "@/utils/formatPrice";
import BankPaymentConfirmationDialog from "./bankPaymentConfirmation/BankPaymentConfirmationDialog";
import { useState } from "react";

function ProductIcon({ product }) {
  if (product?.is_usb) return <Usb size={20} className="text-violet-500" />;
  if (product?.is_combo) return <Layers size={20} className="text-amber-500" />;
  return <Box size={20} className="text-red-500" />;
}

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const [sentPaymentRequest, setSentPaymentRequest] = useState(() => {
    return localStorage.getItem(`payment_sent_${order?.id}`) === "true";
  });
  const currency = getCurrencySymbol(order.country?.currency_icon);
  const typeBadge = getProductTypeBadge(order.product);
  const statusBadge = getStatusBadge(order.status);

  const totalAmount = Number(order?.amount) + Number(order?.additional_charge);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-red-200 hover:shadow-xl hover:shadow-red-50/60 transition-all duration-300 overflow-hidden relative block">
      {/* top accent gradient */}
      <div className="h-1 w-full bg-linear-to-r from-red-600 via-red-500 to-amber-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* product icon + name */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-red-50/60 group-hover:border-red-100 transition-colors">
              <ProductIcon product={order.product} />
            </div>
            <div className="min-w-0">
              <p className="font-['Outfit'] text-[17px] sm:text-[18px] font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors">
                {order.product?.name ||
                  order.product_name ||
                  "BITSS Security Product"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11.5px] text-slate-400 font-mono font-medium">
                  #{order.order_number}
                </span>
              </div>
            </div>
          </div>

          {/* order status */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10.5px] font-bold uppercase tracking-wider shrink-0 ${statusBadge.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
            {statusBadge.label}
          </span>
        </div>

        {/* meta row: 4 modern cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Amount
            </p>
            <p className="text-[16px] font-black text-slate-900 font-['Outfit']">
              {currency}
              {formatPrice(totalAmount)}
            </p>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Started
            </p>
            <p className="text-[13px] font-semibold text-slate-700">
              {formatDate(order.start_at)}
            </p>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Expires
            </p>
            <p className="text-[13px] font-semibold text-slate-700">
              {formatDate(order.expire_at)}
            </p>
            {order?.payment_method === "bank_transfer" &&
              order?.payment_status === "unpaid" && (
                <p className="text-[9.5px] text-amber-600 mt-1 leading-tight font-medium">
                  Auto-updates upon verification
                </p>
              )}
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Country
            </p>
            <p className="text-[13px] font-semibold text-slate-700 truncate">
              {order.country?.country_name ?? "—"}
            </p>
          </div>
        </div>

        {/* footer row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            {/* product type */}
            <span
              className={`text-[10.5px] font-bold border px-2.5 py-0.5 rounded-full ${typeBadge.color}`}
            >
              {typeBadge.label}
            </span>
            {/* payment method + status */}
            {order?.payment_status && (
              <>
                <span className="text-[11px] text-slate-400 font-medium">
                  {getPaymentMethodLabel(order.payment_method)}
                </span>
                <span
                  className={`text-[10.5px] font-bold border px-2.5 py-0.5 rounded-full capitalize ${getPaymentStatusBadge(order.payment_status)}`}
                >
                  {order?.payment_status}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Link
              href={`/dashboard/orders/${order.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-[12px] transition-all cursor-pointer"
            >
              <Files size={14} className="text-slate-400" /> View Invoice
            </Link>

            {!order?.delivery_address && (
              <Link
                href={`/dashboard/credentials/${order?.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[12px] shadow-xs transition-all cursor-pointer"
              >
                <Shapes size={14} /> Get Products
              </Link>
            )}

            {order?.payment_method === "bank_transfer" && (
              <>
                {order?.payment_status === "unpaid" ? (
                  <>
                    <button
                      onClick={() => setOpen(true)}
                      disabled={sentPaymentRequest}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
                        sentPaymentRequest
                          ? "bg-amber-100 text-amber-800 border border-amber-200 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-95 cursor-pointer"
                      }`}
                    >
                      {sentPaymentRequest
                        ? "Payment Request Submitted"
                        : "Confirm Bank Payment"}
                    </button>

                    <BankPaymentConfirmationDialog
                      open={open}
                      onOpenChange={setOpen}
                      setSentPaymentRequest={setSentPaymentRequest}
                      orderId={order?.id}
                    />
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                    <ShieldCheck size={14} /> Payment Approved
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
