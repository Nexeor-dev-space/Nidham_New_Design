"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { useIsDesktop } from "./useIsDesktop";
import { WHY_CHOOSE_US_FEATURES, WHY_CHOOSE_US_TITLE } from "./constants";
import type { WhyChooseUsProps } from "./types";
import { SECTION_HEADING } from "@/src/lib/typography";
import { EASE, VIEWPORT } from "@/src/lib/motion";

export default function WhyChooseUs({
  title = WHY_CHOOSE_US_TITLE,
  features = WHY_CHOOSE_US_FEATURES,
}: WhyChooseUsProps) {
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();

  // Which card is expanded. `null` when none is hovered/focused.
  const [activeId, setActiveId] = useState<string | null>(null);

  // Heading: fade up as a single block (unified section-heading motion).
  const headingV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE, delay: 0.15 },
    },
  };

  return (
    <section
      id="service"
      aria-labelledby="why-choose-us-heading"
      data-particles="services"
      className="w-full bg-[#F1F0EE] section-y"
    >
      <div className="container-page">
        {/* Heading — unified section-heading system. */}
        <motion.h2
          id="why-choose-us-heading"
          variants={headingV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={SECTION_HEADING}
        >
          {title}
        </motion.h2>

        {/* Cards ------------------------------------------------------------ */}
        <ul className="mt-14 flex flex-col items-stretch gap-8 sm:mt-16 lg:mt-20 lg:flex-row lg:gap-5 xl:gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isActive={activeId === feature.id}
              isAnyActive={activeId !== null}
              isDesktop={isDesktop}
              reduce={reduce}
              onActivate={() => setActiveId(feature.id)}
              onDeactivate={() =>
                setActiveId((current) =>
                  current === feature.id ? null : current,
                )
              }
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
