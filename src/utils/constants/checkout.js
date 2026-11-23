import { Building2, Smartphone, CreditCard, Bitcoin } from "lucide-react";

export const PAYMENT_METHODS = [
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    desc: "Direct bank-to-bank transfer.",
    icon: Building2,
    accent: "sky",
  },
  //TODO: un-comment these payment method after backend is ready
  // {
  //   id: "mobile_banking",
  //   label: "Mobile Banking",
  //   desc: "bKash, Nagad, Rocket & more.",
  //   icon: Smartphone,
  //   accent: "emerald",
  // },
  {
    id: "stripe",
    label: "Card / Stripe",
    desc: "Visa, Mastercard, Amex.",
    icon: CreditCard,
    accent: "violet",
  },
  {
    id: "paypal",
    label: "Paypal",
    desc: "Paypal pay",
    icon: CreditCard,
    accent: "sky",
  },
  {
    id: "crypto",
    label: "Crypto",
    desc: "SPUMP,USFF,USDC",
    icon: Bitcoin,
    accent: "sky",
  },
];

export const ACCENT = {
  sky: {
    border: "border-sky-500",
    bg: "bg-sky-50",
    dot: "bg-sky-500",
    text: "text-sky-600",
  },
  emerald: {
    border: "border-emerald-500",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
  },
  violet: {
    border: "border-violet-500",
    bg: "bg-violet-50",
    dot: "bg-violet-500",
    text: "text-violet-600",
  },
};

export const PAYMENT_FEES = {
  stripe: { label: "Stripe fee", percent: 2.9, fixedUSD: 0.3 },
  paypal: { label: "PayPal fee", percent: 3.49, fixedUSD: 0.49 },
};
