"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATES = {
  success: {
    Icon: CheckCircle2,
    iconWrap: "bg-emerald-50 text-emerald-600",
    title: "Payment successful",
    text: "Thank you for your purchase. A confirmation will be sent to your email.",
    actions: [
      {
        label: "View my orders",
        href: "/dashboard",
        variant: "default",
      },
      { label: "Back to home", href: "/", variant: "outline" },
    ],
  },
  failed: {
    Icon: XCircle,
    iconWrap: "bg-red-50 text-red-600",
    title: "Payment failed",
    text: "We could not complete your payment. You have not been charged.",
    actions: [
      { label: "Try again", href: "/checkout", variant: "default" },
      { label: "Back to home", href: "/", variant: "outline" },
    ],
  },
};

function Content() {
  const params = useSearchParams();
  const orderNumber = params.get("order_number");
  const state =
    params.get("status") === "success" ? STATES.success : STATES.failed;
  const { Icon } = state;

  const details = [
    orderNumber && { label: "Order number", value: orderNumber },
  ].filter(Boolean);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${state.iconWrap}`}
          >
            <Icon className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{state.title}</h1>
            <p className="text-sm text-muted-foreground">{state.text}</p>
          </div>

          {details.length > 0 && (
            <div className="w-full divide-y rounded-lg border text-sm">
              {details.map((d) => (
                <div key={d.label} className="flex justify-between px-4 py-3">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex w-full flex-col gap-2 pt-2 sm:flex-row">
            {state.actions.map((a) => (
              <Button
                key={a.label}
                asChild
                variant={a.variant}
                className="flex-1"
              >
                <Link href={a.href}>{a.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaypalSuccessPage() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}
