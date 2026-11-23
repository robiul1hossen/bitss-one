import InvoiceCredentials from "@/components/dashboard/InvoiceCredentials";

export default async function CredentialDetails({ params }) {
  const { invoiceId } = await params;

  return <InvoiceCredentials invoiceId={invoiceId} />;
}
