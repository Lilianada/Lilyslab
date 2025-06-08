"use client";
import React, { useState } from "react";
import type { Bookmark } from "@/lib/bookmarks";
import { BookmarkItem } from "@/components/digital-garden/bookmark/BookmarkItem";

interface Props {
  bookmarks: Bookmark[];
}

export default function TagFilterClient({ bookmarks }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Bookmark['type'] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Count bookmarks per tag
  const tagCounts: Record<string, number> = {};
  bookmarks.forEach((b) => {
    b.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const tags = Object.keys(tagCounts).sort();
  
  // Count bookmarks per category
  const categoryCounts: Record<string, number> = {
    article: 0,
    website: 0,
    video: 0,
    misc: 0
  };
  bookmarks.forEach((b) => {
    categoryCounts[b.type] = (categoryCounts[b.type] || 0) + 1;
  });
  
  // Available categories (only show categories that have bookmarks)
  const categories = Object.keys(categoryCounts).filter(
    cat => categoryCounts[cat] > 0
  ) as Bookmark['type'][];

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  // Sort bookmarks by newest first
  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });
  
  // Apply tag and category filtering
  const filteredBookmarks = sortedBookmarks.filter(bookmark => {
    const matchesTag = !selectedTag || bookmark.tags.includes(selectedTag);
    const matchesCategory = !selectedCategory || bookmark.type === selectedCategory;
    return matchesTag && matchesCategory;
  });

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {!isLoaded ? (
        <div className="w-full min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="my-8">
            {/* Category filter */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium flex items-center gap-2">
                Categories
                <span className="text-xs text-muted-foreground font-normal">(click to filter)</span>
              </h3>
              <div className="flex flex-wrap gap-4 font-mono text-xs">
                <button
                  className={`flex items-center hover:opacity-80 hover:translate-x-0.5 transition-all cursor-pointer ${
                    selectedCategory === null ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-mint border border-gray-300"></span>
                  All <span className="ml-1 text-muted-foreground">({bookmarks.length})</span>
                </button>
                
                <button
                  className={`flex items-center hover:opacity-80 hover:translate-x-0.5 transition-all cursor-pointer ${
                    selectedCategory === "article" ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory("article")}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-lavender border border-gray-300"></span>
                  Article <span className="ml-1 text-muted-foreground">({categoryCounts.article})</span>
                </button>
                
                <button
                  className={`flex items-center hover:opacity-80 hover:translate-x-0.5 transition-all cursor-pointer ${
                    selectedCategory === "website" ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory("website")}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-peach border border-gray-300"></span>
                  Website <span className="ml-1 text-muted-foreground">({categoryCounts.website})</span>
                </button>
                
                <button
                  className={`flex items-center hover:opacity-80 hover:translate-x-0.5 transition-all cursor-pointer ${
                    selectedCategory === "video" ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory("video")}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-steelBlue border border-gray-300"></span>
                  Video <span className="ml-1 text-muted-foreground">({categoryCounts.video})</span>
                </button>
                
                <button
                  className={`flex items-center hover:opacity-80 hover:translate-x-0.5 transition-all cursor-pointer ${
                    selectedCategory === "misc" ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory("misc")}
                >
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-yellow border border-gray-300"></span>
                  Misc <span className="ml-1 text-muted-foreground">({categoryCounts.misc})</span>
                </button>
              </div>
            </div>
            
            {/* Tag filter */}
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium flex items-center gap-2">
                Tags
                <span className="text-xs text-muted-foreground font-normal">(click to filter)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${selectedTag === null
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-border text-muted-foreground hover:bg-accent"
                    }`}
                  onClick={() => setSelectedTag(null)}
                >
                  All Tags ({bookmarks.length})
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${selectedTag === tag
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border text-muted-foreground hover:bg-accent"
                      }`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag} ({tagCounts[tag]})
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
              {selectedCategory && ` in category ${selectedCategory}`}
              {selectedTag && ` with tag #${selectedTag}`}
            </p>
          </div>
          
          {/* Bookmark list */}
          <ul className="mt-6 space-y-2">
            {filteredBookmarks.map((bookmark) => (
              <li key={bookmark.id || bookmark.link}>
                <BookmarkItem bookmark={bookmark} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
