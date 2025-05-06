"use client"

import { Button } from "@/components/ui/button"
import { Repeat } from "lucide-react"

interface PlaybackOptionsProps {
  speed: number
  isLooping: boolean
  onSpeedChange: (speed: number) => void
  onToggleLoop: () => void
}

export function PlaybackOptions({
  speed,
  isLooping,
  onSpeedChange,
  onToggleLoop
}: PlaybackOptionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isLooping ? "default" : "ghost"}
        size="icon"
        onClick={onToggleLoop}
        title={isLooping ? "Disable loop" : "Enable loop"}
      >
        <Repeat size={20} />
      </Button>
      
      <select
        value={speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        className="bg-background border rounded px-2 py-1 text-sm"
      >
        <option value="0.5">0.5x</option>
        <option value="0.75">0.75x</option>
        <option value="1">1x</option>
        <option value="1.25">1.25x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>
    </div>
  )
}
