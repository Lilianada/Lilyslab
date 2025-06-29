"use client";
import React, { useState } from "react";
import Link from "next/link";
import { formatDateForDisplay } from "@/lib/utils";
import type { Writing } from "@/lib/garden/writings";

interface Props {
  writings: Writing[];
}

// Helper function to count words in a string
function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// Helper function to calculate reading time based on words
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function TagFilterClient({ writings }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<Writing['type'] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Count writings per tag
  const tagCounts: Record<string, number> = {};
  writings.forEach((writing) => {
    (writing.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Sort tags by count (most used first)
  const popularTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([tag]) => tag);
  
  // Get top tags (tags with at least 2 occurrences or the top 10, whichever is more)
  const topTags = popularTags.filter(tag => tagCounts[tag] >= 2).slice(0, 12);
  
  // All tags sorted alphabetically for expanded view
  const allTags = Object.keys(tagCounts).sort();
  
  // Count writings per type
  const typeCounts: Record<string, number> = {
    evergreen: 0,
    seedling: 0,
    budding: 0
  };
  writings.forEach((writing) => {
    typeCounts[writing.type] = (typeCounts[writing.type] || 0) + 1;
  });
  
  // Available types (only show types that have writings)
  const types = Object.keys(typeCounts).filter(
    type => typeCounts[type] > 0
  ) as Writing['type'][];

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  // Sort writings by newest first
  const sortedWritings = [...writings].sort((a, b) => {
    // Convert to Date objects for safe comparison
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    
    // Sort newest first
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply tag and type filtering
  const filteredWritings = sortedWritings.filter(writing => {
    const matchesTag = !selectedTag || (writing.tags || []).includes(selectedTag);
    const matchesType = !selectedType || writing.type === selectedType;
    return matchesTag && matchesType;
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
            {/* Tag filter */}
            {allTags.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    Tags
                    <span className="text-xs text-muted-foreground font-normal">(click to filter)</span>
                  </h3>
                  {allTags.length > topTags.length && (
                    <button 
                      onClick={() => setShowAllTags(!showAllTags)} 
                      className="text-xs flex items-center gap-1 text-primary hover:opacity-80 transition-all font-mono"
                    >
                      {showAllTags ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          Show Popular Tags
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          View All Tags ({allTags.length})
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 transition-all duration-300">
                  <button
                    className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${selectedTag === null
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border text-muted-foreground hover:bg-accent"
                      }`}
                    onClick={() => setSelectedTag(null)}
                  >
                    All Tags ({allTags.length})
                  </button>
                  
                  {/* Show either popular tags or all tags based on state */}
                  {(showAllTags ? allTags : topTags).map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${
                        selectedTag === tag
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted border-border text-muted-foreground hover:bg-accent"
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      #{tag} <span className="opacity-80">({tagCounts[tag]})</span>
                    </button>
                  ))}
                  
                  {!showAllTags && allTags.length > topTags.length && (
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted border border-border">+{allTags.length - topTags.length} more tags</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredWritings.length} of {writings.length} writings
              {selectedType && ` of type ${selectedType}`}
              {selectedTag && ` with tag #${selectedTag}`}
            </p>
          </div>
          
          {/* Writings list */}
          <ul className="mt-6 space-y-2">
            {filteredWritings.map((writing) => (
              <li key={writing.slug} className="group relative">
                <Link
                  href={`/garden/writings/${writing.slug}`}
                  className="flex items-center gap-4 py-2 hover:scale-[1.025] transition-all duration-300 group"
                  prefetch
                >
                  {/* Left: Dot and Title */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-steelBlue" />
                    <p className="truncate text-sm">{writing.title}</p>
                  </div>
                  {/* Middle: Connecting line */}
                  <div className="flex-1 h-px bg-muted-foreground/30 mx-2 hidden md:block" />
                  {/* Right: Date or Hover Details */}
                  <div className="flex items-center gap-2 justify-end">
                    <span className="hidden group-hover:inline text-xs text-muted-foreground whitespace-nowrap transition-all duration-200">
                      {countWords(writing.content)} words • {calculateReadingTime(writing.content)} min
                    </span>
                    <time className="group-hover:hidden font-mono text-xs text-muted-foreground whitespace-nowrap transition-all duration-200">
                      {formatDateForDisplay(writing.createdAt)}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
