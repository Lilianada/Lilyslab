"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RefreshCw } from "lucide-react"
import { AudioTrack } from "@/lib/audio/howler-service"

interface EditTrackDialogProps {
  track: AudioTrack | null
  categories: string[]
  isLoading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (track: AudioTrack) => void
}

export function EditTrackDialog({
  track,
  categories,
  isLoading,
  open,
  onOpenChange,
  onSave
}: EditTrackDialogProps) {
  const [editingTrack, setEditingTrack] = useState<AudioTrack | null>(track)

  // Update local state when track prop changes
  if (track !== null && (editingTrack === null || track.id !== editingTrack.id)) {
    setEditingTrack({ ...track })
  }

  if (!editingTrack) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Track</DialogTitle>
          <DialogDescription>
            Update the details for this audio track.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editingTrack.title}
              onChange={(e) => {
                setEditingTrack({ ...editingTrack, title: e.target.value })
              }}
              placeholder="Track title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={editingTrack.displayName || editingTrack.title}
              onChange={(e) => {
                setEditingTrack({ ...editingTrack, displayName: e.target.value })
              }}
              placeholder="How the track should be displayed"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="artist">
              {editingTrack.isVoiceMemo ? "Recorded By" : "Artist"}
            </Label>
            <Input
              id="artist"
              value={editingTrack.artist}
              onChange={(e) => {
                setEditingTrack({ ...editingTrack, artist: e.target.value })
              }}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={editingTrack.category || ""}
              onValueChange={(value) => {
                setEditingTrack({ ...editingTrack, category: value })
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPremium"
              checked={editingTrack.isPremium}
              onCheckedChange={(checked) => {
                setEditingTrack({ ...editingTrack, isPremium: checked === true })
              }}
            />
            <Label htmlFor="isPremium">Premium Content</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSave(editingTrack)} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
