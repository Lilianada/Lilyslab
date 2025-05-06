"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX } from "lucide-react"

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (value: number[]) => void
  onToggleMute: () => void
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>
      
      <Slider
        value={[volume]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={onVolumeChange}
        className="w-24"
      />
    </div>
  )
}
