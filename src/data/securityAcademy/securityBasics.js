import { Flame, Swords, ZapOff, ScanSearch, ShieldCheck } from "lucide-react";

export const SECTIONS = [
  {
    id: "what-is-cybersecurity",
    num: "01",
    title: "What is Cybersecurity",
    icon: ShieldCheck,
    accent: "#DC2626",
    accentText: "text-red-600",
    accentBg: "bg-red-50",
    iconBg: "bg-red-100",
    accentDot: "bg-red-500",
    accentBorder: "border-red-200",
    calloutLabel: "Definition",
    callout:
      "Cybersecurity is the discipline of protecting systems, networks, and data from digital attacks — it's not a product you buy, it's a practice you build.",
    body: [
      "Cybersecurity refers to the practice of protecting computer systems, networks, and digital infrastructure from unauthorized access, attacks, and data breaches.",
      "It involves technologies, processes, and policies designed to defend digital assets against malicious activity.",
    ],
    bullets: [
      "System & network protection",
      "Data breach prevention",
      "Security policy enforcement",
      "Digital asset defense",
    ],
  },
  {
    id: "what-is-a-firewall",
    num: "02",
    title: "What is a Firewall",
    icon: Flame,
    accent: "#EA580C",
    accentText: "text-orange-600",
    accentBg: "bg-orange-50",
    iconBg: "bg-orange-100",
    accentDot: "bg-orange-500",
    accentBorder: "border-orange-200",
    calloutLabel: "Core Concept",
    callout:
      "A firewall is the first line of defense for any network — it decides what gets in and what gets blocked before traffic ever reaches your systems.",
    body: [
      "A firewall is a network security system that monitors and controls traffic entering or leaving a network.",
      "It acts as a protective filter that blocks unauthorized connections while allowing legitimate communication.",
    ],
    bullets: [
      "Inbound traffic control",
      "Unauthorized connection blocking",
      "Rule-based filtering",
      "Network boundary enforcement",
    ],
  },
  {
    id: "types-of-cyber-attacks",
    num: "03",
    title: "Types of Cyber Attacks",
    icon: Swords,
    accent: "#D97706",
    accentText: "text-amber-600",
    accentBg: "bg-amber-50",
    iconBg: "bg-amber-100",
    accentDot: "bg-amber-500",
    accentBorder: "border-amber-200",
    calloutLabel: "Threat Landscape",
    callout:
      "No two attacks look the same — understanding the full range of attack types is the foundation of any effective defense strategy.",
    body: [
      "Cyber attacks come in many forms including malware infections, phishing scams, ransomware attacks, denial-of-service attacks, and credential theft.",
      "Understanding these threats helps organizations implement effective defenses.",
    ],
    bullets: [
      "Malware & ransomware",
      "Phishing & social engineering",
      "Denial-of-service attacks",
      "Credential theft",
    ],
  },
  {
    id: "zero-day-attacks",
    num: "04",
    title: "Zero Day Attacks Explained",
    icon: ZapOff,
    accent: "#0284C7",
    accentText: "text-sky-600",
    accentBg: "bg-sky-50",
    iconBg: "bg-sky-100",
    accentDot: "bg-sky-500",
    accentBorder: "border-sky-200",
    calloutLabel: "Why It's Dangerous",
    callout:
      "A zero day exploit is unknown to the software vendor — there's no patch available, meaning every system running that software is exposed.",
    body: [
      "A zero day vulnerability is a security flaw that is unknown to the software developer.",
      "Attackers exploit these vulnerabilities before security patches are available.",
      "Zero day attacks are particularly dangerous because systems may remain vulnerable for extended periods.",
    ],
    bullets: [
      "Unknown software flaws",
      "No patch available at time of attack",
      "Extended exposure window",
      "Behavioral detection as defense",
    ],
  },
  {
    id: "how-hackers-scan",
    num: "05",
    title: "How Hackers Scan the Internet",
    icon: ScanSearch,
    accent: "#059669",
    accentText: "text-emerald-600",
    accentBg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    accentDot: "bg-emerald-500",
    accentBorder: "border-emerald-200",
    calloutLabel: "Always On",
    callout:
      "Automated scanners probe every public IP address on the internet continuously — your server was likely scanned within minutes of going online.",
    body: [
      "Cyber attackers use automated scanning tools to search the internet for vulnerable systems.",
      "These tools probe servers for open ports, outdated software, and exposed services.",
      "Once a vulnerability is identified, attackers may attempt to exploit it automatically.",
    ],
    bullets: [
      "Automated port scanning",
      "Outdated software detection",
      "Exposed service discovery",
      "Immediate exploit attempts",
    ],
  },
];

export const OTHER_TOPICS = [
  { label: "Website Security", href: "/security-academy/website-security" },
  { label: "Malware Protection", href: "/security-academy/malware-protection" },
  { label: "Ransomware Defense", href: "/security-academy/ransomware-defense" },
  { label: "Server Security", href: "/security-academy/server-security" },
  { label: "Spam Protection", href: "/security-academy/spam-protection" },
];
