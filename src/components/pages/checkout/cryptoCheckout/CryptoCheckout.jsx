import { Suspense } from "react";
import CryptoCheckoutInner from "./CryptoCheckoutInner";

export default function CryptoCheckout() {
  return (
    <Suspense fallback={null}>
      <CryptoCheckoutInner />
    </Suspense>
  );
}
