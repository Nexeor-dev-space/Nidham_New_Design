import type { Metadata } from "next";
import "./globals.css";
import { cabinet, switzer } from "@/src/lib/fonts";
import Footer from "@/src/components/Footer/Footer";
import FloatingNav from "@/src/components/FloatingNav/FloatingNav";
import ParticleField from "@/src/components/ParticleField/ParticleField";

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
  // Both font variables are declared once here, at the root, so every
  // descendant can reference var(--font-cabinet) / var(--font-switzer).
  // Switzer is the default via `body`; Cabinet is opted into by the
  // display-type tokens in src/lib/typography.ts.
  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${switzer.variable} h-full antialiased`}
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
