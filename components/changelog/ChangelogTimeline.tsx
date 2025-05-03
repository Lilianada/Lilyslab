'use client'

import React, { useState } from "react";
import { format } from "date-fns";

// Example changelog data type
export type ChangelogEntry = {
  version: string;
  title: string;
  date: string;
  type: "feature" | "improvement" | "fix" | "breaking";
  body: string;
  category: string;
};

const typeColors: Record<ChangelogEntry["type"], string> = {
  feature: "bg-green-100 text-green-700 border-green-300",
  improvement: "bg-blue-100 text-blue-700 border-blue-300",
  fix: "bg-yellow-100 text-yellow-700 border-yellow-300",
  breaking: "bg-red-100 text-red-700 border-red-300",
};

function getExcerpt(text: string, length = 120) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export default function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = filterType === "all"
    ? entries
    : entries.filter(e => e.type === filterType);

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-8 flex flex-wrap gap-2 items-center">
        <span className="font-mono text-xs">Filter:</span>
        <button
          className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${filterType === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:bg-accent"}`}
          onClick={() => setFilterType("all")}
        >
          All
        </button>
        {Object.entries(typeColors).map(([type, color]) => (
          <button
            key={type}
            className={`px-3 py-1 rounded-full font-mono text-xs border transition-all flex items-center gap-1 ${filterType === type ? color + " border-2" : "bg-muted border-border text-muted-foreground hover:bg-accent"}`}
            onClick={() => setFilterType(type)}
          >
            <span className={`inline-block w-2 h-2 rounded-full ${color.split(" ")[0]}`}></span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {filtered.map((entry, idx) => {
          const isOpen = expanded === entry.version;
          // Fallback color if type not in mapping
          const colorString = typeColors[entry.type] ?? '';
          return (
            <li key={entry.version} className="mb-12 ml-4">
              {/* Dot */}
              <span className={`absolute -left-1.5 mt-2 flex items-center justify-center w-3 h-3 rounded-full ring-8 ring-background ${colorString.split(" ")[0]}`}></span>
              <div className="relative flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded font-mono text-xs border ${colorString}`}>{entry.type}</span>
                <span className="font-mono text-xs text-muted-foreground">{format(new Date(entry.date), "MMM d, yyyy")}</span>
                <span className="font-mono text-xs text-muted-foreground">v{entry.version}</span>
              </div>
              <button
                className="text-left w-full"
                onClick={() => setExpanded(isOpen ? null : entry.version)}
                aria-expanded={isOpen}
              >
                <h3 className="text-base font-semibold mb-1 mt-3">{entry.title}</h3>
                <div
                  className={`prose prose-sm dark:prose-invert max-w-none transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-16 opacity-80"}`}
                  style={{
                    WebkitMaskImage: !isOpen ? "linear-gradient(180deg, #000 70%, transparent 100%)" : undefined,
                    maskImage: !isOpen ? "linear-gradient(180deg, #000 70%, transparent 100%)" : undefined,
                  }}
                >
                  {isOpen ? entry.body : getExcerpt(entry.body)} {" "}  
                 #{entry.category}
                </div>
                <span className="font-mono text-xs text-primary mt-2 inline-block transition-opacity duration-300 opacity-80 hover:opacity-100">
                  {isOpen ? "Show less" : "Read more →"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
