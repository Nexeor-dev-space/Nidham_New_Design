import Hero from "@/src/components/Hero/Hero";
import PartnersSection from "@/src/components/Partners/PartnersSection";
import AboutSection from "@/src/components/About/AboutSection";
import WhyChooseUs from "@/src/components/WhyChooseUs/WhyChooseUs";
import CreativeVisionSection from "@/src/components/CreativeVision/CreativeVisionSection";

export default function Home() {
  return (
    <>
      <Hero />
      <PartnersSection />
      <AboutSection />
      <WhyChooseUs />
      <CreativeVisionSection />
    </>
  );
}
