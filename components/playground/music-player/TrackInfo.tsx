"use client"

import { ColorCover } from "../ColorCover"
import { AudioTrack } from "@/lib/audio/howler-service"

interface TrackInfoProps {
  track: AudioTrack
}

export function TrackInfo({ track }: TrackInfoProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-4">
        {track.coverImage ? (
          <img 
            src={track.coverImage} 
            alt={track.title}
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        ) : (
          <ColorCover 
            title={track.title}
            artist={track.artist}
            size="md"
            isPremium={track.isPremium}
          />
        )}
      </div>
      
      <h3 className="text-xl font-bold">{track.title}</h3>
      <p className="text-sm text-muted-foreground">{track.artist}</p>
    </div>
  )
}
