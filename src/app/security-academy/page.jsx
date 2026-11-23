import SecurityAcademy from "@/components/pages/securityAcademy/SecurityAcademy";

export const metadata = {
  title: "Security Academy | Free Cybersecurity Guides for Business Owners",
  description:
    "Free cybersecurity guides for business owners. 30 articles on website security, malware, ransomware, server protection, spam bots and security basics.",
  openGraph: {
    title: "BITSS Security Academy | Free Cybersecurity Guides",
    description:
      "Practical, free guides covering every attack surface, from website login pages to server infrastructure.",
    url: "https://bitss.one/security-academy",
    siteName: "Bitss Security Solutions",
    type: "website",
  },
  alternates: {
    canonical: "https://bitss.one/security-academy",
  },
};

export default function SecurityAcademyPage() {
  return <SecurityAcademy />;
}
