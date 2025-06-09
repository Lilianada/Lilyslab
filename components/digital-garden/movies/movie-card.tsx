"use client"

import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"

export default function MovieCard({ post }: { 
  post: {
    id: string;
    image: string;
    title: string;
    date: string;
    thoughts: string;
    [key: string]: unknown;
  }
}) {
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({})

  return (
    <div key={post.id} className="mb-4 break-inside-avoid">
              <div className="rounded-lg overflow-hidden border bg-card/40">
                {/* Image */}
                <div className="relative w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-auto"
                    priority={false}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-medium mb-2 hover:text-blue-500 cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <Input
                    type="text"
                    placeholder="Reply..."
                    value={replyText[post.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    className="text-sm bg-muted"
                  />
                </div>
              </div>
            </div>
  )}