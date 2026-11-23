import WhyBitssPage from "@/components/pages/whyBitssPage/WhyBitssPage";

export const metadata = {
  title: "Why BITSS | Built In-House, Managed by Our Own Team",
  description:
    "BITSS builds its own security system from scratch: no third-party tools, no VPN, and 10 layers of protection against SQL injection, malware, rootkits and more.",
  openGraph: {
    title: "Why BITSS | We Don't Follow. Others Follow Us.",
    description:
      "Custom-built security, continuously updated and managed by our own team. See what makes BITSS different from off-the-shelf tools.",
    url: "https://bitss.one/why-bitss",
    siteName: "Bitss Security Solutions",
    type: "website",
  },
  alternates: {
    canonical: "https://bitss.one/why-bitss",
  },
};

export default function WhyBitss() {
  return <WhyBitssPage />;
}
