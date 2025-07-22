import type { Metadata, Viewport } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["700"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2772f5",
};

export const metadata: Metadata = {
  title: "DexFlora",
  description:
    "A simple, browser-based platform for interacting with blockchain JSON-RPC endpoints, complete with a suite of additional tools to enhance your development and testing experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dm_sans.variable} ${poppins.variable} antialiased`}>
        <div className=" max-w-[1284px] mx-auto overflow-hidden">
          <Header />
          <div className="overflow-y-auto mt-[75px]">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
