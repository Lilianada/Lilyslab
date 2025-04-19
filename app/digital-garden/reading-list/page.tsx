"use client"

import { useState } from "react"
import Image from "next/image"
import Masonry from "react-masonry-css"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Mock data for movies/shows
const posts = [
  {
    id: 1,
    title: "Succession",
    description: "A deep dive into power dynamics and family relationships in modern media empire.",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=60",
    tags: ["drama", "hbo", "series"],
    author: "Benjamin Roy",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "The Bear",
    description: "An intense look at the high-pressure world of fine dining and family legacy.",
    image: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=800&auto=format&fit=crop&q=60",
    tags: ["cooking", "drama", "fx"],
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    title: "Dune: Part Two",
    description: "Epic sci-fi continuation exploring power, religion, and environmentalism.",
    image: "https://images.unsplash.com/photo-1547371890-e7857435c2c8?w=800&auto=format&fit=crop&q=60",
    tags: ["sci-fi", "adaptation", "epic"],
    author: "Alex Kumar",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    title: "Poor Things",
    description: "A Victorian tale with a feminist twist and stunning visual storytelling.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60",
    tags: ["drama", "period", "surreal"],
    author: "Emma Stone",
    authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60"
  }
]

const breakpointColumns = {
  default: 3,
  1100: 2,
  640: 1
}

export default function MovieListPage() {
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({})

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Reading List</h1>
            <p className="text-sm text-muted-foreground">
              A collection of books I've read, am reading, or plan to read. Click on any book to see more details.
            </p>
          </div>
        </header>
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {posts.map((post) => (
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
                    {post.tags.map((tag) => (
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
          ))}
        </Masonry>
      </div>
    </div>
  )
} 