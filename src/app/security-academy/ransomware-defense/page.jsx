import RansomwareDefense from "@/components/pages/securityAcademy/ransomwareDefense/RansomwareDefense";

export const metadata = {
  title: "Ransomware Defense Guide | Prevent, Contain & Recover",
  description:
    "Learn how ransomware enters your systems, how it spreads across your network, and the prevention strategies your business needs to stop and survive an attack.",
  openGraph: {
    title: "Ransomware Defense Guide | BITSS Security Academy",
    description:
      "Understand how ransomware attacks work and spreads, and how backups, endpoint protection and incident response protect your business.",
    url: "https://bitss.one/security-academy/ransomware-defense",
    siteName: "Bitss Security Solutions",
    type: "article",
  },
  alternates: {
    canonical: "https://bitss.one/security-academy/ransomware-defense",
  },
};

export default function RansomwareDefensePage() {
  return <RansomwareDefense />;
}
