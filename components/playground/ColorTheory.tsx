"use client";

import { useMemo, useState } from "react";
import { Check, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { contrastRatio, hexToHsl, hslToHex } from "@/lib/color";

const HARMONIES = [
  { name: "Complementary", offsets: [0, 180], note: "Opposites. Loud, confident, hard to ignore." },
  { name: "Analogous", offsets: [-30, 0, 30], note: "Neighbours. Calm and easy on the eyes." },
  { name: "Triadic", offsets: [0, 120, 240], note: "Evenly spaced. Playful, a little bit circus." },
  { name: "Split", offsets: [0, 150, 210], note: "Contrast without the fight." },
  { name: "Tetradic", offsets: [0, 90, 180, 270], note: "Four colors. Bold of you. Pick one to lead." },
];

const GARDEN_COLORS = ["#E8ADB1", "#CCA7ED", "#9EAAFA", "#FAE680", "#F29874", "#88BF94", "#6C95CF"];

const copy = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${value} copied`);
  } catch {
    toast.error("Your browser wouldn't let me copy that");
  }
};

const contrastGrade = (ratio: number) => {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large only";
  return "Fails";
};

export function ColorTheory() {
  const [base, setBase] = useState("#CCA7ED");
  const [text, setText] = useState("#1F1A24");
  const hsl = useMemo(() => hexToHsl(base), [base]);

  const ratio = contrastRatio(base, text);
  const grade = contrastGrade(ratio);
  const shades = [90, 75, 60, 45, 30, 15].map((lightness) => hslToHex(hsl.h, hsl.s, lightness));

  const surprise = () => {
    setBase(hslToHex(Math.floor(Math.random() * 360), 45 + Math.random() * 45, 50 + Math.random() * 30));
  };

  return (
    <div className="space-y-10">
      <section className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-3 text-xs">
          <input
            type="color"
            value={base}
            onChange={(event) => setBase(event.target.value.toUpperCase())}
            className="h-12 w-12 cursor-pointer rounded-md border bg-transparent p-1"
          />
          <span>
            Start from
            <span className="block text-sm font-medium">{base}</span>
          </span>
        </label>
        <button
          type="button"
          onClick={surprise}
          className="hover-wiggle inline-flex items-center gap-2 rounded-md border border-dashed border-codeRed px-3 py-2 text-xs text-codeRed hover:bg-accent"
        >
          <Shuffle size={12} /> Surprise me
        </button>
        <div className="flex gap-1.5" role="group" aria-label="Garden colors">
          {GARDEN_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setBase(color)}
              aria-label={`Use ${color}`}
              className="h-6 w-6 rounded-full border transition-transform hover:scale-125"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-medium">Harmonies</h2>
        {HARMONIES.map(({ name, offsets, note }) => {
          const swatches = offsets.map((offset) => hslToHex(hsl.h + offset, hsl.s, hsl.l));
          return (
            <div key={name}>
              <div className="flex rounded-md overflow-hidden border">
                {swatches.map((swatch, index) => (
                  <button
                    key={`${swatch}-${index}`}
                    type="button"
                    onClick={() => copy(swatch)}
                    aria-label={`Copy ${swatch}`}
                    className="group flex-1 h-16 flex items-end justify-center pb-1 transition-[flex-grow] duration-300 hover:flex-[1.5]"
                    style={{ backgroundColor: swatch }}
                  >
                    <span
                      className="text-[10px] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      style={{ color: contrastRatio(swatch, "#000000") > 4.5 ? "#000" : "#fff" }}
                    >
                      {swatch}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs mt-1.5">
                <span className="font-medium">{name}.</span> <span className="text-muted-foreground">{note}</span>
              </p>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="text-sm font-medium mb-3">Light to dark</h2>
        <div className="flex rounded-md overflow-hidden border">
          {shades.map((shade) => (
            <button
              key={shade}
              type="button"
              onClick={() => copy(shade)}
              aria-label={`Copy ${shade}`}
              className="flex-1 h-10"
              style={{ backgroundColor: shade }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-3">Can people read it?</h2>
        <div className="rounded-md border p-4 mb-3 transition-colors" style={{ backgroundColor: base, color: text }}>
          <p className="text-sm" style={{ color: text }}>
            The quick brown frog hops over the lazy lily pad.
          </p>
          <p className="text-lg font-medium mt-1">Bigger words get more forgiveness.</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="color"
              value={text}
              onChange={(event) => setText(event.target.value.toUpperCase())}
              className="h-8 w-8 cursor-pointer rounded border bg-transparent p-0.5"
            />
            Text color
          </label>
          <span className="inline-flex items-center gap-1.5">
            {ratio >= 4.5 && <Check size={14} className="text-siteGreen" />}
            {ratio.toFixed(2)}:1 · WCAG {grade}
          </span>
        </div>
      </section>
    </div>
  );
}
