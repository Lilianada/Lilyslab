"use client";
import { AiEditedBadge } from "@/components/garden/AiEditedBadge";
import React, { useState } from "react";
import { ArrowRight, Lock } from 'lucide-react';
import { HideLockedButton, useHideLocked } from "@/components/garden/HideLocked";
import { GardenViewToggle, useGardenView } from "@/components/garden/GardenViewToggle";
import { TOPICS } from "@/lib/garden/topics";

interface NoteMeta {
  title: string;
  createdAt: string;
  lastUpdated: string;
  type: string;
  slug: string;
  tags?: string[];
  displayDate: string;
  fullDate: string;
  /** Marked `published: false`: listed, but it can't be opened. */
  locked: boolean;
  /** Written by me, edited with AI. */
  aiEdited?: boolean;
  /** The garden topic it's planted in. */
  topicId: string;
}

interface Props {
  grouped: Record<string, Record<string, NoteMeta[]>>;
  allNotes: NoteMeta[];
}

export default function NotesTagFilterClient({ grouped, allNotes }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [hideLocked, toggleHideLocked] = useHideLocked();
  const [view, setView] = useGardenView();
  const lockedCount = allNotes.filter((note) => note.locked).length;
  
  // Count notes per tag
  const tagCounts: Record<string, number> = {};
  allNotes.forEach((note) => {
    (note.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Sort tags by count (most used first)
  const popularTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([tag]) => tag);
  
  // Get top tags (tags with at least 2 occurrences or the top 10)
  const topTags = popularTags.filter(tag => tagCounts[tag] >= 2).slice(0, 12);
  
  // All tags sorted alphabetically for expanded view
  const allTags = Object.keys(tagCounts).sort();

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  // Filter and regroup notes based on selected tag
  const filteredAndGrouped = React.useMemo(() => {
    if (!selectedTag && !hideLocked) return grouped;
    
    // Filter all notes by tag, and drop locked ones when they're hidden
    const filteredNotes = allNotes.filter(note =>
      (!selectedTag || (note.tags || []).includes(selectedTag)) && !(hideLocked && note.locked)
    );
    
    // Regroup filtered notes
    return filteredNotes.reduce((acc, note) => {
      const [year, month] = note.lastUpdated.split('-');
      if (!year || !month) return acc;
      
      if (!acc[year]) {
        acc[year] = {};
      }
      
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      
      acc[year][month].push(note);
      
      return acc;
    }, {} as Record<string, Record<string, NoteMeta[]>>);
  }, [selectedTag, hideLocked, grouped, allNotes]);

  // The same filters, as a flat list for the topic view.
  const visibleNotes = allNotes.filter(
    (note) => (!selectedTag || (note.tags || []).includes(selectedTag)) && !(hideLocked && note.locked)
  );

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {!isLoaded ? (
        <div className="w-full min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  Filter by tags
                  <span className="text-xs text-muted-foreground font-normal">(click to filter)</span>
                </h3>
                {allTags.length > topTags.length && (
                  <button 
                    onClick={() => setShowAllTags(!showAllTags)} 
                    className="text-xs flex items-center gap-1 text-primary hover:opacity-80 transition-all font-mono"
                  >
                    {showAllTags ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Show Popular Tags
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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
                  All Notes ({allNotes.length})
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

          <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
            <GardenViewToggle view={view} onChange={setView} />
            <HideLockedButton hide={hideLocked} onToggle={toggleHideLocked} count={lockedCount} />
          </div>

          {/* Notes grid: grouped by topic, or by year */}
          {view === "topic" ? (
            <div className="space-y-8">
              {TOPICS.map((topic) => {
                const topicNotes = visibleNotes.filter((note) => note.topicId === topic.id);
                if (topicNotes.length === 0) return null;
                return (
                  <div key={topic.id} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-lg font-medium text-foreground">
                        <a href={`/garden/topics/${topic.id}`} className="hover:text-primary hover:underline hover:underline-offset-4">
                          {topic.title}
                        </a>
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {topicNotes.length} {topicNotes.length === 1 ? "note" : "notes"}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {[...topicNotes]
                        .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
                        .map((note) => (
                          <NoteCard key={note.slug} note={note} />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
          <div className="space-y-8">
            {/* Sort years in descending order (newest first) */}
            {Object.entries(filteredAndGrouped)
              .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
              .map(([year, monthGroups]) => {
                // Flatten all notes from all months in this year
                const yearNotes = Object.values(monthGroups).flat();

                return (
                  <div key={year} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-lg font-medium text-foreground">{year}</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {yearNotes.length} notes
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {yearNotes
                        .sort((a, b) => b.fullDate.localeCompare(a.fullDate))
                        .map((note) => (
                          <NoteCard key={note.slug} note={note} />
                        ))}
                    </div>
                  </div>
                );
              })}
          </div>
          )}
        </>
      )}
    </div>
  );
}

/** One note in the grid; locked notes show but can't be opened. */
function NoteCard({ note }: { note: NoteMeta }) {
  return note.locked ? (
    <div className="block cursor-not-allowed opacity-60" title="This note is locked for now">
      <div className="p-4 rounded-lg border border-dashed border-border bg-card backdrop-blur-sm">
        <div className="space-y-1">
          <p className="font-medium text-xs leading-tight text-foreground line-clamp-2">{note.title}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-nitti">Tended {note.displayDate} · Locked</span>
            <Lock className="w-3 h-3 text-muted-foreground" aria-label="Locked" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <a href={`/garden/notes/${note.slug}`} className="group block">
      <div className="p-4 rounded-lg border border-dashed border-border bg-card backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-card/50 hover:shadow-sm hover:-translate-y-0.5">
        <div className="space-y-1">
          <p className="font-medium text-xs leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {note.title}
          </p>
          {note.aiEdited && <AiEditedBadge />}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-nitti">Tended {note.displayDate}</span>
            <div className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
