"use client"
import Masonry from "react-masonry-css"
import NoteCard from "./NoteCard"
import type { MockNote } from "@/app/digital-garden/notes/mockNotes"

export default function NotesMasonry({ notes }: { notes: MockNote[] }) {
  const breakpointColumns = { default: 3, 1100: 2, 700: 1, 640: 1 }
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="mx-auto max-w-6xl px-2 py-8">
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