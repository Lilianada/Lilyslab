"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Play, 
  Pause, 
  Edit, 
  Trash,
  Mic,
  FileAudio,
} from "lucide-react"
import { AudioTrack } from "@/lib/audio/howler-service"
import { cn } from "@/lib/utils"

interface AudioTableProps {
  audioItems: AudioTrack[]
  currentPreviewTrack: AudioTrack | null
  isPlaying: boolean
  selectedTracks: Set<string>
  onSelectTrack: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onPlayPreview: (track: AudioTrack) => void
  onEdit: (track: AudioTrack) => void
  onDelete: (track: AudioTrack) => void
  formatTime: (seconds: number) => string
}

export function AudioTable({
  audioItems,
  currentPreviewTrack,
  isPlaying,
  selectedTracks,
  onSelectTrack,
  onSelectAll,
  onPlayPreview,
  onEdit,
  onDelete,
  formatTime
}: AudioTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={selectedTracks.size > 0 && selectedTracks.size === audioItems.length}
                onCheckedChange={(checked) => onSelectAll(checked === true)}
              />
            </TableHead>
            <TableHead style={{ width: "40%" }}>Title</TableHead>
            <TableHead style={{ width: "20%" }}>Artist</TableHead>
            <TableHead style={{ width: "15%" }}>Category</TableHead>
            <TableHead style={{ width: "10%" }}>Duration</TableHead>
            <TableHead style={{ width: "15%" }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audioItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedTracks.has(item.id)}
                  onCheckedChange={(checked) => onSelectTrack(item.id, checked === true)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {item.isVoiceMemo ? (
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FileAudio className="h-4 w-4 text-muted-foreground" />
                  )}
                  {item.title}
                  {item.isPremium && (
                    <span className="ml-2 rounded-full bg-yellow-200 px-2 py-0.5 text-xs text-yellow-700">
                      Premium
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {item.artist}
              </TableCell>
              <TableCell>{item.category || "Uncategorized"}</TableCell>
              <TableCell>{formatTime(item.duration)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPlayPreview(item)}
                    disabled={isPlaying && currentPreviewTrack?.id !== item.id}
                    title={isPlaying && currentPreviewTrack?.id === item.id ? "Pause" : "Play"}
                  >
                    {isPlaying && currentPreviewTrack?.id === item.id ? (
                      <Pause className="h-4 w-4 text-primary" />
                    ) : (
                      <Play className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
