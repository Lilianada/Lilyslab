"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Pin, RefreshCw, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import { readFromLocalStorage, writeToLocalStorage } from "@/hooks/use-local-storage";

const STORAGE_KEY = "doodle_fridge";
const MAX_FRIDGE_DOODLES = 12;
const WIDTH = 640;
const HEIGHT = 400;
const COLORS = ["#1F1A24", "#E8ADB1", "#CCA7ED", "#9EAAFA", "#88BF94", "#FAE680", "#F29874", "#E84855"];
const BRUSHES = [2, 5, 10, 18];
const PROMPTS = [
  "a frog with a job",
  "your favourite snack, but sad",
  "a flower that has seen things",
  "what the wifi looks like",
  "a very small dragon",
  "your mood, as weather",
  "a cat explaining taxes",
];

export function DoodlePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);
  const [color, setColor] = useState(COLORS[0]);
  const [brush, setBrush] = useState(BRUSHES[1]);
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [fridge, setFridge] = useState<string[]>([]);

  const context = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const clear = () => {
    const ctx = context();
    if (!ctx) return;
    ctx.fillStyle = "#FFFDF8";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  };

  useEffect(() => {
    clear();
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setFridge(readFromLocalStorage<string[]>(STORAGE_KEY, []));
  }, []);

  // Pointer coordinates are in CSS pixels, but the canvas scales to fit its column.
  const toCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  };

  const remember = () => {
    const ctx = context();
    if (!ctx) return;
    history.current = [...history.current.slice(-19), ctx.getImageData(0, 0, WIDTH, HEIGHT)];
  };

  const drawTo = (point: { x: number; y: number }) => {
    const ctx = context();
    const from = lastPoint.current;
    if (!ctx || !from) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = brush;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    remember();
    const point = toCanvasPoint(event);
    lastPoint.current = point;
    drawTo({ x: point.x + 0.01, y: point.y }); // A single tap leaves a dot.
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (lastPoint.current) drawTo(toCanvasPoint(event));
  };

  const stopDrawing = () => {
    lastPoint.current = null;
  };

  const undo = () => {
    const previous = history.current.pop();
    if (previous) context()?.putImageData(previous, 0, 0);
  };

  const startOver = () => {
    remember();
    clear();
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = canvasRef.current?.toDataURL("image/png") ?? "";
    link.download = "lilys-garden-doodle.png";
    link.click();
  };

  const saveFridge = (next: string[]) => {
    setFridge(next);
    writeToLocalStorage(STORAGE_KEY, next);
  };

  const pinToFridge = () => {
    if (!canvasRef.current) return;
    // A small JPEG, because localStorage has very little room.
    const thumbnail = document.createElement("canvas");
    thumbnail.width = 240;
    thumbnail.height = 150;
    thumbnail.getContext("2d")?.drawImage(canvasRef.current, 0, 0, 240, 150);
    saveFridge([thumbnail.toDataURL("image/jpeg", 0.7), ...fridge].slice(0, MAX_FRIDGE_DOODLES));
    toast.success("Stuck to the fridge. Very proud of you.");
  };

  return (
    <div>
      <p className="text-xs mb-3">
        Need an idea? Try <span className="text-codeRed italic">{prompt}</span>.{" "}
        <button
          type="button"
          onClick={() => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])}
          className="underline text-muted-foreground hover:text-foreground"
        >
          Another
        </button>
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
        <div className="flex gap-1.5" role="group" aria-label="Color">
          {COLORS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setColor(swatch)}
              aria-label={`Color ${swatch}`}
              aria-pressed={color === swatch}
              className={`h-6 w-6 rounded-full border transition-transform hover:scale-110 ${
                color === swatch ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : ""
              }`}
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Brush size">
          {BRUSHES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setBrush(size)}
              aria-label={`Brush size ${size}`}
              aria-pressed={brush === size}
              className={`h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent ${
                brush === size ? "bg-accent" : ""
              }`}
            >
              <span className="block rounded-full bg-foreground" style={{ width: size * 0.8 + 1, height: size * 0.8 + 1 }} />
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        aria-label="Drawing canvas"
        className="w-full rounded-md border cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
      />

      <div className="flex flex-wrap gap-2 mt-3 text-xs">
        <button type="button" onClick={undo} className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-accent">
          <Undo2 size={12} /> Undo
        </button>
        <button type="button" onClick={startOver} className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-accent">
          <RefreshCw size={12} /> Clear
        </button>
        <button type="button" onClick={download} className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-accent">
          <Download size={12} /> Download
        </button>
        <button
          type="button"
          onClick={pinToFridge}
          className="hover-wiggle ml-auto inline-flex items-center gap-1 rounded-md border border-dashed border-codeRed px-3 py-1.5 text-codeRed hover:bg-accent"
        >
          <Pin size={12} /> Stick on the fridge
        </button>
      </div>

      {fridge.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium mb-1">Your fridge</h2>
          <p className="text-xs text-muted-foreground mb-4">Only you can see this. It lives on this device.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {fridge.map((doodle, index) => (
              <div
                key={`${index}-${doodle.length}`}
                className="group relative bg-white p-1 shadow-md transition-transform hover:scale-105 hover:rotate-0"
                style={{ transform: `rotate(${((index * 37) % 7) - 3}deg)` }}
              >
                <img src={doodle} alt={`Your doodle ${index + 1}`} className="w-full" />
                <button
                  type="button"
                  onClick={() => saveFridge(fridge.filter((_, position) => position !== index))}
                  aria-label={`Take doodle ${index + 1} off the fridge`}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
