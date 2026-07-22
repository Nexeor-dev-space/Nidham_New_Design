import type { Metadata } from "next";
import ContactHero from "@/src/components/ContactPage/ContactHero";
import ContactInfo from "@/src/components/ContactPage/ContactInfo";
import ContactForm from "@/src/components/ContactPage/ContactForm";
import ContactMap from "@/src/components/ContactPage/ContactMap";
import WhyContactUs from "@/src/components/ContactPage/WhyContactUs";
import ContactCTA from "@/src/components/ContactPage/ContactCTA";

export const metadata: Metadata = {
  title: "Contact | Nidham Consultancy",
  description:
    "Get in touch with Nidham Consultancy to plan your next event, activation or experience. Call +971 50 112 6058 or email hello@nidham.ae.",
};

/**
 * /contact — a premium, editorial contact experience. The root layout supplies
 * the shared chrome (ParticleField, Footer, FloatingNav); this page composes the
 * cinematic hero (which carries the Navbar + nav sentinel), the editorial detail
 * blocks, the form, the map, the reasons and the closing CTA — all on the
 * homepage design system.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
      <WhyContactUs />
      <ContactCTA />
    </>
  );
}
