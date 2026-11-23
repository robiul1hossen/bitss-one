import Blog from "@/components/pages/blog/Blog";

export const metadata = {
  title: "Cybersecurity Blog | Threat Insights, Guides & Security News",
  description:
    "Read the latest from BITSS: practical cybersecurity guides, threat insights and security updates covering Web2, Web3, endpoints, malware and ransomware.",
  openGraph: {
    title: "BITSS Blog | Cybersecurity Insights & Updates",
    description:
      "Stay ahead of attackers with security guides, threat insights and updates from the BITSS team.",
    url: "https://bitss.one/blogs",
    siteName: "Bitss Security Solutions",
    type: "website",
  },
  alternates: {
    canonical: "https://bitss.one/blogs",
  },
};

export default function BlogsPage() {
  return <Blog />;
}
