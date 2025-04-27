"use client"

import Image from "next/image"

interface Note {
    id: string;
    title: string;
    date: string;
    entry: string;
    image?: string | null;
    tags?: string[];
}

export default function NoteCard({ note }: { note: Note }) {
    const formattedDate = new Date(note.date).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });


    return (
        <article key={note.id} className="mb-4 break-inside-avoid">
            <div className="group relative bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50">
                {note.image && (
                    <div className="relative w-full h-48 sm:h-56">
                        <Image
                            src={note.image}
                            alt={`Image for note titled ${note.title}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 640px) 100vw, 50vw"
                        />
                    </div>
                )}

                <div className="p-5">
                    <header className="mb-3 pb-2 border-b border-border/50">
                        <h2 className="text-base font-semibold text-foreground mb-1">
                            {note.title}
                        </h2>

                    </header>

                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                        {note.entry}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
                        {note.tags?.map((tag) => (
                            <span key={tag} className="inline-block bg-muted/50 px-2 py-1 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                        <time dateTime={note.date}>{formattedDate}</time>
                    </div>
                </div>
            </div>
        </article>
    )
}