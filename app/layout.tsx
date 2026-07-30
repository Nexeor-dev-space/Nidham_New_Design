import type { Metadata } from "next";
import "./globals.css";
import { begies, cabinet, switzer, urbanist } from "@/src/lib/fonts";
import Footer from "@/src/components/Footer/Footer";
import FloatingNav from "@/src/components/FloatingNav/FloatingNav";
import ParticleField from "@/src/components/ParticleField/ParticleField";
import SmoothScroll from "@/src/components/SmoothScroll/SmoothScroll";

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
  // Every font variable is declared once here, at the root, so any descendant
  // can reference var(--font-cabinet) / var(--font-switzer) /
  // var(--font-urbanist) / var(--font-begies). Switzer is the default via
  // `body`; the rest are opted into by the display-type tokens in
  // src/lib/typography.ts.
  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${switzer.variable} ${urbanist.variable} ${begies.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <ParticleField />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingNav />
      </body>
    </html>
  );
}
