import PrivateRoute from "@/components/shared/PrivateRoute";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import DashboardInner from "@/components/dashboard/DashboardInner";

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-red-500" />
        </div>
      }
    >
      <PrivateRoute>
        <DashboardInner />
      </PrivateRoute>
    </Suspense>
  );
}
