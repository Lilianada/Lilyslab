"use client"

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { MarkdownNotionBlock } from "./MarkdownNotionBlock"
import { MockNote } from "@/app/digital-garden/notes/mockNotes"

export default function NoteCard({ note }: { note: MockNote }) {
    const [replyText, setReplyText] = useState("")
    console.log('note.content', note.content);
    return (
        <div key={note.id} className="mb-4 break-inside-avoid">
            <div className="rounded-lg overflow-hidden border bg-card/40">
                {/* Image */}
                <div className="relative w-full">
                    <Image
                        src={note.image}
                        alt={note.title}
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-auto"
                        priority={false}
                    />
                </div>

                {/* Content */}
                <div className="p-4">


                    {/* Title and Description */}
                    <h3 className="font-medium mb-2 hover:text-blue-500 cursor-pointer">
                        {note.title}
                    </h3>
                    <div className="text-sm text-muted-foreground mb-3">
                        {/* {note.content} */}
                        {note.content ? (
                           <MarkdownNotionBlock markdown={note.content} />
                        ) : (
                            <div className="notion-empty p-4 border rounded-md bg-muted/20">
                                <p>Failed to load note content.</p>
                                <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
                                    <p className="font-mono">Note ID: {note.id}</p>
                                    <p className="font-mono mt-2">Debug info: Check server logs for more details</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-3 items-center">

                        {/* Reply Input */}
                        {/* <Input
                            type="text"
                            placeholder="Reply..."
                            value={replyText[note.id] || ""}
                            onChange={(e) =>
                                setReplyText((prev) => ({
                                    ...prev,
                                    [note.id]: e.target.value,
                                }))
                            }
                            className="text-sm bg-muted"
                        />
                        <span className="px-2">
                            🔥
                        </span> */}
                    </div>
                </div>
            </div>
        </div>
    )
}