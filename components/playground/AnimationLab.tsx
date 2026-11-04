"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Play } from "lucide-react";
import { toast } from "sonner";

type Curve = [number, number, number, number];

const PRESETS: { name: string; curve: Curve }[] = [
  { name: "linear", curve: [0, 0, 1, 1] },
  { name: "ease", curve: [0.25, 0.1, 0.25, 1] },
  { name: "ease-in", curve: [0.42, 0, 1, 1] },
  { name: "ease-out", curve: [0, 0, 0.58, 1] },
  { name: "boing", curve: [0.34, 1.56, 0.64, 1] },
  { name: "wind-up", curve: [0.6, -0.5, 0.74, 0.05] },
  { name: "drama", curve: [0.87, 0, 0.13, 1] },
];

const MOTIONS: { name: string; keyframes: Keyframe[] }[] = [
  {
    name: "Hop",
    keyframes: [{ transform: "translateX(calc(-1 * min(34vmin, 240px)))" }, { transform: "translateX(min(34vmin, 240px))" }],
  },
  { name: "Bloom", keyframes: [{ transform: "scale(0.3)" }, { transform: "scale(1.3)" }] },
  { name: "Spin", keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }] },
  {
    name: "Wilt",
    keyframes: [
      { transform: "rotate(0deg) translateY(0)", opacity: 1 },
      { transform: "rotate(70deg) translateY(16px)", opacity: 0.35 },
    ],
  },
];

const SLIDERS = [
  { label: "x1", index: 0, min: 0, max: 1 },
  { label: "y1", index: 1, min: -1, max: 2 },
  { label: "x2", index: 2, min: 0, max: 1 },
  { label: "y2", index: 3, min: -1, max: 2 },
] as const;

export function AnimationLab() {
  const [curve, setCurve] = useState<Curve>([0.34, 1.56, 0.64, 1]);
  const [duration, setDuration] = useState(900);
  const [motionName, setMotionName] = useState("Hop");
  const flowerRef = useRef<HTMLDivElement>(null);
  const motion = MOTIONS.find(({ name }) => name === motionName) ?? MOTIONS[0];
  const easing = `cubic-bezier(${curve.map((value) => Number(value.toFixed(2))).join(", ")})`;

  const play = () => {
    const flower = flowerRef.current;
    if (!flower) return;
    flower.getAnimations().forEach((animation) => animation.cancel());
    flower.animate(motion.keyframes, { duration, easing, fill: "both", direction: "alternate", iterations: 2 });
  };

  // Replay whenever something changes, so sliders feel live.
  const playRef = useRef(play);
  playRef.current = play;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => playRef.current(), 120);
    return () => clearTimeout(timer);
  }, [curve, duration, motionName]);

  const setPoint = (index: number, value: number) => {
    setCurve((current) => {
      const next = [...current] as Curve;
      next[index] = value;
      return next;
    });
  };

  // The graph spans y from -1 to 2, so curves can overshoot without clipping.
  const graphX = (x: number) => x * 100;
  const graphY = (y: number) => 100 - ((y + 1) / 3) * 100;
  const css = `transition: transform ${duration}ms ${easing};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(css);
      toast.success("CSS copied. Go make something bouncy.");
    } catch {
      toast.error("Your browser wouldn't let me copy that");
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative h-28 border border-dashed rounded-md flex items-center justify-center overflow-hidden">
        <div ref={flowerRef} aria-hidden="true">
          <svg viewBox="30 10 60 68" className="w-14 h-14">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse key={angle} cx="60" cy="27" rx="8" ry="17" fill="#CCA7ED" transform={`rotate(${angle} 60 44)`} />
            ))}
            <circle cx="60" cy="44" r="6" fill="#FAE680" stroke="#F29874" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {MOTIONS.map(({ name }) => (
          <button
            key={name}
            type="button"
            onClick={() => setMotionName(name)}
            aria-pressed={name === motionName}
            className={`rounded-md border px-3 py-1.5 text-xs transition-colors hover:bg-accent ${
              name === motionName ? "bg-accent font-medium" : "text-muted-foreground"
            }`}
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          onClick={play}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-dashed border-codeRed px-3 py-1.5 text-xs text-codeRed hover:bg-accent"
        >
          <Play size={12} /> Replay
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <svg viewBox="0 0 100 100" className="w-full aspect-square border rounded-md bg-card" role="img" aria-label={`Easing curve ${easing}`}>
          <line x1="0" y1={graphY(0)} x2="100" y2={graphY(0)} stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
          <line x1="0" y1={graphY(1)} x2="100" y2={graphY(1)} stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
          <line x1={graphX(0)} y1={graphY(0)} x2={graphX(curve[0])} y2={graphY(curve[1])} stroke="#F29874" strokeWidth="0.75" />
          <line x1={graphX(1)} y1={graphY(1)} x2={graphX(curve[2])} y2={graphY(curve[3])} stroke="#9EAAFA" strokeWidth="0.75" />
          <path
            d={`M ${graphX(0)} ${graphY(0)} C ${graphX(curve[0])} ${graphY(curve[1])}, ${graphX(curve[2])} ${graphY(curve[3])}, ${graphX(1)} ${graphY(1)}`}
            fill="none"
            stroke="#CCA7ED"
            strokeWidth="1.75"
          />
          <circle cx={graphX(curve[0])} cy={graphY(curve[1])} r="2.5" fill="#F29874" />
          <circle cx={graphX(curve[2])} cy={graphY(curve[3])} r="2.5" fill="#9EAAFA" />
        </svg>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(({ name, curve: preset }) => (
              <button
                key={name}
                type="button"
                onClick={() => setCurve(preset)}
                className="rounded-full border px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {name}
              </button>
            ))}
          </div>

          {SLIDERS.map(({ label, index, min, max }) => (
            <label key={label} className="flex items-center gap-2 text-xs">
              <span className="w-5">{label}</span>
              <input
                type="range"
                min={min}
                max={max}
                step={0.01}
                value={curve[index]}
                onChange={(event) => setPoint(index, Number(event.target.value))}
                className="flex-1 accent-codeRed"
              />
              <span className="w-9 text-right text-muted-foreground">{curve[index].toFixed(2)}</span>
            </label>
          ))}

          <label className="flex items-center gap-2 text-xs">
            <span className="w-5">ms</span>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="flex-1 accent-codeRed"
            />
            <span className="w-9 text-right text-muted-foreground">{duration}</span>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={copyCss}
        className="w-full flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2 text-left text-xs hover:bg-accent transition-colors"
      >
        <code className="break-all">{css}</code>
        <Copy size={12} className="flex-shrink-0" aria-label="Copy CSS" />
      </button>
    </div>
  );
}
