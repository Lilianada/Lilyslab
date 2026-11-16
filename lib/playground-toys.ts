import { AudioLines, Disc3, Timer, Type } from "lucide-react";

/** The little apps in the Lab (they live under /playground). */
export const PLAYGROUND_TOYS = [
  {
    href: "/playground/transcribe",
    icon: AudioLines,
    title: "Transcriber",
    description: "Turn a video link into text (just for me, for now)",
  },
  {
    href: "/playground/burn-cd",
    icon: Disc3,
    title: "Burn CD",
    description: "Plan a mix CD: tracklist, covers and a folder ready to burn",
  },
  {
    href: "/playground/digital-clock",
    icon: Timer,
    title: "Digital Clock",
    description: "A responsive digital clock with timer functionality",
  },
  {
    href: "/playground/write",
    icon: Type,
    title: "Write Online",
    description: "A quiet place to write. Notes stay in your browser.",
  },
];
