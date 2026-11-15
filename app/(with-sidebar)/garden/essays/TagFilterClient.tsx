"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUp, Search, X } from "lucide-react";
import { formatDateForDisplay } from "@/lib/utils";
import { LIST_CLASS, NUMBER_CLASS, ROW_CLASS, number } from "@/components/learn/TrackList";

/** Just what the list needs, so essay text stays out of the browser bundle. */
export interface EssayListItem {
  slug: string;
  title: string;
  createdAt: string;
  excerpt: string;
  tags: string[];
  wordCount: number;
  readingTime: number;
}

/** How many essays show before the "View all" button. */
const PAGE_SIZE = 50;

function matchesSearch(essay: EssayListItem, query: string) {
  const words = query.toLowerCase().replace(/#/g, " ").split(/\s+/).filter(Boolean);
  const searchable = `${essay.title} ${essay.excerpt} ${essay.tags.join(" ")}`.toLowerCase();
  return words.every((word) => searchable.includes(word));
}

const pillClass = (isActive: boolean) =>
  `rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
    isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground hover:bg-accent"
  }`;

const textButtonClass = "font-mono text-xs text-muted-foreground transition-colors hover:text-foreground";

function EssayRow({ essay, position }: { essay: EssayListItem; position: number }) {
  return (
    <li>
      <Link href={`/garden/essays/${essay.slug}`} className={ROW_CLASS}>
        <span className={NUMBER_CLASS}>{number(position)}</span>
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <span className="block text-sm font-medium">{essay.title}</span>
          {essay.excerpt && <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{essay.excerpt}</span>}
          <span className="mt-1 block font-mono text-xs text-muted-foreground">
            {formatDateForDisplay(essay.createdAt)} · {essay.readingTime} min read · {essay.wordCount.toLocaleString("en-US")}{" "}
            {essay.wordCount === 1 ? "word" : "words"}
          </span>
        </span>
        <ArrowRight
          size={14}
          className="mt-1 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

export default function TagFilterClient({ essays }: { essays: EssayListItem[] }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllEssays, setShowAllEssays] = useState(false);

  // Count essays per tag
  const tagCounts: Record<string, number> = {};
  essays.forEach((essay) => {
    essay.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Popular tags: used at least twice, most used first, up to 12
  const topTags = Object.keys(tagCounts)
    .filter((tag) => tagCounts[tag] >= 2)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 12);
  const allTags = Object.keys(tagCounts).sort();
  // Keep a selected tag visible even when it isn't a popular one
  const shownTags = showAllTags ? allTags : selectedTag && !topTags.includes(selectedTag) ? [...topTags, selectedTag] : topTags;

  const results = essays.filter((essay) => (!selectedTag || essay.tags.includes(selectedTag)) && matchesSearch(essay, query));
  const isFiltering = Boolean(query.trim() || selectedTag);
  const visible = showAllEssays ? results : results.slice(0, PAGE_SIZE);
  const hiddenCount = results.length - visible.length;

  return (
    <>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          placeholder="Search essays"
          aria-label="Search essays"
          enterKeyHint="search"
          className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-10 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Tags</h2>
            {allTags.length > topTags.length && (
              <button type="button" onClick={() => setShowAllTags(!showAllTags)} className={textButtonClass}>
                {showAllTags ? "Show popular tags" : `View all tags (${allTags.length})`}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSelectedTag(null)} className={pillClass(selectedTag === null)}>
              All
            </button>
            {shownTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                aria-pressed={selectedTag === tag}
                className={pillClass(selectedTag === tag)}
              >
                #{tag} <span className="opacity-70">{tagCounts[tag]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <p className="mb-2 font-mono text-xs text-muted-foreground" aria-live="polite">
          {isFiltering
            ? `${results.length} ${results.length === 1 ? "essay" : "essays"}${selectedTag ? ` tagged #${selectedTag}` : ""}`
            : `${essays.length} essays, newest first`}
        </p>

        {results.length > 0 ? (
          <ol className={LIST_CLASS}>
            {visible.map((essay, index) => (
              <EssayRow key={essay.slug} essay={essay} position={index + 1} />
            ))}
          </ol>
        ) : (
          <p className="py-6 text-sm text-muted-foreground">Nothing here yet. Try a different word.</p>
        )}

        {hiddenCount > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllEssays(true)}
              className="rounded-full border border-border bg-muted px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              View all {results.length} essays
            </button>
          </div>
        )}
      </section>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
          className={`inline-flex items-center gap-1 ${textButtonClass}`}
        >
          <ArrowUp size={12} aria-hidden="true" />
          Back to top
        </button>
      </div>
    </>
  );
}
