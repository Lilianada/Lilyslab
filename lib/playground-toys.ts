import { AudioLines, Calculator, Gamepad2, Pencil, Sparkles, Terminal, Timer } from "lucide-react";

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
    href: "/playground/animation-lab",
    icon: Sparkles,
    title: "Animation Lab",
    description: "Play with easing curves and steal the CSS",
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
    href: "/playground/terminal",
    icon: Terminal,
    title: "Terminal Notes",
    description: "A simple note-taking terminal that remembers what you wrote",
  },
];
