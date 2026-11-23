import React from "react";

export default function CheckoutBankInfoWarning() {
  return (
    <div>
      <div className="flex items-start gap-3 bg-white border border-red-500 border-l-4 border-l-red-600 rounded-xl p-4 ">
        <svg
          className="w-5 h-5 text-amber-500 mt-0.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
        <div>
          <p className="text-xs font-semibold text-red-600 uppercase text-left tracking-wide mb-1">
            Important
          </p>

          <p className="text-[13.5px] text-amber-800 text-left leading-relaxed">
            On placing your order using{" "}
            <span className="font-medium text-base">Bank Transfer</span>, we
            will activate your account immediately as a demonstration of our
            confidence in you. Your login credentials and complete{" "}
            <span className="font-medium text-base">Bank Transfer</span> payment
            instructions will be sent to your email and will also be available
            on your client dashboard.
          </p>

          <p className="text-[13.5px] text-amber-800 text-left leading-relaxed mt-2">
            If payment Your account will remain active for a{" "}
            <span className="font-medium text-base">15 days</span> trial period
            while we wait for your payment. We strongly recommend completing the
            payment within{" "}
            <span className="font-medium text-base">2–3 days</span> of placing
            your order.
          </p>

          <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-snug mt-2">
            ⚠ If payment is not received within the{" "}
            <span className="font-medium text-base">15-days</span> period, your
            software access will be{" "}
            <span className="font-medium text-base">
              automatically suspended/deactivated
            </span>{" "}
            until the payment is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
