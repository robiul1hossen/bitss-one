import { Building2, Copy } from "lucide-react";
import { useState } from "react";

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={handleCopy}
      className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
      title="Copy"
    >
      {copied ? (
        <span className="text-[10px] font-bold text-emerald-500">Copied!</span>
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}

function BankRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-0 text-left">
      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[12.5px] sm:text-[13px] font-semibold text-slate-800 break-all select-all">
          {value}
        </span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

export default function CheckoutBankInfo({ bankInformations }) {
  const banks =
    bankInformations?.filter((b) => b.type_name === "bank_transfer") ?? [];
  if (!banks.length) return null;

  return (
    <div className="fu3 bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-sky-100 bg-sky-50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white border border-sky-200 flex items-center justify-center shrink-0">
          <Building2 size={15} className="text-sky-600" />
        </div>
        <div>
          <h2 className="font-['Outfit',sans-serif] text-[16px] font-bold text-slate-900">
            Bank Transfer Details
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Transfer the exact amount to one of the accounts below
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {banks.map((bank) => (
          <div
            key={bank.id}
            className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <p className="font-['Outfit',sans-serif] text-[15px] font-bold text-slate-900 mb-2">
              {bank.bank_name}
            </p>
            <BankRow
              label="Account Holder Name"
              value={bank?.acc_holder_name}
            />
            <BankRow label="Account No" value={bank.account_no} />
            <BankRow label="Branch" value={bank.branch} />
            <BankRow label="Routing No" value={bank.routing_number} />
            <BankRow label="Swift Code" value={bank.swift_code} />
          </div>
        ))}
      </div>
    </div>
  );
}
