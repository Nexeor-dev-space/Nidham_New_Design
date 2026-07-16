import Hero from "@/src/components/Hero/Hero";
import PartnersSection from "@/src/components/Partners/PartnersSection";
import AboutSection from "@/src/components/About/AboutSection";
import WhyChooseUs from "@/src/components/WhyChooseUs/WhyChooseUs";
import CorporateEvents from "@/src/components/Events/CorporateEvents";
import EventsGallery from "@/src/components/Events/EventsGallery";
import CreativeVisionSection from "@/src/components/CreativeVision/CreativeVisionSection";

export default function Home() {
  return (
    <>
      <Hero />
      <PartnersSection />
      <AboutSection />
      <WhyChooseUs />
      <CorporateEvents />
      <EventsGallery />
      <CreativeVisionSection />
    </>
  );
}
