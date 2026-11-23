import React, { Suspense } from "react";
import ServerProtection2 from "@/components/pages/products/server-protection/ServerProtection2";
import { Loader2 } from "lucide-react";

export default function page() {
  return (
    <div className="mt-20">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-red-500" />
          </div>
        }
      >
        <ServerProtection2 />
      </Suspense>
    </div>
  );
}
