import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { getPublishedArticles } from "@/lib/notion"
import { Annoyed } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 3600 // Revalidate every hour

import { mockNotes, MockNote } from "../notes/mockNotes";
import { colors } from "@/components/digital-garden/bookshelf/BookCard";

// Grid logic:
// - 3-col grid on desktop, 1-col on mobile
// - Card span:
//   >300 chars: col-span-3 (full width)
//   100-299 chars: col-span-2
//   <100 chars: col-span-1
// - Only allow 2-col + 1-col or 3x 1-col per row, never 2x 2-col per row
// - Truncate content at 300 chars

function getCardSpan(content: string) {
  if (content.length > 300) return 3;
  if (content.length >= 100) return 2;
  return 1;
}

function getCardColor(category: string) {
  const categoriesWhitelist = ["Productivity", "Focus", "Creativity", "Career"];
  const idx = categoriesWhitelist.indexOf(category);
  return colors[idx] || colors[0];
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function NoteCard({ note }: { note: MockNote }) {
  // Emoji/category mapping (customize as needed)
  const categoryEmoji: Record<string, string> = {
    Productivity: '💼',
    Focus: '🎯',
    Creativity: '🎨',
    Career: '🚀',
  };
  const color = getCardColor(note.category);
  return (
    <div
      className={
        `relative flex flex-col justify-between items-center w-full max-w-[340px] min-h-[200px] mx-auto bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-2xl border border-black/10 dark:border-white/10 shadow-sm dark:shadow-black/40 shadow-black/10 transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl group break-inside-avoid`
      }
    >
      {/* Notification bar (now inside card, no absolute) */}
      <div className="flex items-center justify-center w-full px-4 mx-auto mt-3 mb-2">
        <div
          className="flex items-center justify-between gap-2 "
          style={{ minHeight: '32px', minWidth: '100%' }}
        >
          <span className="inline-flex items-center justify-between w-7 h-7 rounded-full border-2" style={{ borderColor: color }}>
            <span className="text-xl bg-neutral-700" role="img" aria-label={note.category}></span>
          </span>
          <span className="px-4 py-1 rounded-lg border border-border bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-600 ml-2">{note.category}</span>
        </div>
      </div>
      {/* Card content */}
      <div className="flex flex-col justify-between flex-1 w-full  px-5 pt-2 pb-4">
        <h3 className="text-[15px] font-medium mb-2 text-muted-foreground">{note.title}</h3>
        <div className="text-sm text-muted-foreground flex-1 overflow-hidden relative mb-4">
          <div>{note.content}</div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {note.tags.map(tag => (
              <span key={tag} className="text-xs text-secondary">
                #{tag}
              </span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">{note.created}</div>
        </div>
        </div>
    </div>
  );
}


export default function QuickNotesPage() {
  // For now, use mockNotes for display
  const notes = mockNotes;

  // Simple bento grid placement: just render in order, let col-span handle layout
  // For advanced packing, implement a custom row logic (future improvement)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in px-6 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="mb-1 text-xl font-medium">Quick Notes</h1>
          <p className="text-sm text-muted-foreground">
          A collection of quick thoughts, ideas, and learnings.</p>
        </div>
      </header>
      {/* Responsive bento grid: 3 cols desktop, 1 col mobile. Card span depends on note length. */}
      {/* Masonry columns: 4xl:columns-4, 2xl:columns-3, xl:columns-2, sm:columns-1 */}
      <div className="columns-1 sm:columns-2 xl:columns-3 4xl:columns-4 gap-2 sm:gap-3 md:gap-6 space-y-6">
        {notes.length > 0 ? (
          notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))
        ) : (
          <div className="text-center py-8 border rounded-lg p-8 grid place-items-center">
            <Annoyed size={16} />
            <h2 className="mt-2 text-base font-medium mb-2">No Notes Found</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              There are no published notes in your Notion database yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
