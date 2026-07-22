import type { Metadata } from "next";
import ServicesHero from "@/src/components/Services/ServicesHero";
import ServicesList from "@/src/components/Services/ServicesList";

export const metadata: Metadata = {
  title: "Services | Nidham Consultancy",
  description:
    "Event management, artist & influencer management, and branding solutions — from corporate events and live concerts to influencer collaborations and PR.",
};

/**
 * /services — a premium editorial services experience. The root layout already
 * supplies the shared chrome (ParticleField, Footer, FloatingNav), so this page
 * only composes the hero (which carries the Navbar + nav sentinel) and the
 * editorial list, keeping the homepage design system intact.
 */
export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
    </>
  );
}
