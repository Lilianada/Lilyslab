"use client"

import { Slider } from "@/components/ui/slider"

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (value: number) => void
  formatTime: (seconds: number) => string
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  formatTime
}: ProgressBarProps) {
  return (
    <div className="w-full mt-6">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 100}
        step={0.1}
        onValueChange={(value) => onSeek(value[0])}
        className="w-full"
      />
    </div>
  )
}
