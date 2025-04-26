"use client"

import { BookmarkItem } from "@/components/digital-garden/BookmarkItem";
import type { Bookmark } from "@/components/digital-garden/BookmarkItem";
import React, { useState, useEffect } from "react";

// TagFilter component
function TagFilter({
  bookmarks,
  selectedTag,
  setSelectedTag,
}: {
  bookmarks: any[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const tags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));

  return (
    <div className="my-8">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded bg-muted hover:bg-accent text-sm font-mono transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-semibold">Filter by tag</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
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
    </div>
  );
}


const bookmarks: Bookmark[] = [
  {
    link: "https://reederapp.com/",
    title: "Reeder – RSS Reader",
    cover: "https://reederapp.com/images/og-image.png",
    tags: ["rss", "reader"],
    type: "website",
    created: "2024-04-01T08:00:00Z",
  },
  {
    link: "https://raindrop.io/",
    title: "Raindrop.io – Bookmark Manager",
    cover: "https://raindrop.io/static/og-image.png",
    tags: ["bookmarks", "manager"],
    type: "website",
    created: "2024-04-02T10:00:00Z",
  },
  {
    link: "https://blog.example.com/ai-trends",
    title: "AI Trends in 2024",
    cover: "https://blog.example.com/images/ai-trends.png",
    tags: ["ai", "article"],
    type: "article",
    created: "2024-04-03T12:00:00Z",
  },
  {
    link: "https://youtube.com/watch?v=xyz123",
    title: "Understanding React Server Components",
    cover: "https://img.youtube.com/vi/xyz123/hqdefault.jpg",
    tags: ["react", "video", "frontend"],
    type: "video",
    created: "2024-04-04T15:00:00Z",
  },
  {
    link: "https://personalblog.com/creative-workflow",
    title: "My Creative Workflow",
    cover: "https://personalblog.com/covers/workflow.png",
    tags: ["workflow", "misc"],
    type: "misc",
    created: "2024-04-05T09:00:00Z",
  },
];

export default function Bookmark() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredBookmarks = selectedTag
    ? bookmarks.filter((b) => b.tags.includes(selectedTag))
    : bookmarks;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`max-w-5xl mx-auto py-12 px-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium">Bookmarks</h1>
      </header>

      <div>
        <p className="font-mono mb-6 text-sm text-muted-foreground">
          I collect and organize my favorite reads, tools, and discoveries here—curated from my daily explorations across the web. Each bookmark is handpicked and tagged for inspiration, learning, or just plain delight.
        </p>
        <ul className="mt-8 flex items-center gap-4 font-mono text-xs">
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#FBF3B9] border border-gray-300"></span>Article
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#FFDCCC] border border-gray-300"></span>Website
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#FDB7EA] border border-gray-300"></span>Video
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#B7B1F2] border border-gray-300"></span>Misc
          </li>
        </ul>

        {/* Tag Filter Collapsible */}
        <TagFilter bookmarks={bookmarks} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />

        <ul className="mt-10 space-y-2">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkItem key={bookmark.link} bookmark={bookmark} />
          ))}
        </ul>
      </div>
    </div>
  );
}