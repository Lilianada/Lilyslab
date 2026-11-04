"use client";

import { useState, type ReactNode } from "react";

export type ChangelogKind = "feature" | "improvement" | "fix" | "update";

export interface ChangelogEntry {
  id: string;
  version?: string;
  title: string;
  displayDate: string;
  year: string;
  kind: ChangelogKind;
  summary: string;
  body: ReactNode;
}

const KIND_DOTS: Record<ChangelogKind, string> = {
  feature: "bg-siteGreen",
  improvement: "bg-steelBlue",
  fix: "bg-codeRed",
  update: "bg-muted-foreground",
};

const KINDS = Object.keys(KIND_DOTS) as ChangelogKind[];

const Dot = ({ kind }: { kind: ChangelogKind }) => (
  <span aria-hidden="true" className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${KIND_DOTS[kind]}`} />
);

export default function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  const [filter, setFilter] = useState<ChangelogKind | "all">("all");

  const visible = filter === "all" ? entries : entries.filter((entry) => entry.kind === filter);
  const years = [...new Set(visible.map((entry) => entry.year))];
  const latestId = entries[0]?.id;

  const filterButton = (value: ChangelogKind | "all", label: string, count: number) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 font-mono text-xs capitalize transition-colors ${
        filter === value ? "border-codeRed text-codeRed" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {value !== "all" && <Dot kind={value} />}
      {label} <span className="opacity-60">{count}</span>
    </button>
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {filterButton("all", "All", entries.length)}
        {KINDS.map((kind) => {
          const count = entries.filter((entry) => entry.kind === kind).length;
          return count > 0 ? filterButton(kind, kind, count) : null;
        })}
      </div>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year}>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">{year}</h2>
            <ol className="divide-y divide-dashed">
              {visible
                .filter((entry) => entry.year === year)
                .map((entry) => (
                  <li key={entry.id}>
                    <details className="group py-4" open={entry.id === latestId}>
                      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted-foreground">
                          <Dot kind={entry.kind} />
                          <span>{entry.displayDate}</span>
                          {entry.version && <span>· v{entry.version}</span>}
                          {entry.id === latestId && <span className="text-codeRed">· latest</span>}
                        </div>
                        <div className="mt-1 flex items-start justify-between gap-3">
                          <h3 className="text-sm font-medium group-hover:text-codeRed">{entry.title}</h3>
                          <span
                            aria-hidden="true"
                            className="font-mono text-sm text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                          >
                            +
                          </span>
                        </div>
                        {entry.summary && (
                          <p className="mt-1 text-xs text-muted-foreground group-open:hidden">{entry.summary}</p>
                        )}
                      </summary>
                      <div className="prose prose-sm dark:prose-invert mt-3 max-w-none break-words text-[13px] [&_a]:text-codeRed [&_h2]:mb-1 [&_h2]:mt-4 [&_h2]:text-sm [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-[13px] [&_li]:my-0.5 [&_p]:my-2 [&_ul]:my-2 [&>:first-child]:mt-0">
                        {entry.body}
                      </div>
                    </details>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
