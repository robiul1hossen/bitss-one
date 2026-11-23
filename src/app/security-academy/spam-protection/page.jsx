import SpamProtection from "@/components/pages/securityAcademy/spamProtection/SpamProtection";

export const metadata = {
  title: "Spam Protection Guide | Stop Contact Form Spam & Bots",
  description:
    "Learn how spam bots attack your contact forms, why CAPTCHA isn't enough, and how bot detection and email filtering keep automated junk out of your inbox.",
  openGraph: {
    title: "Spam Protection Guide | BITSS Security Academy",
    description:
      "Stop contact form spam, understand CAPTCHA vs AI protection, and learn the bot detection techniques that block automated attacks.",
    url: "https://bitss.one/security-academy/spam-protection",
    siteName: "Bitss Security Solutions",
    type: "article",
  },
  alternates: {
    canonical: "https://bitss.one/security-academy/spam-protection",
  },
};

export default function SpamProtectionPage() {
  return <SpamProtection />;
}
