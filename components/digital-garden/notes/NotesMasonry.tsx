"use client"
import Masonry from "react-masonry-css"
import NoteCard from "./NoteCard"

// Define or import the Note type
interface Note {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  tags?: string[];
  entry: string;
  image?: string | null;
  type: string;
}

export default function NotesMasonry({ notes }: { notes: Note[] }) {
  const breakpointColumns = { default: 2, 700: 1, 640: 1 }
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="mx-auto max-w-4xl px-2 py-8">
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </Masonry>
      </div>
    </div>
  )
}