import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * `qualities` is an allow-list, not a hint: the optimizer answers any
     * `quality` outside it with a 400 and the image fails to render — it does
     * not quietly fall back to the default. Next 16 defaults this to `[75]`,
     * so the components below were requesting a quality the server refused.
     *
     * Keep this in step with every `quality={…}` passed to next/image:
     *   85 — EventsPage/GalleryItem
     *   90 — Events/EventCard, Events/CorporateEvents, Services/ServiceChapter
     *
     * Adding a new value here costs nothing; passing one that is missing breaks
     * the image outright, and only at request time — the build stays green.
     */
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
