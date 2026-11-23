import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmBankPaymentForm from "./ConfirmBankPaymentForm";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BankPaymentConfirmationDialog({
  open,
  onOpenChange,
  orderId,
  setSentPaymentRequest,
}) {
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders/order/details/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Failed to fetch order details");
      return json;
    },
    enabled: !!token && !!orderId,
    staleTime: 1000 * 60 * 2,
  });
  const orderData = data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[94vw] max-w-lg max-h-[88vh] sm:max-h-[85vh] flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl bg-white p-4 sm:p-6 gap-0 focus:outline-none"
      >
        <DialogHeader className="text-left pb-3 border-b border-slate-100 shrink-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10.5px] font-bold uppercase tracking-wider">
              Bank Transfer
            </span>
            {orderData?.order_number && (
              <span className="text-[11px] font-mono font-bold text-slate-500">
                #INV-{orderData.order_number}
              </span>
            )}
          </div>
          <DialogTitle className="font-['Outfit',sans-serif] text-xl font-black text-slate-900 tracking-tight">
            Confirm Bank Payment
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
            Submit your payment details for{" "}
            <span className="font-mono font-bold text-slate-800">
              INV-{orderData?.order_number}
            </span>
            . Our team will verify and activate your account within 2–3 business days.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto pt-3.5 pr-0.5 flex-1">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              Loading order details...
            </div>
          ) : (
            <ConfirmBankPaymentForm
              orderData={orderData}
              orderId={orderId}
              setSentPaymentRequest={setSentPaymentRequest}
              onSuccess={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}