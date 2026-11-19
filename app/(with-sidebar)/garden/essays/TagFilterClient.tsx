"use client";

import { AiEditedBadge } from "@/components/garden/AiEditedBadge";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUp, ArrowUpDown, Lock } from "lucide-react";
import { ExpandingSearch } from "@/components/ExpandingSearch";
import { formatDateForDisplay } from "@/lib/utils";
import { HideLockedButton, useHideLocked } from "@/components/garden/HideLocked";
import { TOPICS } from "@/lib/garden/topics";
import { GardenViewToggle, useGardenView } from "@/components/garden/GardenViewToggle";
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
  /** Marked `published: false`: listed, but it can't be opened. */
  locked: boolean;
  /** Written by me, edited with AI. */
  aiEdited: boolean;
  /** The garden topic it's planted in. */
  topicId: string;
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
  if (essay.locked) {
    return (
      <li>
        <div className="flex cursor-not-allowed items-start gap-4 py-3 opacity-60" title="This essay is locked for now">
          <span className={NUMBER_CLASS}>{number(position)}</span>
          <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
            <span className="block text-sm font-medium">{essay.title}</span>
            <span className="mt-1 block font-mono text-xs text-muted-foreground">
              {formatDateForDisplay(essay.createdAt)} · Locked
            </span>
          </span>
          <Lock size={14} className="mt-1 shrink-0 text-muted-foreground" aria-label="Locked" />
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link href={`/garden/essays/${essay.slug}`} className={ROW_CLASS}>
        <span className={NUMBER_CLASS}>{number(position)}</span>
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <span className="block text-sm font-medium">
            {essay.title}
            {essay.aiEdited && <AiEditedBadge className="ml-2 align-middle" />}
          </span>
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
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [hideLocked, toggleHideLocked] = useHideLocked();
  const [view, setView] = useGardenView();
  const lockedCount = essays.filter((essay) => essay.locked).length;

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

  // Essays arrive newest first; flip them for "Oldest".
  const sorted = sortOrder === "newest" ? essays : [...essays].reverse();
  const results = sorted.filter((essay) => !(hideLocked && essay.locked) && (!selectedTag || essay.tags.includes(selectedTag)) && matchesSearch(essay, query));
  const visible = showAllEssays || view === "topic" ? results : results.slice(0, PAGE_SIZE);
  const groups = TOPICS.map((topic) => ({ topic, essays: results.filter((essay) => essay.topicId === topic.id) })).filter(
    (group) => group.essays.length > 0
  );
  const hiddenCount = results.length - visible.length;

  return (
    <>
      {allTags.length > 0 && (
        <section className="mt-2">
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
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 break-words text-sm text-muted-foreground" aria-live="polite">
            Showing {results.length} of {essays.length} essays
            {selectedTag && ` with tag #${selectedTag}`}
            {query.trim() && ` matching "${query.trim()}"`}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <GardenViewToggle view={view} onChange={setView} />
            <HideLockedButton hide={hideLocked} onToggle={toggleHideLocked} count={lockedCount} />
            <ExpandingSearch value={query} onChange={setQuery} label="Search essays" />
            {view === "date" && <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs transition-all hover:bg-accent"
              title={`Sort by ${sortOrder === "newest" ? "oldest" : "newest"} first`}
            >
              <ArrowUpDown size={12} />
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>}
          </div>
        </div>

        {results.length > 0 && view === "topic" ? (
          <div className="space-y-10">
            {groups.map(({ topic, essays: group }) => (
              <section key={topic.id} aria-labelledby={`topic-${topic.id}`}>
                <div className="mb-1 flex items-baseline justify-between gap-4 border-b border-border pb-1">
                  <h3 id={`topic-${topic.id}`} className="text-sm font-medium">
                    <Link href={`/garden/topics/${topic.id}`} className="hover:text-primary hover:underline hover:underline-offset-4">
                      {topic.title}
                    </Link>
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">{group.length}</span>
                </div>
                <ol className={LIST_CLASS}>
                  {group.map((essay, index) => (
                    <EssayRow key={essay.slug} essay={essay} position={index + 1} />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        ) : results.length > 0 ? (
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
