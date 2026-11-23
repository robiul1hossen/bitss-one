import SecurityBasics from "@/components/pages/securityAcademy/securityBasics/SecurityBasics";

export const metadata = {
  title: "Cybersecurity Basics | Firewalls, Attacks & Zero-Day Threats",
  description:
    "New to cybersecurity? Learn what it means, how firewalls work, the main types of cyber attacks, zero-day exploits and how hackers scan the internet for targets.",
  openGraph: {
    title: "Cybersecurity Basics | BITSS Security Academy",
    description:
      "The essential concepts every business owner should understand, from what cybersecurity actually means to how attackers find their targets.",
    url: "https://bitss.one/security-academy/security-basics",
    siteName: "Bitss Security Solutions",
    type: "article",
  },
  alternates: {
    canonical: "https://bitss.one/security-academy/security-basics",
  },
};

export default function SecurityBasicsPage() {
  return <SecurityBasics />;
}
