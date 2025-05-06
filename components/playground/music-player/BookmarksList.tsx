"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { AudioTrack } from "@/lib/audio/howler-service"

interface Bookmark {
  id: string;
  trackId: string;
  position: number;
  label: string;
  timestamp: number;
}

interface BookmarksListProps {
  bookmarks: Bookmark[];
  tracks: AudioTrack[];
  onJumpToBookmark: (bookmark: Bookmark) => void;
  formatTime: (seconds: number) => string;
}

export function BookmarksList({
  bookmarks,
  tracks,
  onJumpToBookmark,
  formatTime
}: BookmarksListProps) {
  if (bookmarks.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Your Bookmarks</h3>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => {
          const track = tracks.find(t => t.id === bookmark.trackId);
          return (
            <div 
              key={bookmark.id}
              className="flex items-center justify-between p-2 border rounded-md hover:bg-muted cursor-pointer"
              onClick={() => onJumpToBookmark(bookmark)}
            >
              <div>
                <p className="text-sm font-medium">{bookmark.label}</p>
                <p className="text-xs text-muted-foreground">
                  {track?.title || "Unknown track"} • {formatTime(bookmark.position)}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Play size={16} />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
