import { Suspense } from "react";
import BandStripeSuccess from "@/components/pages/checkout/success/BandStripeSuccess";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
        </div>
      }
    >
      <BandStripeSuccess />
    </Suspense>
  );
}
