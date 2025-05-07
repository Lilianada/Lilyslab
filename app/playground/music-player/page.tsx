"use client"

import { MusicPlayer } from "@/components/playground/music-player"

export default function MusicPlayerPage() {
  return (
    <div className="sm:container max-w-4xl mx-auto py-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Music Player</h1>
        <p className="text-sm text-muted-foreground">
          Listen to my recordings and music. Enjoy the tunes!
        </p>
      </header>
      
      <MusicPlayer />
    
    </div>
  )
}
