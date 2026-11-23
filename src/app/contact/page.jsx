import Banner from "@/components/pages/contact/Banner";
import ContactForm from "@/components/pages/contact/ContactForm";

export const metadata = {
  title: "Contact BITSS | Request a Demo or Talk to a Security Expert",
  description:
    "Get in touch with BITSS. Request a free demo, get a custom quote for your organization, or talk to our security experts. Support available 24/7, 365 days.",
  openGraph: {
    title: "Contact BITSS | Talk to a Security Expert",
    description:
      "Request a free demo or a custom quote and see BITSS protect your website, endpoints and blockchain assets. Our team is available 24/7.",
    url: "https://bitss.one/contact",
    siteName: "Bitss Security Solutions",
    type: "website",
  },
  alternates: {
    canonical: "https://bitss.one/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Banner />
      <ContactForm />
    </>
  );
}
