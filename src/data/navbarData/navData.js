import { BookOpen, Globe, Lock, Mail, Server, Shield } from "lucide-react";

export const CATEGORY_COLORS = [
  { bg: "bg-red-50 hover:bg-red-100", dot: "bg-red-500" },
  { bg: "bg-orange-50 hover:bg-orange-100", dot: "bg-orange-500" },
  { bg: "bg-amber-50 hover:bg-amber-100", dot: "bg-amber-500" },
  { bg: "bg-sky-50 hover:bg-sky-100", dot: "bg-sky-500" },
  { bg: "bg-violet-50 hover:bg-violet-100", dot: "bg-violet-500" },
  { bg: "bg-emerald-50 hover:bg-emerald-100", dot: "bg-emerald-500" },
  { bg: "bg-teal-50 hover:bg-teal-100", dot: "bg-teal-500" },
  { bg: "bg-indigo-50 hover:bg-indigo-100", dot: "bg-indigo-500" },
];

export const ACADEMY_LINKS = [
  {
    label: "Website Security",
    href: "/security-academy/website-security",
    icon: Globe,
  },
  {
    label: "Malware Protection",
    href: "/security-academy/malware-protection",
    icon: Shield,
  },
  {
    label: "Ransomware Defense",
    href: "/security-academy/ransomware-defense",
    icon: Lock,
  },
  {
    label: "Server Security",
    href: "/security-academy/server-security",
    icon: Server,
  },
  {
    label: "Spam Protection",
    href: "/security-academy/spam-protection",
    icon: Mail,
  },
  {
    label: "Security Basics",
    href: "/security-academy/security-basics",
    icon: BookOpen,
  },
];

export const NAV_LINKS = [
  {
    label: "Academy",
    dropdown: [
      {
        group: "Resources",
        items: [
          {
            label: "Security Academy",
            href: "/security-academy",
            description: "Free guides on every attack surface",
            icon: BookOpen,
            highlight: true,
          },
        ],
      },
    ],
  },
  { label: "Bundle Offers", href: "/#bundles" },
  { label: "Why BITSS", href: "/why-bitss" },
  { label: "Contact", href: "/contact" },
];

export const colors = [
  { bg: "bg-amber-50 hover:bg-amber-100", icon: "text-amber-500" },
  { bg: "bg-violet-50 hover:bg-violet-100", icon: "text-violet-500" },
  { bg: "bg-blue-50 hover:bg-blue-100", icon: "text-blue-500" },
  { bg: "bg-orange-50 hover:bg-orange-100", icon: "text-orange-500" },
  { bg: "bg-red-50 hover:bg-red-100", icon: "text-red-500" },
  { bg: "bg-emerald-50 hover:bg-emerald-100", icon: "text-emerald-500" },
];
