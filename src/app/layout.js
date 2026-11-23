import { TanstackProvider } from "@/context/TanstackProvider";
import TopBar from "@/components/shared/Topbar";
import Footer from "@/components/shared/footer/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/shared/navbar/Navbar";

export const metadata = {
  title: "Bitss Security Solutions",
  description:
    "Enterprise cybersecurity for Web2 and Web3. Protect your website, endpoints, wallets, and blockchain assets with BITSS — one ecosystem, full chain.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-poppins antialiased" suppressHydrationWarning>
        <TanstackProvider>
          <TopBar />
          <Navbar />

          <main className="bg-white text-slate-900 min-h-screen">
            {children}
            <Toaster />
          </main>
          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
