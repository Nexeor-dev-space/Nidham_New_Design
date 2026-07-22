import type { Metadata } from "next";
import RegisterHero from "@/src/components/RegisterPage/RegisterHero";
import WhyRegister from "@/src/components/RegisterPage/WhyRegister";
import RegisterProcess from "@/src/components/RegisterPage/RegisterProcess";
import RegisterFAQ from "@/src/components/RegisterPage/RegisterFAQ";
import RegisterCTA from "@/src/components/RegisterPage/RegisterCTA";

export const metadata: Metadata = {
  title: "Register | Nidham Consultancy",
  description:
    "Register your interest with Nidham Consultancy — join our network of artists, influencers and event partners for early access, priority invitations and exclusive experiences.",
};

/**
 * /register — a premium onboarding experience. The root layout supplies the
 * shared chrome (ParticleField, Footer, FloatingNav); this page composes the
 * editorial split hero (which carries the Navbar + nav sentinel and the
 * registration form), then the benefits, journey, FAQ and closing CTA — all on
 * the homepage design system.
 */
export default function RegisterPage() {
  return (
    <>
      <RegisterHero />
      <WhyRegister />
      <RegisterProcess />
      <RegisterFAQ />
      <RegisterCTA />
    </>
  );
}
