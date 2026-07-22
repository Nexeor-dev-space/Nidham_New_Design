import type { Metadata } from "next";
import EventsHero from "@/src/components/EventsPage/EventsHero";
import FeaturedEvents from "@/src/components/EventsPage/FeaturedEvents";
import EventCategories from "@/src/components/EventsPage/EventCategories";
import EventsTimeline from "@/src/components/EventsPage/EventsTimeline";
import EventsGallery from "@/src/components/EventsPage/EventsGallery";
import EventStats from "@/src/components/EventsPage/EventStats";
import Testimonials from "@/src/components/EventsPage/Testimonials";
import EventsCTA from "@/src/components/EventsPage/EventsCTA";

export const metadata: Metadata = {
  title: "Events | Nidham Consultancy",
  description:
    "Corporate summits, festivals, brand activations, launches and private experiences — Nidham Consultancy conceives, produces and delivers events across the UAE and beyond.",
};

/**
 * /events — an immersive, editorial events experience. The root layout supplies
 * the shared chrome (ParticleField, Footer, FloatingNav); this page composes the
 * cinematic hero (which carries the Navbar + nav sentinel) and the eight
 * scroll-choreographed sections, all on the homepage design system.
 */
export default function EventsPage() {
  return (
    <>
      <EventsHero />
      <FeaturedEvents />
      <EventCategories />
      <EventsTimeline />
      <EventsGallery />
      <EventStats />
      <Testimonials />
      <EventsCTA />
    </>
  );
}
