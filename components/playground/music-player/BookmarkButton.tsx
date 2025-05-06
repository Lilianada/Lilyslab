"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Bookmark } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { saveBookmark } from "@/lib/firebase/bookmarks"
import { useToast } from "@/hooks/use-toast"

interface BookmarkButtonProps {
  isDisabled: boolean
  showDialog: boolean
  setShowDialog: (show: boolean) => void
  currentTime: number
  bookmarkLabel: string
  setBookmarkLabel: (label: string) => void
  addBookmark: () => void
  formatTime: (seconds: number) => string
  currentTrackId?: string
}

export function BookmarkButton({
  isDisabled,
  showDialog,
  setShowDialog,
  currentTime,
  bookmarkLabel,
  setBookmarkLabel,
  addBookmark,
  formatTime,
  currentTrackId
}: BookmarkButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  
  const handleSaveBookmark = async () => {
    if (!user || !currentTrackId) return
    
    setIsSaving(true)
    
    try {
      // Save to Firebase
      await saveBookmark(
        user.uid,
        currentTrackId,
        currentTime,
        bookmarkLabel || `Bookmark at ${formatTime(currentTime)}`
      )
      
      // Call the parent component's addBookmark function
      // which updates the local state
      addBookmark()
      
      toast({
        title: "Bookmark saved",
        description: `Bookmark added at ${formatTime(currentTime)}`,
      })
    } catch (error) {
      console.error("Error saving bookmark:", error)
      toast({
        title: "Error",
        description: "Failed to save bookmark. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          title={isDisabled ? "Sign in to bookmark" : "Add bookmark"}
        >
          <Bookmark size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
          <DialogDescription>
            Bookmark this position ({formatTime(currentTime)}) for later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Label</label>
            <input
              type="text"
              placeholder="Optional label for this bookmark"
              value={bookmarkLabel}
              onChange={(e) => setBookmarkLabel(e.target.value)}
              className="w-full border rounded-md px-3 py-2 bg-background"
            />
          </div>
          <Button 
            onClick={handleSaveBookmark} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Bookmark"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
