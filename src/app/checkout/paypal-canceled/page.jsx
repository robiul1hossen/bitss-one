import Link from "next/link";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ACTIONS = [
  { label: "Return to checkout", href: "/checkout", variant: "default" },
  { label: "Back to home", href: "/", variant: "outline" },
];

export default function PaypalCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Ban className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Payment canceled</h1>
            <p className="text-sm text-muted-foreground">
              You canceled the payment, so you have not been charged. You can
              return to checkout whenever you are ready.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 pt-2 sm:flex-row">
            {ACTIONS.map((a) => (
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
