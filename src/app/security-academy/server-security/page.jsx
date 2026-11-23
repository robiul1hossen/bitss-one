import ServerSecurity from "@/components/pages/securityAcademy/serverSecurity/ServerSecurity";

export const metadata = {
  title: "Server Security Guide | Firewall, SSH, DNS & Linux Hardening",
  description:
    "Lock down your server infrastructure. Learn how server firewalls, SSH protection, DNS attack prevention, intrusion detection and Linux hardening work.",
  openGraph: {
    title: "Server Security Guide | BITSS Security Academy",
    description:
      "From firewalls and SSH hardening to DNS protection and intrusion detection: everything you need to secure your server infrastructure.",
    url: "https://bitss.one/security-academy/server-security",
    siteName: "Bitss Security Solutions",
    type: "article",
  },
  alternates: {
    canonical: "https://bitss.one/security-academy/server-security",
  },
};

export default function ServerSecurityPage() {
  return <ServerSecurity />;
}
