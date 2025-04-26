"use client";
import React, { useState } from "react";
import type { Bookmark } from "@/lib/bookmarks";
import { BookmarkItem } from "@/components/digital-garden/BookmarkItem";

interface Props {
  bookmarks: Bookmark[];
}

export default function TagFilterClient({ bookmarks }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  const filteredBookmarks = selectedTag
    ? bookmarks.filter((b) => b.tags.includes(selectedTag))
    : bookmarks;

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {!isLoaded ? (
        <div className="w-full min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="my-8">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded bg-muted hover:bg-accent text-sm font-mono transition-colors"
          onClick={() => setSelectedTag(null)}
        >
          <span className="font-semibold">Filter by tag</span>
        </button>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${
              selectedTag === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted border-border text-muted-foreground hover:bg-accent"
            }`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted border-border text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-10 space-y-2">
        {filteredBookmarks.map((bookmark) => (
          <li key={bookmark.link}>
            <BookmarkItem bookmark={bookmark} />
          </li>
        ))}
      </ul>
        </>
      )}
    </div>
  );
}
