"use client";

import { useEffect, useState } from "react";

export type GardenView = "topic" | "date";

const KEY = "garden_view";

/** Whether the essays and notes lists are grouped by topic (the default) or by date. Remembered in the browser. */
export function useGardenView() {
  const [view, setView] = useState<GardenView>("topic");

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "date") setView("date");
    } catch {}
  }, []);

  const change = (next: GardenView) => {
    setView(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };

  return [view, change] as const;
}

const OPTIONS: { value: GardenView; label: string }[] = [
  { value: "topic", label: "By topic" },
  { value: "date", label: "By date" },
];

export function GardenViewToggle({ view, onChange }: { view: GardenView; onChange: (view: GardenView) => void }) {
  return (
    <div role="group" aria-label="Arrange posts" className="inline-flex rounded-full border border-border bg-muted p-0.5 font-mono text-xs">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-2.5 py-0.5 transition-colors ${
            view === option.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
