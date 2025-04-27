\"use client\";

import { useState, useEffect } from \"react\";
import { Loader2 } from \"lucide-react\"; // For loading state

// Define the Note type matching the API response
interface Note {
  id: string;
  title: string;
  author?: string;
  date: string; // Keep as string for display formatting
  quote: string;
}

// Simple inline Note Card component
function NoteCard({ note }: { note: Note }) {
  // Basic date formatting (customize as needed)
  const formattedDate = new Date(note.date).toLocaleDateString(\"en-US\", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className=\"bg-card border border-border rounded-lg p-5 mb-6 shadow-sm\">
      <header className=\"mb-3 pb-2 border-b border-border/50\">
        <h2 className=\"text-lg font-semibold text-foreground\">{note.title}</h2>
        <div className=\"flex justify-between items-center text-xs text-muted-foreground mt-1\">
          <span>By {note.author}</span>
          <time dateTime={note.date}>{formattedDate}</time>
        </div>
      </header>
      <p className=\"text-sm text-foreground/90 leading-relaxed whitespace-pre-line\">
        {note.quote}
      </p>
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
        const response = await fetch(\"/api/notes\");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to load notes' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: Note[] = await response.json();
        setNotes(data);
      } catch (err) {
        console.error(\"Failed to load notes:\", err);
        const message = err instanceof Error ? err.message : \"Failed to load notes data.\";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotes();
  }, []);

  return (
    <div className=\"max-w-2xl mx-auto px-4 sm:px-6 py-12\">
      <header className=\"mb-8\">
        <h1 className=\"mb-1 text-2xl font-bold\">Notes</h1>
        <p className=\"text-sm text-muted-foreground\">
          A collection of thoughts, quotes, and reflections.
        </p>
      </header>

      <main>
        {isLoading ? (
          <div className=\"flex justify-center items-center py-20\">
            <Loader2 className=\"h-8 w-8 animate-spin text-muted-foreground\" />
          </div>
        ) : error ? (
          <div className=\"text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4\">{error}</div>
        ) : notes.length === 0 ? (
          <div className=\"text-center py-10 text-muted-foreground border rounded-lg p-4\">No notes published yet.</div>
        ) : (
          <div>
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 