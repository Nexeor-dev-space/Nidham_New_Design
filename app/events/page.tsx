import type { Metadata } from "next";
import EventsHero from "@/src/components/EventsPage/EventsHero";
import EventsPortfolio from "@/src/components/EventsPage/EventsPortfolio";

export const metadata: Metadata = {
  title: "Events | Nidham Consultancy",
  description:
    "An editorial portfolio of Nidham Consultancy's event work — corporate summits, entertainment, celebrity, government, luxury, sports, exhibitions and festivals across the UAE and beyond.",
};

/**
 * /events — a premium, agency-portfolio experience: a cinematic hero followed by
 * a sticky, text-only category filter and an editorial masonry gallery that
 * filters live with GSAP-choreographed transitions (no cards, no reload). The
 * root layout supplies the shared chrome (ParticleField, Footer, FloatingNav);
 * this page only composes the hero (which carries the Navbar + nav sentinel) and
 * the filtering portfolio.
 */
export default function EventsPage() {
  return (
    <>
      <EventsHero />
      <EventsPortfolio />
    </>
  );
}
