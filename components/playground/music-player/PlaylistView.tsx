"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Download, RefreshCw } from "lucide-react"
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
    <div className="h-full flex flex-col bg-card/80 backdrop-blur-sm border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Playlist</h3>
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
      <div className="p-4 border-b">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-background/70 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
        >
          <option value="all">All Categories</option>
          {categories.filter(category => category !== "all").map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      {/* Track list */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full flex-1">
           <RefreshCw className={cn("h-4 w-4 m-2", isLoading && "animate-spin")} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full flex-1 p-6 text-center">
            <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Unable to Load Tracks</h3>
            <p className="text-sm text-muted-foreground max-w-md">{error}</p>
            <p className="text-xs text-muted-foreground mt-4">Try refreshing the page or check back later.</p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full flex-1 p-6 text-center">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Music Available Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">There are no audio tracks in your library matching the current filter.</p>
            {selectedCategory !== 'all' && (
              <button 
                onClick={() => onCategoryChange('all')} 
                className="mt-4 text-sm text-primary hover:underline"
              >
                View all tracks instead
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-2 px-4 space-y-2">
            {filteredTracks.map((track) => (
              <div 
                key={track.id}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-md hover:bg-card/90 cursor-pointer transition-all",
                  currentTrack?.id === track.id && "bg-primary/10 border-primary shadow-sm"
                )}
                onClick={() => onTrackSelect(track)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {track.coverImage ? (
                    <img 
                      src={track.coverImage} 
                      alt={track.title}
                      className="w-12 h-12 object-cover rounded-md shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <ColorCover 
                      title={track.title}
                      artist={track.artist}
                      size="sm"
                      isPremium={track.isPremium}
                      className="w-12 h-12 rounded-md shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist} • {formatTime(track.duration)}</p>
                  </div>
                </div>
                <div className="flex items-center ml-2">
                  {track.isPremium && (
                    <span className="mr-2 text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                      Premium
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => onDownload(track, e)}
                    title="Download track"
                    className="h-8 w-8 rounded-full hover:bg-background/80"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
