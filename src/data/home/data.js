import {
  Zap,
  Globe,
  Server,
  Shield,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const BUNDLES = [
  {
    name: "Web Shield Pack",
    desc: "Complete web-layer security for your online presence.",
    fullDesc: [
      {
        title: "WAP Protect",
        text: "Real-time web application firewall that monitors and blocks malicious traffic, injection attacks, and unauthorized access attempts on your website before they cause damage.",
      },
      {
        title: "Contact Form Shield",
        text: "Protects your website contact forms from spam bots, automated attacks, and malicious submissions. Ensures only legitimate enquiries reach your inbox.",
      },
      {
        title: "VWAR for Websites",
        text: "Server-side security daemon that continuously monitors your hosted website files for unauthorized changes, malware injections, and suspicious activity. Automatically alerts and responds to threats in real time.",
      },
    ],
    products: ["WAP Protect", "Contact Form Shield", "VWAR for Websites"],
    icon: Globe,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    border: "border-slate-200 hover:border-red-300",
    bg: "bg-white",
    checkColor: "text-red-500",
    btnClass:
      "border border-slate-200 text-slate-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50",
    popular: false,
  },
  {
    name: "Full Coverage",
    desc: "Every entry point secured. One ecosystem, full chain.",
    fullDesc: [
      {
        title: "WAP Protect",
        text: "Real-time web application firewall that monitors and blocks malicious traffic, injection attacks, and unauthorized access attempts on your website before they cause damage.",
      },
      {
        title: "Contact Form Shield",
        text: "Protects your website contact forms from spam bots, automated attacks, and malicious submissions. Ensures only legitimate enquiries reach your inbox",
      },
      {
        title: "VWAR for Websites",
        text: "Server-side security daemon that continuously monitors your hosted website files for unauthorized changes, malware injections, and suspicious activity. Automatically alerts and responds to threats in real time.",
      },
      {
        title: "VWAR for Windows",
        text: "System-level protection daemon running directly on your Windows machine. Blocks process injection, LSASS credential theft, ransomware write patterns, and suspicious file execution in real time.",
      },
      {
        title: "USB Key Protection",
        text: "An intelligent, self-defending USB drive that runs on an embedded VWAR security engine. It actively monitors, scans, and locks down its internal files against malware and unauthorized access, keeping your data secure on the device itself",
      },
    ],
    products: [
      "WAP Protect",
      "Contact Form Shield",
      "VWAR for Websites",
      "VWAR for Windows",
      "USB Key Protection",
    ],
    icon: ShieldCheck,
    iconBg: "bg-red-600",
    iconColor: "text-white",
    border: "border-red-600",
    bg: "bg-white",
    checkColor: "text-red-500",
    btnClass: "bg-red-600 hover:bg-red-700 text-white",
    popular: true,
  },
  {
    name: "Endpoint + Media",
    desc: "Device and removable media protection for your team.",
    fullDesc: [
      {
        title: "VWAR for Windows",
        text: "System-level protection daemon running directly on your Windows machine. Blocks process injection, LSASS credential theft, ransomware write patterns, and suspicious file execution in real time.",
      },
      {
        title: "USB Key Protection",
        text: "An intelligent, self-defending USB drive that runs on an embedded VWAR security engine. It actively monitors, scans, and locks down its internal files against malware and unauthorized access, keeping your data secure on the device itself.",
      },
    ],
    products: ["VWAR for Windows", "USB Key Protection"],
    icon: Server,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    border: "border-slate-200 hover:border-sky-300",
    bg: "bg-white",
    checkColor: "text-sky-500",
    btnClass:
      "border border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50",
    popular: false,
  },
];

export const TICKER = [
  {
    type: "BLOCKED",
    msg: "Malware payload in contact form submission",
    color: "text-emerald-400",
  },
  {
    type: "BLOCKED",
    msg: "Brute-force login attempt — admin panel",
    color: "text-emerald-400",
  },
  {
    type: "ALERT",
    msg: "Suspicious USB drive detected — WKSTN-07",
    color: "text-amber-400",
  },
  {
    type: "BLOCKED",
    msg: "SQL injection via contact form — neutralized",
    color: "text-emerald-400",
  },
  {
    type: "BLOCKED",
    msg: "Ransomware signature on Windows endpoint",
    color: "text-emerald-400",
  },
  {
    type: "INFO",
    msg: "Threat intelligence updated — 3,841 new IOCs",
    color: "text-sky-400",
  },
];

export const WHY = [
  {
    icon: Shield,
    label: "AI-First Defense",
    desc: "Deep learning trained on billions of threat signals.",
  },
  {
    icon: Globe,
    label: "Global Intel",
    desc: "12M sensors across 150+ countries, updated live.",
  },
  {
    icon: Zap,
    label: "Zero-Trust Ready",
    desc: "Every request verified. Every session monitored.",
  },
  {
    icon: CheckCircle2,
    label: "Compliance Built-in",
    desc: "GDPR, ISO 27001, PCI DSS out of the box.",
  },
];

export const TESTIMONIALS = [
  {
    q: "After a near-miss ransomware attack we switched to Bitss. Six months in, they've blocked 47 intrusion attempts without a single breach.",
    name: "Md. Rafiqul Islam",
    role: "CTO, Dhaka Commerce Group",
  },
  {
    q: "The SOC team responded in under 3 minutes. Their threat hunting uncovered an APT group dormant in our network for weeks.",
    name: "Sarah Chen",
    role: "CISO, FinTech Global",
  },
  {
    q: "Bitss found 34 critical misconfigurations on day one. ROI was immediate. The compliance reporting alone is worth the cost.",
    name: "James Okonkwo",
    role: "VP Security, Meridian Health",
  },
];
