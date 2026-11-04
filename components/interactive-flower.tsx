"use client";

import { useEffect, useState } from "react";
import { burstPetals } from "@/components/fun/FunLayer";
import { readFromLocalStorage, writeToLocalStorage } from "@/hooks/use-local-storage";

const STORAGE_KEY = "garden_patch";
const WATERINGS_TO_BLOOM = 5;
const MAX_VISIBLE_BLOOMS = 28;
const PETAL_COLORS = ["#E8ADB1", "#CCA7ED", "#9EAAFA", "#FAE680", "#F29874", "#F4DAA0"];
const CAPTIONS = [
  "A seed, full of potential and not much else.",
  "Something stirred. Probably.",
  "A sprout! Look at you go.",
  "Leaves. It's really committing now.",
  "A bud. Any minute...",
  "It bloomed. You did that.",
];

interface Patch {
  water: number;
  color: string;
  blooms: string[];
}

const randomColor = () => PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];

const Petals = ({ color, open = 1 }: { color: string; open?: number }) => (
  <g style={{ transform: `scale(${open})`, transformOrigin: "60px 44px", transition: "transform 0.7s cubic-bezier(.34,1.56,.64,1)" }}>
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <ellipse key={angle} cx="60" cy="27" rx="8" ry="17" fill={color} transform={`rotate(${angle} 60 44)`} />
    ))}
    <circle cx="60" cy="44" r="6" fill="#FAE680" stroke="#F29874" strokeWidth="1" />
  </g>
);

export function InteractiveFlower() {
  const [patch, setPatch] = useState<Patch | null>(null);
  const [dropKey, setDropKey] = useState(0);

  // localStorage only exists in the browser, so this fills in after hydration.
  useEffect(() => {
    setPatch(readFromLocalStorage<Patch>(STORAGE_KEY, { water: 0, color: randomColor(), blooms: [] }));
  }, []);

  const save = (next: Patch) => {
    setPatch(next);
    writeToLocalStorage(STORAGE_KEY, next);
  };

  const water = patch?.water ?? 0;
  const color = patch?.color ?? PETAL_COLORS[0];
  const blooms = patch?.blooms ?? [];
  const hasBloomed = water >= WATERINGS_TO_BLOOM;
  const stemTop = 112 - Math.min(water, 4) * 15;

  const handleClick = () => {
    if (!patch) return;
    if (hasBloomed) {
      setDropKey(0);
      save({ water: 0, color: randomColor(), blooms: [...blooms, color] });
      return;
    }
    setDropKey((key) => key + 1);
    save({ ...patch, water: water + 1 });
    if (water + 1 === WATERINGS_TO_BLOOM) burstPetals();
  };

  return (
    <div className="border border-dashed border-muted-foreground/40 rounded-md p-4">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 130" className="w-24 h-28 flex-shrink-0 overflow-visible" role="img" aria-label={CAPTIONS[water]}>
          {dropKey > 0 && !hasBloomed && (
            <ellipse
              key={dropKey}
              cx="60"
              cy="10"
              rx="3"
              ry="5"
              fill="#9EAAFA"
              style={{ animation: "waterDrop 0.7s ease-in forwards" }}
            />
          )}
          <g className={water > 0 ? "flower-sway" : undefined}>
            {water > 0 && (
              <line
                x1="60"
                y1="114"
                x2="60"
                y2={stemTop}
                stroke="#88BF94"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ transition: "all 0.6s ease-out" }}
              />
            )}
            {water >= 3 && (
              <>
                <ellipse cx="46" cy="92" rx="13" ry="5" fill="#88BF94" transform="rotate(25 46 92)" />
                <ellipse cx="74" cy="84" rx="13" ry="5" fill="#88BF94" transform="rotate(-25 74 84)" />
              </>
            )}
            {water === 4 && <ellipse cx="60" cy="48" rx="7" ry="11" fill={color} />}
            {hasBloomed && <Petals color={color} />}
          </g>
          <ellipse cx="60" cy="118" rx="38" ry="8" fill="#8a6a4f" />
          {water === 0 && <ellipse cx="60" cy="112" rx="5" ry="3.5" fill="#5d4532" />}
        </svg>

        <div className="min-w-0">
          <p className="text-xs mb-3 min-h-8" aria-live="polite">
            {patch ? CAPTIONS[water] : "Tilling the soil..."}
          </p>
          <button
            type="button"
            onClick={handleClick}
            disabled={!patch}
            className="hover-wiggle text-xs px-3 py-1.5 rounded-md border border-dashed border-codeRed text-codeRed hover:bg-accent transition-colors disabled:opacity-50"
          >
            {hasBloomed ? "Plant it & start another" : "Water it"}
          </button>
        </div>
      </div>

      {blooms.length > 0 && (
        <div className="mt-4 pt-3 border-t border-dashed">
          <div className="flex flex-wrap gap-0.5" aria-hidden="true">
            {blooms.slice(-MAX_VISIBLE_BLOOMS).map((bloomColor, index) => (
              <svg key={index} viewBox="30 10 60 68" className="w-6 h-6 transition-transform hover:scale-150 hover:-rotate-12">
                <Petals color={bloomColor} />
              </svg>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {blooms.length} {blooms.length === 1 ? "flower" : "flowers"} planted by you. The garden is better for it.
          </p>
        </div>
      )}
    </div>
  );
}
