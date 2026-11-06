"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import type { SearchItem } from "@/lib/garden-index";

interface ArchiveItem {
  slug: string;
  title: string;
  category: string;
}

const STATIC_PAGES: SearchItem[] = [
  { title: "Essays", path: "/garden/essays", snippet: "Browse essays and long-form writing." },
  { title: "Notes", path: "/garden/notes", snippet: "Explore notes, drafts, and short thoughts." },
  { title: "Poems", path: "/garden/poems", snippet: "Discover poetry and verse." },
  { title: "Media Digest", path: "/garden/media-digest", snippet: "Songs, films, shows, podcasts, books and articles, month by month." },
  { title: "Bookmarks", path: "/garden/bookmarks", snippet: "Find saved links and curated bookmarks." },
  { title: "Archives", path: "/archives", snippet: "Search older archived writings and notes." },
  { title: "Quotes", path: "/quotes", snippet: "Read collections of favorite quotes." },
  { title: "Playground", path: "/playground", snippet: "Games, toys and experiments." },
].map((page) => ({ ...page, id: `page-${page.path}`, type: "Page", tags: [], text: "" }));

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[]>(STATIC_PAGES);
  const [isLoading, setIsLoading] = useState(false);
  const hasRequestedIndex = useRef(false);

  // The full index is about half a megabyte of text, so it waits until someone
  // actually searches.
  const loadIndex = async () => {
    if (hasRequestedIndex.current) return;
    hasRequestedIndex.current = true;
    setIsLoading(true);

    try {
      const [items, archives] = await Promise.all([
        fetch("/api/search-index").then((response) => response.json() as Promise<SearchItem[]>),
        fetch("/api/archives").then((response) => response.json() as Promise<{ items?: ArchiveItem[] }>),
      ]);

      const archiveItems: SearchItem[] = (archives.items ?? []).map((archive) => ({
        id: `archive-${archive.category}-${archive.slug}`,
        title: archive.title,
        path: `/archives/${archive.category}/${archive.slug}`,
        type: "Archive",
        snippet: archive.category,
        tags: [archive.category],
        text: "",
      }));

      setIndex([...items, ...archiveItems, ...STATIC_PAGES]);
    } catch (error) {
      console.error("Could not load the search index:", error);
      hasRequestedIndex.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const matches = index.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.snippet.toLowerCase().includes(term) ||
        item.text.toLowerCase().includes(term) ||
        item.tags.some((tag) => String(tag).toLowerCase().includes(term))
    );

    // A bookmark can sit in two categories, which gives it the same id twice.
    const seen = new Set<string>();
    return matches
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, 20);
  }, [query, index]);

  return (
    <div className="mb-6 max-w-xl" onFocus={loadIndex}>
      <SearchBar
        placeholder="Search essays, notes, poems, bookmarks, archives..."
        onSearch={setQuery}
        className="max-w-xl"
      />

      {query && (
        <div className="mt-4 rounded-md border border-muted p-4 bg-surface" aria-live="polite">
          <p className="text-xs text-muted-foreground">Search results for "{query}"</p>

          {results.length > 0 ? (
            <div className="mt-4 space-y-3">
              {results.map((result) => (
                <div key={result.id} className="rounded-md border border-muted p-3">
                  <Link
                    href={result.path}
                    target={result.external ? "_blank" : undefined}
                    rel={result.external ? "noopener noreferrer" : undefined}
                    className="font-medium text-sm text-codeRed hover:underline"
                  >
                    {result.title}
                  </Link>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mt-1">{result.type}</p>
                  {result.snippet && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{result.snippet}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {isLoading
                ? "Rummaging through the garden..."
                : "Nothing's growing under that name. Try a broader term or browse the sections below."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
