"use client";

import { useState, useEffect } from "react";
import { NoteCardSkeleton } from "@/components/digital-garden/notes/NoteCardSkeleton";
import NotesMasonry from "@/components/digital-garden/notes/NotesMasonry";
import Image from "next/image";

// Define the Note type matching the API response
interface Note {
  id: string;
  title: string;
  tags?: string[]; // Changed from author
  date: string;
  entry: string;
  image?: string | null;
}

// Simple inline Note Card component
function NoteCard({ note }: { note: Note }) {
  const formattedDate = new Date(note.date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden mb-6 shadow-sm">
      {note.image && (
        <div className="relative w-full h-48 sm:h-64">
          <Image
            src={note.image}
            alt={`Image for note titled ${note.title}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, 640px"
          />
        </div>
      )}
      <div className="p-5">
        <header className="mb-3 pb-2 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">{note.title}</h2>
          {/* Display Date only in header now */}
          <div className="flex justify-end items-center text-xs text-muted-foreground mt-1">
            <time dateTime={note.date}>{formattedDate}</time>
          </div>
        </header>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-4">
          {note.entry}
        </p>
        {/* Display Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                #{tag} 
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotes() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/notes");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to load notes' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: Note[] = await response.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes:", err);
        const message = err instanceof Error ? err.message : "Failed to load notes data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotes();
  }, []);

  // Loading Skeleton Rendering
  const renderLoadingSkeletons = () => (
    <div>
      {Array.from({ length: 3 }).map((_, index) => (
        <NoteCardSkeleton key={index} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-4xl mx-auto px-0 sm:px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Notes</h1>
        <p className="text-sm text-muted-foreground">
          A collection of thoughts, quotes, and reflections.
        </p>
        </div>
      </header>

      <div>
        {isLoading ? (
          renderLoadingSkeletons()
        ) : error ? (
          <div className="text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4 max-w-2xl mx-auto">{error}</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border rounded-lg p-4 max-w-2xl mx-auto">No notes published yet.</div>
        ) : (
          <NotesMasonry notes={notes} />
        )}
      </div>
    </div>
    </div>
  );
}