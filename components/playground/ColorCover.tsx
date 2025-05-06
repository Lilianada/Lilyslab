"use client"

import { useEffect, useState } from "react"
import { LockKeyholeIcon, Music } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the available extra colors from the theme
const extraColors = [
  "bg-extra-lavender",
  "bg-extra-yellow",
  "bg-extra-green",
  "bg-extra-pink",
  "bg-extra-Blue",
  "bg-extra-cream",
  "bg-extra-lilac",
  "bg-extra-peach",
  "bg-extra-paleYellow",
  "bg-extra-steelBlue"
]

interface ColorCoverProps {
  title: string
  artist: string
  size?: "sm" | "md" | "lg"
  className?: string
  isPremium?: boolean
}

export function ColorCover({ 
  title, 
  artist, 
  size = "md", 
  className,
  isPremium = false
}: ColorCoverProps) {
  const [color, setColor] = useState<string>("")
  
  // Generate a deterministic color based on the title and artist
  useEffect(() => {
    // Create a simple hash from the title and artist
    const hash = (title + artist).split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    
    // Use the hash to select a color
    const colorIndex = Math.abs(hash) % extraColors.length
    setColor(extraColors[colorIndex])
  }, [title, artist])
  
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-48 h-48 text-base",
    lg: "w-64 h-64 text-lg"
  }
  
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-lg shadow-md overflow-hidden",
        color,
        sizeClasses[size],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
      
      {size === "md" || size === "lg" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
          <Music className="mb-2 opacity-60" size={size === "lg" ? 48 : 32} />
          <p className="font-bold line-clamp-2">{title}</p>
          <p className="text-sm opacity-80 line-clamp-1">{artist}</p>
        </div>
      ) : (
        <Music className="opacity-60 text-white" size={16} />
      )}
      
      {isPremium && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
          <LockKeyholeIcon size={14} />
        </div>
      )}
    </div>
  )
}
