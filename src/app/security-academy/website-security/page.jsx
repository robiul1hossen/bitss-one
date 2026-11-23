import WebsiteSecurity from "@/components/pages/securityAcademy/websiteSecurity/WebsiteSecurity";

export const metadata = {
  title: "Website Security Guide | Protect Logins, Admin Pages & WordPress",
  description:
    "Learn how hackers break into websites and how to stop them. Brute force protection, admin login security, web application firewalls and WordPress hardening.",
  openGraph: {
    title: "Website Security Guide | BITSS Security Academy",
    description:
      "From login pages to server-side firewalls: a practical guide to securing your website against bots, brute force attacks and malware.",
    url: "https://bitss.one/security-academy/website-security",
    siteName: "Bitss Security Solutions",
    type: "article",
  },
  alternates: {
    canonical: "https://bitss.one/security-academy/website-security",
  },
};

export default function WebsiteSecurityPage() {
  return <WebsiteSecurity />;
}
