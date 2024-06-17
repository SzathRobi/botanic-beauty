import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Botanic Beauty",
  description:
    "Lépj be a fenntartható és egyéni hajápolás világába a Botanic Beauty-nál! A természet és az egyéniséged ihlette fodrászat Újpesten.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // TODO / medium: szövegek átnézése
    // TODO / medium: i18n
    // TODO / high: SEO
    // TODO / low: console.log gyilok
    <html lang="hu">
      <body className={`${inter.className}`}>
        <Header />
        <Toaster />
        <div className="fixed top-0 left-0 -z-10 object-cover w-screen h-screen">
          <Image alt="" src="/site-bg.png" fill className="object-cover" />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
