"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { HubItem, HubSource } from "@/lib/resource-hub";

const SOURCES: { source: HubSource; label: string; dot: string }[] = [
  { source: "Resource", label: "Resources", dot: "bg-sitePink" },
  { source: "Bookmark", label: "Bookmarks", dot: "bg-lavender" },
  { source: "Tool", label: "Tools", dot: "bg-siteGreen" },
  { source: "Webroll", label: "Webroll", dot: "bg-peach" },
];

const SHELVES = [
  { href: "/garden/bookmarks", label: "Bookmarks", note: "Things worth rereading", source: "Bookmark" },
  { href: "/tools", label: "Tools", note: "Apps I reach for", source: "Tool" },
  { href: "/webroll", label: "Webroll", note: "Corners of the web I love", source: "Webroll" },
  { href: "/uses", label: "Uses", note: "My everyday setup" },
  { href: "/garden/bookshelf", label: "Bookshelf", note: "What I'm reading" },
] as const;

const RECENT_BOOKMARKS = 5;

function matchesSearch(item: HubItem, query: string) {
  const words = query.toLowerCase().replace(/#/g, " ").split(/\s+/).filter(Boolean);
  const address = item.url.replace(/^https?:\/\/(www\.)?/, "");
  const searchable = `${item.title} ${item.description} ${item.category} ${item.tags.join(" ")} ${address}`.toLowerCase();
  return words.every((word) => searchable.includes(word));
}

function HubRow({ item }: { item: HubItem }) {
  const dot = SOURCES.find(({ source }) => source === item.source)?.dot;
  const domain = item.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

  return (
    <li>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 border-b border-dashed border-border py-3 transition-colors hover:bg-muted/50"
      >
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <span className="block text-sm">{item.title}</span>
          {item.description && (
            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{item.description}</span>
          )}
          <span className="mt-1 block font-mono text-xs text-muted-foreground">
            {item.source} · {domain}
          </span>
        </span>
        <ArrowUpRight
          size={14}
          className="mt-1 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </li>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">{children}</h2>;
}

export function ResourceHub({ items }: { items: HubItem[] }) {
  const [query, setQuery] = useState("");
  const [activeSource, setActiveSource] = useState<HubSource | null>(null);

  const countOf = (source: HubSource) => items.filter((item) => item.source === source).length;
  const isBrowsing = !query.trim() && !activeSource;
  const results = items.filter(
    (item) => (!activeSource || item.source === activeSource) && matchesSearch(item, query)
  );

  const resources = items.filter((item) => item.source === "Resource");
  const categories = Array.from(new Set(resources.map((item) => item.category || "Everything else"))).sort();
  const recentBookmarks = items.filter((item) => item.source === "Bookmark").slice(0, RECENT_BOOKMARKS);

  const pillClass = (isActive: boolean) =>
    `rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-muted text-muted-foreground hover:bg-accent"
    }`;

  return (
    <>
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          placeholder={`Search all ${items.length} saved things`}
          aria-label="Search everything saved"
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

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveSource(null)} className={pillClass(activeSource === null)}>
          All ({items.length})
        </button>
        {SOURCES.map(({ source, label }) => (
          <button
            key={source}
            type="button"
            onClick={() => setActiveSource(source)}
            className={pillClass(activeSource === source)}
          >
            {label} ({countOf(source)})
          </button>
        ))}
      </div>

      {isBrowsing ? (
        <div className="mt-10 space-y-10">
          <section>
            <SectionHeading>Shelves</SectionHeading>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SHELVES.map((shelf) => (
                <li key={shelf.href}>
                  <Link
                    href={shelf.href}
                    className="flex h-full items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {shelf.label}
                        {"source" in shelf && (
                          <span className="ml-1.5 font-mono text-xs font-normal text-muted-foreground">
                            {countOf(shelf.source)}
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-muted-foreground">{shelf.note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {categories.map((category) => (
            <section key={category}>
              <SectionHeading>{category}</SectionHeading>
              <ul>
                {resources
                  .filter((item) => (item.category || "Everything else") === category)
                  .map((item) => (
                    <HubRow key={item.id} item={item} />
                  ))}
              </ul>
            </section>
          ))}

          <section>
            <SectionHeading>Recently bookmarked</SectionHeading>
            <ul>
              {recentBookmarks.map((item) => (
                <HubRow key={item.id} item={item} />
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <section className="mt-8">
          <p className="mb-2 font-mono text-xs text-muted-foreground" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          {results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <HubRow key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-muted-foreground">Nothing saved under that yet. Try a different word.</p>
          )}
        </section>
      )}
    </>
  );
}
