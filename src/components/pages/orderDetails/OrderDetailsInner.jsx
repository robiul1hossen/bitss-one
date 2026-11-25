import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import LicenseTable from "@/components/pages/orderDetails/LicenseTable";
import { formatDate } from "@/utils/orderHelpers";
import BankPaymentConfirmationDialog from "@/components/dashboard/bankPaymentConfirmation/BankPaymentConfirmationDialog";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  ExternalLink,
  Loader2,
  Wallet,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function OrderDetailsInner() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  // const [sentPaymentRequest, setSentPaymentRequest] = useState(false);
  const [sentPaymentRequest, setSentPaymentRequest] = useState(() => {
    return localStorage.getItem(`payment_sent_${orderId}`) === "true";
  });

  const { data, isLoading, isError, error } = useQuery({
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

  const order = data?.data ?? null;
  const hasBankInfo = order?.payment_method === "bank_transfer";
  const hasCredentials = order?.software_credentials.length > 0;
  const bankInfo = order?.country?.bank_informations[0];

  const status = order?.payment_status === "unpaid" ? "Unpaid" : "Paid";

  const additionalCharge = Number(order?.additional_charge) ?? 0;
  const processingFee = Number(additionalCharge.toFixed(2)) ?? 0;
  const TotalAmount = Number((order?.amount + processingFee).toFixed(2)) ?? 0;
  const crypto = order?.crypto_payment;

  const isCryptoPayment = !!crypto?.id && !!crypto?.signature;
  const cryptoAmount = Number(crypto?.amount);

  const formattedCryptoAmount = Number.isFinite(cryptoAmount)
    ? cryptoAmount.toFixed(9)
    : "0";

  const short = (a) => (a ? `${a.slice(0, 4)}…${a.slice(-4)}` : "");

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-red-500" />
          <p className="text-[13px] text-slate-400">Loading order details…</p>
        </div>
      </div>
    );

  if (isError || !order)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h2 className="font-['Barlow_Condensed'] text-[22px] font-black text-slate-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-[13px] text-slate-400 mb-6">
            {error?.message ?? "Could not load order details."}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-[14px] font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="pt-20 sm:pt-32 px-3 sm:px-6 pb-8 w-full max-w-5xl mx-auto ">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <nav className="flex items-center gap-2 text-[12px] text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/dashboard"
              className="hover:text-slate-600 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <span className="text-red-600 font-medium">Invoice</span>
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 text-[12px] font-semibold transition-all shadow-2xs"
          >
            <ArrowLeft size={13} /> Back to Orders
          </Link>
        </div>
        <div className="flex items-start justify-center ">
          <div className="bg-white rounded-2xl border border-slate-200 text-sm text-gray-800 overflow-hidden">
            <div className="px-4 sm:px-8 py-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                    Invoice
                  </h1>
                  <p className="text-xs text-gray-500 font-mono">
                    #{order?.order_number}
                  </p>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-1">
                  <span
                    className={`text-white px-3 py-1 text-xs font-bold rounded-full ${
                      status === "Paid" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {status}
                  </span>
                  {isCryptoPayment && (
                    <span className="text-[11px] text-gray-500">
                      Paid with {crypto?.currency || "SPUMP"} on{" "}
                      {crypto?.network || "Solana"}
                    </span>
                  )}
                </div>
              </div>

              {/* Invoice Meta Grid */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2.5  bg-gray-50 rounded-xl p-3 mb-6 text-xs border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Invoice No:
                  </span>
                  <span className="font-mono font-bold text-gray-800">
                    {order?.order_number}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Order No:
                  </span>
                  <span className="font-mono font-bold text-gray-800">
                    {order?.order_number}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Issued Date:
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatDate(order?.start_at)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Expire At:
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatDate(order?.expire_at)}
                  </span>
                </div>
              </div>

              {/* Invoiced To / Pay To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  <p className="font-semibold text-gray-900 mb-2">
                    Invoiced To:
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Name:</span>{" "}
                    {order?.user?.name}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Phone:</span>{" "}
                    {order?.delivery_address?.phone_number ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Billing Email:</span>{" "}
                    {order?.user?.email}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Address:</span>{" "}
                    {order?.user?.address || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  <p className="font-semibold text-gray-900 mb-2">Pay To:</p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Name:</span> BFIN SASU
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Email:</span>{" "}
                    <Link
                      href="mailto:support@boboshomail.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@boboshomail.com
                    </Link>
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Company Reg No:</span>{" "}
                    53521773100012
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Address:</span> 8 rue de
                    Dublin, 34200, Sète, France
                  </p>
                </div>
              </div>

              {/* Subscription Duration */}
              {order?.subscription?.duration && (
                <div className="text-center font-semibold mb-4 bg-red-50/50 p-2.5 rounded-xl border border-red-100 text-xs">
                  <span className="text-gray-700">Subscription Duration: </span>
                  <span className="text-red-600 font-bold">
                    {order?.subscription?.duration} month(s)
                  </span>{" "}
                  {order.payment_method === "bank_transfer" && (
                    <span className="ml-2 text-slate-500">
                      (Free Trial:{" "}
                      <strong className="text-red-600">15 Days</strong>)
                    </span>
                  )}
                </div>
              )}

              {/* Products Table (Responsive with overflow) */}
              <div className="overflow-x-auto w-full mb-6 border border-gray-200 rounded-xl">
                <table className="w-full text-sm min-w-125">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-xs">
                      <th className="text-left px-3.5 py-2.5 font-semibold text-gray-800">
                        Product Name
                      </th>
                      <th className="text-left px-3.5 py-2.5 font-semibold text-gray-800">
                        Unit Price
                      </th>
                      {order?.subscription?.duration && (
                        <th className="text-left px-3.5 py-2.5 font-semibold text-gray-800">
                          Duration
                        </th>
                      )}
                      <th className="text-left px-3.5 py-2.5 font-semibold text-gray-800">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-3.5 py-3">
                        <p className="font-medium text-gray-900">
                          {order?.product?.name}
                        </p>
                      </td>
                      <td className="px-3.5 py-3 text-gray-700 font-semibold whitespace-nowrap">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: order?.country?.currency_icon,
                          }}
                        />{" "}
                        {order?.amount}
                      </td>
                      {order?.subscription?.duration && (
                        <td className="px-3.5 py-3 text-gray-700 whitespace-nowrap">
                          {order?.subscription?.duration} month(s)
                        </td>
                      )}
                      <td className="px-3.5 py-3 text-gray-700 font-semibold whitespace-nowrap">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: order?.country?.currency_icon,
                          }}
                        />{" "}
                        {order?.amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Crypto Payment Section & Totals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6">
                {/* Left: Crypto Payment Details Card (or empty space placeholder when not crypto) */}
                {isCryptoPayment ? (
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center text-red-500">
                          <Wallet size={14} />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          Crypto Payment
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100">
                        <Check size={12} strokeWidth={2.5} /> Verified on-chain
                      </span>
                    </div>

                    {/* Amount Paid Callout */}
                    <div className="flex items-center justify-between bg-slate-50/70 rounded-xl px-4 py-3 mb-4 border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                        AMOUNT PAID
                      </span>
                      <div className="text-right">
                        <span className="text-lg font-black text-red-600 font-mono tracking-tight">
                          {formattedCryptoAmount}
                        </span>{" "}
                        <span className="text-xs font-bold text-red-600">
                          {crypto?.currency}
                        </span>
                      </div>
                    </div>

                    {/* Key-Value Details */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Network</span>
                        <span className="font-semibold text-slate-900">
                          {crypto?.network}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Currency</span>
                        <span className="font-semibold text-slate-900">
                          {crypto?.currency === "SPUMP"
                            ? " SPUMP (SPL token)"
                            : "SOL"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Sender wallet</span>
                        <span className="font-mono text-slate-800">
                          {short(crypto?.sender_wallet)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Confirmed on</span>
                        <span className="text-slate-800">
                          {formatDate(crypto?.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Transaction ID</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-800">
                            {short(crypto?.signature)}
                          </span>
                          {/* TODO: LIVE TRANSITION - Change devnet URL to mainnet.
                              Currently hardcoded to '?cluster=devnet' for testing.
                              When going live, remove '?cluster=devnet' or dynamically check network/RPC so it links to the live Solana mainnet transaction on Solscan. */}
                          <Link
                            href={`https://solscan.io/tx/${crypto?.signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-red-600 underline font-medium hover:text-red-700"
                          >
                            Solscan <ExternalLink size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Footnote */}
                    <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
                      This payment was confirmed on the Solana blockchain.
                      Network fees were paid by the sender.
                    </p>
                  </div>
                ) : (
                  <div
                    className="hidden lg:block lg:col-span-7"
                    aria-hidden="true"
                  />
                )}

                {/* Right: Totals (stays in lg:col-span-5) */}
                <div className="lg:col-span-5 flex justify-end w-full">
                  <div className="w-full space-y-2 text-sm bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Sub Total:</span>
                      <span className="font-medium">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: order?.country?.currency_icon,
                          }}
                        />{" "}
                        {order?.amount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: order?.country?.currency_icon,
                          }}
                        />{" "}
                        {processingFee}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                      <span className="text-gray-700 font-bold">
                        {status === "Paid"
                          ? "Total Paid Amount:"
                          : "Net Payable:"}
                      </span>
                      <span className="font-bold text-base text-gray-900 font-['Outfit']">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: order?.country?.currency_icon,
                          }}
                        />{" "}
                        {TotalAmount}
                      </span>
                    </div>
                    {isCryptoPayment && (
                      <div className="text-right pt-0.5">
                        <span className="text-[11px] font-semibold text-red-600">
                          Paid in {formattedCryptoAmount} {crypto?.currency}
                        </span>
                      </div>
                    )}
                    {hasBankInfo && order?.payment_status === "unpaid" && (
                      <>
                        <button
                          onClick={() => setOpen(true)}
                          disabled={sentPaymentRequest}
                          className={`w-full text-xs font-bold py-2 rounded-lg text-white mt-3 transition-colors ${
                            sentPaymentRequest
                              ? "cursor-not-allowed bg-green-500"
                              : "bg-red-600 hover:bg-red-700 cursor-pointer shadow-sm shadow-red-600/20"
                          }`}
                        >
                          {sentPaymentRequest
                            ? "Payment Request Submitted"
                            : "Confirm Bank Payment"}
                        </button>
                        <BankPaymentConfirmationDialog
                          setSentPaymentRequest={setSentPaymentRequest}
                          open={open}
                          onOpenChange={setOpen}
                          orderId={orderId}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              {hasCredentials && (
                <div className="mb-10 border-gray-200">
                  <LicenseTable data={order?.software_credentials} />
                </div>
              )}

              {/* Delivery Address */}
              {order?.delivery_address?.address && (
                <div className="mb-4 mt-10">
                  <p>
                    <span className="font-semibold">Delivery Address :</span>{" "}
                    {order?.delivery_address?.address}
                  </p>
                  <p>
                    <span className="font-semibold">Pone Number :</span>{" "}
                    {order?.delivery_address?.phone_number}
                  </p>
                </div>
              )}

              {/* Bank Transfer */}
              {hasBankInfo && (
                <div className="mb-5">
                  <p className="mb-2 text-gray-700">
                    Please transfer the payment to the following bank details:
                  </p>
                  <p className="font-semibold text-gray-900 mb-2">
                    Our bank transfer details:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>
                      <span className="font-medium">Bank Name:</span>{" "}
                      {bankInfo?.bank_name}
                    </li>
                    <li>
                      <span className="font-medium">Account Name:</span>{" "}
                      {bankInfo?.acc_holder_name}
                    </li>
                    <li>
                      <span className="font-medium">Account Number:</span>{" "}
                      {bankInfo?.account_no}
                    </li>
                    {bankInfo?.branch && (
                      <li>
                        <span className="font-medium">Branch:</span>{" "}
                        {bankInfo?.branch}
                      </li>
                    )}
                    {bankInfo?.routing_number && (
                      <li>
                        <span className="font-medium">Routing Number:</span>{" "}
                        {bankInfo?.routing_number}
                      </li>
                    )}
                    {bankInfo?.swift_code && (
                      <li>
                        <span className="font-medium">Swift Code:</span>{" "}
                        {bankInfo?.swift_code}
                      </li>
                    )}
                  </ul>
                  <p className="text-gray-500 text-xs mt-2">
                    bank details for Indian clients buying hosting name of
                    company
                  </p>
                </div>
              )}

              {/* Indian Bank Details */}
              {hasBankInfo && (
                <>
                  <div className="mb-6">
                    <p>
                      <span className="font-semibold">
                        Bank Transfer Charge:
                      </span>{" "}
                      0%
                    </p>
                  </div>
                </>
              )}

              {/* Support Notice */}
              <div className="mb-6">
                <p className="text-red-600 text-xs italic">
                  <span>
                    Once your order has been confirmed, if you encounter any
                    issues or require further assistance, please contact our
                    BITSS Security Support Team.
                  </span>{" "}
                  <br />
                  <span className="text-muted-foreground">
                    Email: support@bobosohomail.com
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    Hotline: +0033 666 100 010
                  </span>
                </p>
              </div>

              {/* Policy Note */}
              {/* <p className="text-center text-xs text-gray-700 font-semibold mb-3">
                Note: Your acceptation of this order is your acceptation of
                Bfinit conditions / cookie & privacy policy.
              </p> */}

              {/* Thank You */}
              <p className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
                Thank you for business with BITSS Security!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
