"use client"

import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface Note {
    id: string;
    title: string;
    createdAt: string;
    lastUpdated: string;
    entry: string;
    image?: string | null;
    tags?: string[];
    type: string;
}

export default function NoteCard({ note }: { note: Note }) {
    // Use the centralized date formatting utility
    const formattedCreatedDate = formatDate(note.createdAt);
    const formattedUpdatedDate = formatDate(note.lastUpdated);


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
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-4">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Created:</span>
                            <span>{formattedCreatedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Updated:</span>
                            <span>{formattedUpdatedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Type:</span>
                            <span>{note.type}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            <span className="font-medium">Tags:</span>
                            {note.tags?.map((tag) => (
                                <span key={tag} className="inline-block bg-muted/50 px-2 py-1 rounded-full text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}