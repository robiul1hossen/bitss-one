import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginForm from "@/components/pages/login/Login";

export default function LoginPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-red-500" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </>
  );
}
