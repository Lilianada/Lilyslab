"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Share2, Download, Heart } from "lucide-react"

interface PinCardProps {
  title: string
  description: string
  image: string
  tags: string[]
}

export function PinCard({ title, description, image, tags }: PinCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // You might want to show a toast notification here
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <>
      <div className="group relative rounded-lg overflow-hidden bg-background border transition-all duration-300 hover:shadow-lg">
        {/* Image Container */}
        <div
          className="relative cursor-pointer w-full"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative w-full">
            <Image
              src={image}
              alt={title}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "w-full h-auto object-cover transition-opacity duration-300",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
              priority={false}
              unoptimized={false}
            />
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-medium line-clamp-1">{title}</h3>
              <p className="text-white/80 text-sm line-clamp-2 mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className="p-2 rounded-full bg-background/80 hover:bg-background transition-colors duration-200"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isLiked ? "fill-red-500 text-red-500" : "text-foreground"
              )}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleShare()
            }}
            className="p-2 rounded-full bg-background/80 hover:bg-background transition-colors duration-200"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Tags */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-background/80 text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )
} 