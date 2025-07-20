import type { Metadata, Viewport } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

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
  description: "Welcome to DexFlora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dm_sans.variable} ${poppins.variable} antialiased`}>
        <div className="flex flex-col w-full h-screen max-w-[1284px] mx-auto overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
