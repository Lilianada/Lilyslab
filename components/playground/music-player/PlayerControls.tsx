"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

interface PlayerControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onSkipForward: () => void
  onSkipBackward: () => void
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBackward
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSkipBackward}
        title="Skip back 10 seconds"
      >
        <SkipBack size={20} />
      </Button>
      
      <Button
        variant="default"
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onSkipForward}
        title="Skip forward 10 seconds"
      >
        <SkipForward size={20} />
      </Button>
    </div>
  )
}
