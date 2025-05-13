"use client"

import { cn } from "@/lib/utils"

interface PlayerControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onSkipForward: () => void
  onSkipBackward: () => void
  onPreviousTrack: () => void
  onNextTrack: () => void
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPreviousTrack,
  onNextTrack
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-12 md:gap-16 w-full max-w-md mx-auto py-4">
      {/* Previous Track Button */}
      <button
        onClick={onPreviousTrack}
        title="Previous track"
        className="text-white hover:text-white/80 transition-colors focus:outline-none"
        aria-label="Previous track"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7,6V18L2,12L7,6z M9,18l11-6L9,6V18z"/>
        </svg>
      </button>
      
      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        className="text-white hover:text-white/80 transition-colors focus:outline-none"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6,5L6,19L10,19L10,5L6,5zM14,5L14,19L18,19L18,5L14,5z"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8,5L8,19L19,12L8,5z"/>
          </svg>
        )}
      </button>
      
      {/* Next Track Button */}
      <button
        onClick={onNextTrack}
        title="Next track"
        className="text-white hover:text-white/80 transition-colors focus:outline-none"
        aria-label="Next track"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,6V18L22,12L17,6z M15,18L4,12L15,6V18z"/>
        </svg>
      </button>
    </div>
  )
}
