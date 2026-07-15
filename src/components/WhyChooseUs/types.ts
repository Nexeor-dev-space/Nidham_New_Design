/** Image shown behind a single feature card. */
export interface FeatureImage {
  /** Path (or import) to the image. */
  src: string;
  /** Accessible description — used for the image's alt text. */
  alt: string;
}

/** A single "Why Choose Us" feature card. */
export interface Feature {
  /** Stable identifier — used as the React key. */
  id: string;
  /** Card title, e.g. "Execution". */
  title: string;
  /** Description revealed on hover (desktop) / shown beneath the title (mobile). */
  description: string;
  /** Background image. */
  image: FeatureImage;
  /** Label shown inside the custom cursor on hover (e.g. "Explore"). */
  cursorLabel?: string;
  /**
   * Resting flex weight on desktop. The Figma composition is not equal thirds —
   * the middle card is wider — so each card carries its own resting weight and
   * the row reproduces those proportions. Defaults to 1 when omitted.
   */
  weight?: number;
}

/** Content-driven props for {@link WhyChooseUs}. Nothing is hardcoded. */
export interface WhyChooseUsProps {
  /** Large heading, top-left. */
  title?: string;
  /** Feature cards, rendered in order. */
  features?: readonly Feature[];
}

/** Props for a single {@link FeatureCard}. */
export interface FeatureCardProps {
  /** The feature to render. */
  feature: Feature;
  /** Position in the list — drives the entrance stagger. */
  index: number;
  /** Whether this card is the one currently hovered/focused. */
  isActive: boolean;
  /** Whether any card in the row is currently active. */
  isAnyActive: boolean;
  /** True on large viewports, where the expand interaction is enabled. */
  isDesktop: boolean;
  /** Whether the user prefers reduced motion. */
  reduce: boolean;
  /** Fired when the card should become active (hover / focus). */
  onActivate: () => void;
  /** Fired when the card should stop being active (leave / blur). */
  onDeactivate: () => void;
}
