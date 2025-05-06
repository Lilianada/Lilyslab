"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Download } from "lucide-react"
import { ColorCover } from "../ColorCover"
import { AudioTrack } from "@/lib/audio/howler-service"

interface PlaylistViewProps {
  isLoading: boolean
  error: string | null
  selectedCategory: string
  categories: string[]
  filteredTracks: AudioTrack[]
  currentTrack: AudioTrack | null
  onCategoryChange: (category: string) => void
  onTrackSelect: (track: AudioTrack) => void
  onDownload: (track: AudioTrack, e: React.MouseEvent) => void
  onHidePlaylist: () => void
  formatTime: (seconds: number) => string
}

export function PlaylistView({
  isLoading,
  error,
  selectedCategory,
  categories,
  filteredTracks,
  currentTrack,
  onCategoryChange,
  onTrackSelect,
  onDownload,
  onHidePlaylist,
  formatTime
}: PlaylistViewProps) {
  return (
    <div className="w-full md:w-1/3 bg-card border rounded-lg p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Playlist</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onHidePlaylist}
          className="md:hidden"
        >
          <ChevronDown size={20} />
        </Button>
      </div>
      
      {/* Category filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-background border rounded px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      {/* Track list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">No tracks found</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredTracks.map((track) => (
            <div 
              key={track.id}
              className={cn(
                "flex items-center justify-between p-2 border rounded-md hover:bg-muted cursor-pointer",
                currentTrack?.id === track.id && "bg-muted border-primary"
              )}
              onClick={() => onTrackSelect(track)}
            >
              <div className="flex items-center gap-3">
                {track.coverImage ? (
                  <img 
                    src={track.coverImage} 
                    alt={track.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <ColorCover 
                    title={track.title}
                    artist={track.artist}
                    size="sm"
                    isPremium={track.isPremium}
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{track.artist} • {formatTime(track.duration)}</p>
                </div>
              </div>
              <div className="flex items-center">
                {track.isPremium && (
                  <span className="mr-2 text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                    Premium
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onDownload(track, e)}
                  title="Download track"
                >
                  <Download size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
