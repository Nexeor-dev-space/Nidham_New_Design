import type { Metadata } from "next";
import MelodyDreamzPage from "@/src/components/MelodyDreamz/MelodyDreamzPage";
import {
  MD_CATEGORY,
  MD_FULL_TITLE,
  MD_LOCATION,
  MD_STORY,
} from "@/src/components/MelodyDreamz/constants";

/**
 * The description is the case study's own opening paragraph rather than a
 * hand-written summary, so the share card can never contradict the page.
 */
export const metadata: Metadata = {
  title: `${MD_FULL_TITLE} | Nidham Consultancy`,
  description: MD_STORY[0].text,
  openGraph: {
    title: `${MD_FULL_TITLE} — ${MD_CATEGORY}`,
    description: MD_STORY[0].text,
    images: [{ url: "/images/melody-dreamz/1.png" }],
  },
  other: { "event:location": MD_LOCATION },
};

export default function Page() {
  return <MelodyDreamzPage />;
}
