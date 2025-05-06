"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Music, 
  Search, 
  Edit, 
  Trash, 
  Download, 
  Play, 
  Pause,
  Filter,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  Mic,
  FileAudio
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db, storage } from "@/lib/firebase/firebase-config"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { AudioTrack } from "@/lib/audio/howler-service"
import { ColorCover } from "@/components/playground/ColorCover"
import howlerService from "@/lib/audio/howler-service"
import { getAllAudioItems, AudioCollectionType, deleteAudioItem, updateAudioItem } from "@/lib/firebase/tracks"
import { cn } from "@/lib/utils"

export function ManageLibrary() {
  const [audioItems, setAudioItems] = useState<AudioTrack[]>([])
  const [filteredAudioItems, setFilteredAudioItems] = useState<AudioTrack[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingTrack, setEditingTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [trackToDelete, setTrackToDelete] = useState<AudioTrack | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const { toast } = useToast()

  // Fetch audio items from Firestore
  useEffect(() => {
    fetchAudioItems()
  }, [])

  // Filter tracks when search query or category changes
  useEffect(() => {
    filterAudioItems()
  }, [searchQuery, selectedCategory, audioItems])

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      howlerService.stop()
      howlerService.destroy()
    }
  }, [])

  const fetchAudioItems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get tracks from Firestore
      const fetchedTracks = await getAllAudioItems("tracks")
      
      // Get voice memos from Firestore
      const fetchedVoiceMemos = await getAllAudioItems("voice_memo")
      
      // Combine all audio items
      const allAudio = [...fetchedTracks, ...fetchedVoiceMemos]
      setAudioItems(allAudio)
      
      // Extract unique categories from all audio items
      const uniqueCategories = Array.from(
        new Set(allAudio.map(item => item.category || "Uncategorized"))
      ).sort()
      
      setCategories(uniqueCategories)
      
      // Initialize filtered list
      filterAudioItems()
      
    } catch (error) {
      console.error("Error fetching audio items:", error)
      setError("Failed to load audio items. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const filterAudioItems = () => {
    let filtered = [...audioItems]
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        item => 
          (item.title || "").toLowerCase().includes(query) ||
          (item.artist || "").toLowerCase().includes(query)
      )
    }
    
    // Update filtered state
    setFilteredAudioItems(filtered)
  }

  const handleEdit = (track: AudioTrack) => {
    setEditingTrack(track)
  }

  const handleDeleteClick = (track: AudioTrack) => {
    setTrackToDelete(track)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTrack = async () => {
    if (!trackToDelete) return
    
    try {
      setIsDeleting(true)
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'tracks', trackToDelete.id))
      
      // Delete from Storage if URL exists
      if (trackToDelete.url) {
        try {
          const fileRef = ref(storage, trackToDelete.url)
          await deleteObject(fileRef)
        } catch (error) {
          console.error("Error deleting audio file:", error)
          // Continue even if file deletion fails
        }
      }
      
      // Delete cover image if exists
      if (trackToDelete.coverImage) {
        try {
          const coverRef = ref(storage, trackToDelete.coverImage)
          await deleteObject(coverRef)
        } catch (error) {
          console.error("Error deleting cover image:", error)
          // Continue even if image deletion fails
        }
      }
      
      // Update state
      setAudioItems(prev => prev.filter(t => t.id !== trackToDelete.id))
      setFilteredAudioItems(prev => prev.filter(t => t.id !== trackToDelete.id))
      
      // Stop playback if this was the playing track
      if (currentPlayingId === trackToDelete.id) {
        setCurrentPlayingId(null)
      }
      
      toast({
        title: "Track deleted",
        description: `"${trackToDelete.title}" has been removed from your library.`
      })
      
      // Close dialog
      setIsDeleteDialogOpen(false)
      setTrackToDelete(null)
    } catch (error) {
      console.error("Error deleting track:", error)
      toast({
        title: "Error",
        description: "Failed to delete track. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveTrack = async (updatedTrack: AudioTrack) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'tracks', updatedTrack.id), {
        title: updatedTrack.title,
        artist: updatedTrack.artist,
        category: updatedTrack.category,
        isPremium: updatedTrack.isPremium
      })
      
      // Update local state
      setAudioItems(prev => 
        prev.map(t => t.id === updatedTrack.id ? updatedTrack : t)
      )
      setFilteredAudioItems(prev => 
        prev.map(t => t.id === updatedTrack.id ? updatedTrack : t)
      )
      
      setEditingTrack(null)
      
      toast({
        title: "Track updated",
        description: `"${updatedTrack.title}" has been updated.`,
      })
    } catch (error) {
      console.error("Error updating track:", error)
      toast({
        title: "Error",
        description: "Failed to update track. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handlePlayPreview = (track: AudioTrack) => {
    if (isPlaying && currentPlayingId === track.id) {
      // Already playing this track, pause it
      setIsPlaying(false)
      setCurrentPlayingId(null)
      
      // Stop audio
      const audio = document.getElementById('preview-audio') as HTMLAudioElement
      if (audio) {
        audio.pause()
      }
    } else {
      // Play this track
      setIsPlaying(true)
      setCurrentPlayingId(track.id)
      
      // Play audio
      const audio = document.getElementById('preview-audio') as HTMLAudioElement
      if (audio) {
        try {
          // Create a new audio element instead of reusing the existing one
          // This can help bypass some CSP caching issues
          const tempAudio = new Audio()
          tempAudio.src = track.url
          tempAudio.oncanplay = () => {
            // If the temp audio can play, update the main audio element
            audio.src = track.url
            audio.play().catch(error => {
              handlePlaybackError(error, track)
            })
          }
          
          tempAudio.onerror = (error) => {
            handlePlaybackError(error, track)
          }
        } catch (error) {
          handlePlaybackError(error, track)
        }
      }
    }
  }
  
  const handlePlaybackError = (error: any, track: AudioTrack) => {
    console.error("Error playing track:", track.id, error)
    setIsPlaying(false)
    setCurrentPlayingId(null)
    
    toast({
      title: "Playback Error",
      description: "Unable to play this audio. This may be due to Content Security Policy restrictions in development.",
      variant: "destructive"
    })
  }

  const handleStopPlayback = () => {
    howlerService.stop()
    setIsPlaying(false)
    setCurrentPlayingId(null)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      
      <div>
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Audio Library</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Category filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audio..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Refresh button */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchAudioItems}
              disabled={isLoading}
              title="Refresh audio library"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
          </div>
        ) : filteredAudioItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/20">
            <Music className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">No audio items found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your filters"
                : "Upload some audio to get started"}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "40%" }}>Title</TableHead>
                  <TableHead style={{ width: "20%" }}>Artist</TableHead>
                  <TableHead style={{ width: "15%" }}>Category</TableHead>
                  <TableHead style={{ width: "10%" }}>Duration</TableHead>
                  <TableHead style={{ width: "15%" }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudioItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {item.coverImage ? (
                          <img 
                            src={item.coverImage} 
                            alt={item.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <ColorCover 
                            title={item.title}
                            artist={item.artist}
                            size="sm"
                            isPremium={item.isPremium}
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            {item.isVoiceMemo ? (
                              <Mic className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Music className="h-4 w-4 text-purple-500" />
                            )}
                            <span>{item.title}</span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            {item.isPremium && (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                Premium
                              </span>
                            )}
                            {item.isVoiceMemo && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                Voice Memo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.isVoiceMemo ? "Recorded by " : ""}{item.artist}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{formatTime(item.duration)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePlayPreview(item)}
                          disabled={isPlaying && currentPlayingId !== item.id}
                          title={isPlaying && currentPlayingId === item.id ? "Pause" : "Play"}
                        >
                          {isPlaying && currentPlayingId === item.id ? (
                            <Pause className="h-4 w-4 text-primary" />
                          ) : (
                            <Play className="h-4 w-4 text-primary" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
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
        )}
      </div>
      
      {/* Edit track dialog */}
      <Dialog open={!!editingTrack} onOpenChange={(open) => !open && setEditingTrack(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingTrack?.isVoiceMemo ? "Voice Memo" : "Track"}</DialogTitle>
            <DialogDescription>
              Update information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editingTrack?.title || ""}
                onChange={(e) => {
                  if (editingTrack) {
                    setEditingTrack({ ...editingTrack, title: e.target.value })
                  }
                }}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="artist">
                {editingTrack?.isVoiceMemo ? "Recorded By" : "Artist"}
              </Label>
              <Input
                id="artist"
                value={editingTrack?.artist || ""}
                onChange={(e) => {
                  if (editingTrack) {
                    setEditingTrack({ ...editingTrack, artist: e.target.value })
                  }
                }}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editingTrack?.category || ""}
                onValueChange={(value) => {
                  if (editingTrack) {
                    setEditingTrack({ ...editingTrack, category: value })
                  }
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
                checked={editingTrack?.isPremium || false}
                onCheckedChange={(checked) => {
                  if (editingTrack) {
                    setEditingTrack({ ...editingTrack, isPremium: checked === true })
                  }
                }}
              />
              <Label htmlFor="isPremium">Premium Content</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTrack(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (editingTrack) {
                  handleSaveTrack(editingTrack)
                }
              }} 
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
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{trackToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTrack}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Track
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
