"use client"

import { MusicPlayer } from "@/components/playground/music-player"

export default function MusicPlayerPage() {
  return (
    <div className=" animate-fade-in">
      <div className="max-w-3xl mx-auto sm:px-4 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Music Player</h1>
        <p className="text-sm text-muted-foreground">
          Listen to my recordings and music. Enjoy the tunes!
        </p>
      </header>
      
      <MusicPlayer />
    </div>
    </div>
  )
}
