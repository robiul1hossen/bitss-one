"use client";

import { Suspense } from "react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { Loader2 } from "lucide-react";
import OrderDetailsInner from "@/components/pages/orderDetails/OrderDetailsInner";

export default function OrderDetails() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-red-500" />
        </div>
      }
    >
      <PrivateRoute>
        <OrderDetailsInner />
      </PrivateRoute>
    </Suspense>
  );
}
