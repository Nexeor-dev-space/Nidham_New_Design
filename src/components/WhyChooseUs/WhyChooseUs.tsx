"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { useIsDesktop } from "./useIsDesktop";
import { WHY_CHOOSE_US_FEATURES, WHY_CHOOSE_US_TITLE } from "./constants";
import type { WhyChooseUsProps } from "./types";

/** Shared premium easing — matches the rest of the site. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Entrance runs once, slightly before the block is fully on screen. */
const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

export default function WhyChooseUs({
  title = WHY_CHOOSE_US_TITLE,
  features = WHY_CHOOSE_US_FEATURES,
}: WhyChooseUsProps) {
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();

  // Which card is expanded. `null` when none is hovered/focused.
  const [activeId, setActiveId] = useState<string | null>(null);

  const words = title.split(" ");

  // Heading: each word masked and lifted, staggered.
  const headingV: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const wordV: Variants = {
    hidden: { y: reduce ? 0 : "115%" },
    show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
  };

  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="w-full bg-[#F1F0EE] section-y font-[family-name:var(--font-geist-sans)]"
    >
      <div className="container-page">
        {/* Heading — split-word reveal, top-left. */}
        <motion.h2
          id="why-choose-us-heading"
          variants={headingV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="flex flex-wrap gap-x-[0.3em] text-[clamp(2.4rem,5.4vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-neutral-900"
        >
          {words.map((word, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={wordV} className="block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Cards ------------------------------------------------------------ */}
        <ul className="mt-12 flex flex-col items-stretch gap-8 sm:mt-14 lg:mt-20 lg:flex-row lg:gap-5 xl:gap-6">
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
