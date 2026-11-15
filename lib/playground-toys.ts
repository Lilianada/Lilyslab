import { AudioLines, Calculator, Disc3, Gamepad2, Pencil, Timer, Type } from "lucide-react";

/** Every playground toy, in the order the index page and the Prev/Next links use. */
export const PLAYGROUND_TOYS = [
  {
    href: "/playground/petal-catch",
    icon: Gamepad2,
    title: "Petal Catch",
    description: "Catch the falling petals, dodge the bees. Beat your best.",
  },
  {
    href: "/playground/doodle",
    icon: Pencil,
    title: "Doodle Pad",
    description: "Draw something silly and stick it on your fridge",
  },
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
    href: "/playground/calculator",
    icon: Calculator,
    title: "Calculator",
    description: "A simple calculator with basic arithmetic operations",
  },
  {
    href: "/playground/write",
    icon: Type,
    title: "Write Online",
    description: "A quiet place to write. Notes stay in your browser.",
  },
];
