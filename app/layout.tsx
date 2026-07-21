import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/src/components/Footer/Footer";
import FloatingNav from "@/src/components/FloatingNav/FloatingNav";
import ParticleField from "@/src/components/ParticleField/ParticleField";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nidham Consultancy | Creative Vision",
  description:
    "A Strategic Studio for Technology, Entertainment & Media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ParticleField />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingNav />
      </body>
    </html>
  );
}
