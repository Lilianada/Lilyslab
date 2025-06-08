"use client"

import { lazy, Suspense } from "react"

// Lazy load the heavy MusicPlayer component
const MusicPlayer = lazy(() => import("@/components/playground/music-player").then(mod => ({ default: mod.MusicPlayer })))

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
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/30">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading music player...</p>
          </div>
        </div>
      }>
        <MusicPlayer />
      </Suspense>
    </div>
    </div>
  )
}
