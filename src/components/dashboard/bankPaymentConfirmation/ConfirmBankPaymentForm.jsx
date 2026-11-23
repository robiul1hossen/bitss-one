import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Check, Copy, Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ConfirmBankPaymentForm({
  orderData,
  orderId,
  onSuccess,
  setSentPaymentRequest,
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [copiedAccount, setCopiedAccount] = useState(false);
  const { token } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    transaction_id: "",
    payment_date: "",
    amount: "",
    document: null,
    confirmed: false,
  });

  const handleCopyAccount = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const validate = (name, value) => {
    switch (name) {
      case "transaction_id":
        return !value.trim() ? "Required" : "";
      case "payment_date":
        return !value ? "Required" : "";
      case "amount":
        if (!value) return "Required";
        if (isNaN(value) || Number(value) <= 0) return "Invalid";
        return "";
      case "document":
        return !value ? "Receipt required" : "";
      case "confirmed":
        return !value ? "Please confirm" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    let fieldValue;
    if (e.target.type === "checkbox") fieldValue = e.target.checked;
    else if (e.target.type === "file") fieldValue = e.target.files?.[0] || null;
    else fieldValue = e.target.value;

    setBankFormData((prev) => ({
      ...prev,
      [e.target.name]: fieldValue,
    }));

    const error = validate(e.target.name, fieldValue);
    setErrors((prev) => ({ ...prev, [e.target.name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.entries(bankFormData).forEach(([name, value]) => {
      const error = validate(name, value);
      if (error) newErrors[name] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setBankFormData((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    setBankFormData((prev) => ({ ...prev, document: null }));
  };

  const { mutate: confirmPayment, isPending: isSubmitting } = useMutation({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("order_id", orderData?.id);
      formData.append("transaction_id", payload.transaction_id);
      formData.append("payment_date", payload.payment_date);
      formData.append("amount", payload.amount);
      if (payload.document) {
        formData.append("document", payload.document);
      }
      const res = await fetch(`${BASE_URL}/bank-payments/confirm`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.status === false)
        throw new Error(data.message || "Order failed.");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bank-confirmation"] });
      setSentPaymentRequest(data?.success);
      if (data?.success) {
        toast.success(data?.message);
        onSuccess();
      }
      localStorage.setItem(`payment_sent_${orderId}`, data?.success);
    },
    onError: (error) => {
      console.log("mutation error:", error.message);
      toast.error(error?.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    confirmPayment(bankFormData);
  };

  const bankInfo = orderData?.country?.bank_informations?.[0];

  return (
    <div className="space-y-3">
      {/* Compact Bank Info Card */}
      <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 text-xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
            <Building2 size={12} className="text-red-600" />
            Transfer To Account
          </span>
          <span className="text-[9.5px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
            SEPA / WIRE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Bank</p>
            <p className="font-semibold text-slate-800 truncate">{bankInfo?.bank_name || "—"}</p>
          </div>
          <div>
            <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Holder</p>
            <p className="font-semibold text-slate-800 truncate">{bankInfo?.acc_holder_name || "—"}</p>
          </div>
          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Account No / IBAN</p>
              {copiedAccount && (
                <span className="text-[9.5px] font-bold text-emerald-600">Copied!</span>
              )}
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded-lg border border-slate-200 mt-0.5">
              <span className="font-mono text-[11px] sm:text-[11.5px] font-bold text-slate-900 select-all tracking-wide break-all">
                {bankInfo?.account_no || "—"}
              </span>
              {bankInfo?.account_no && (
                <button
                  type="button"
                  onClick={() => handleCopyAccount(bankInfo.account_no)}
                  className="inline-flex items-center text-slate-400 hover:text-red-600 transition-colors p-0.5 shrink-0 ml-2"
                  title="Copy IBAN"
                >
                  {copiedAccount ? (
                    <Check size={13} className="text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              )}
            </div>
          </div>
          {bankInfo?.swift_code && (
            <div>
              <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Swift</p>
              <p className="font-mono font-semibold text-slate-800 text-[11px]">{bankInfo.swift_code}</p>
            </div>
          )}
          <div className="text-right">
            <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Total Due</p>
            <p className="font-['Outfit',sans-serif] text-sm font-black text-red-600">
              <span
                dangerouslySetInnerHTML={{
                  __html: orderData?.country?.currency_icon || "€",
                }}
              />
              {" "}{orderData?.amount}
            </p>
          </div>
        </div>
      </div>

      <form className="space-y-2.5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
            Transaction ID <span className="text-red-600">*</span>
          </label>
          <input
            name="transaction_id"
            type="text"
            value={bankFormData.transaction_id}
            onChange={handleChange}
            placeholder="e.g. TR-982348234"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400"
          />
          {errors.transaction_id && (
            <p className="text-red-600 text-[10.5px] mt-0.5">{errors.transaction_id}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
              Payment Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="payment_date"
              value={bankFormData.payment_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            />
            {errors.payment_date && (
              <p className="text-red-600 text-[10.5px] mt-0.5">{errors.payment_date}</p>
            )}
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
              Amount Transferred <span className="text-red-600">*</span>
            </label>
            <input
              name="amount"
              type="number"
              step="any"
              value={bankFormData.amount}
              onChange={handleChange}
              placeholder="e.g. 39.96"
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400"
            />
            {errors.amount && (
              <p className="text-red-600 text-[10.5px] mt-0.5">{errors.amount}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
            Proof of Transfer / Receipt <span className="text-red-600">*</span>
          </label>
          <input
            name="document"
            ref={inputRef}
            onChange={handleFileChange}
            type="file"
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <Image
                width={600}
                height={300}
                src={previewUrl}
                alt="Receipt Preview"
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-black text-white rounded-full p-1 transition-colors shadow-md"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full h-14 rounded-xl border border-dashed border-slate-300 hover:border-red-500 hover:bg-red-50/20 transition-all flex items-center justify-center gap-2 text-slate-500 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <UploadCloud size={13} />
              </div>
              <span className="text-xs font-semibold text-slate-700">Upload transfer receipt</span>
              <span className="text-[10px] text-slate-400">(PNG, JPG, PDF)</span>
            </button>
          )}
          {errors.document && (
            <p className="text-red-600 text-[10.5px] mt-0.5">{errors.document}</p>
          )}
        </div>

        <div className="flex items-start gap-2 pt-0.5">
          <input
            id="agreement"
            name="confirmed"
            type="checkbox"
            checked={bankFormData.confirmed}
            onChange={(e) =>
              setBankFormData((prev) => ({
                ...prev,
                confirmed: e.target.checked,
              }))
            }
            className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer shrink-0"
          />
          <label htmlFor="agreement" className="text-[11px] text-slate-600 cursor-pointer leading-tight">
            I confirm I have completed the bank transfer for the amount shown above.
          </label>
        </div>
        {errors.confirmed && (
          <p className="text-red-600 text-[10.5px]">{errors.confirmed}</p>
        )}

        <div className="pt-1.5">
          <button
            type="submit"
            disabled={!bankFormData?.confirmed || isSubmitting}
            className={`w-full py-2.5 rounded-full font-['Outfit',sans-serif] text-xs font-bold text-white transition-all duration-200 ${
              !bankFormData?.confirmed || isSubmitting
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-red-600 hover:bg-red-700 active:scale-[0.99] shadow-md shadow-red-600/20 cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-1.5 justify-center">
                <Loader2 size={13} className="animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Confirmation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}