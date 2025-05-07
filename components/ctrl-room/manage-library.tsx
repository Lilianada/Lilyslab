"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Music, 
  Search, 
  Trash, 
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AudioTrack } from "@/lib/audio/howler-service"
import howlerService from "@/lib/audio/howler-service"
import { getAudioFromCloudinary, deleteAudioFromCloudinary, updateAudioMetadata } from "@/lib/cloudinary/audio-service"
import { cn } from "@/lib/utils"
import { AudioTable } from "./audio-table"
import { EditTrackDialog } from "./edit-track-dialog"
import { DeleteDialog } from "./delete-dialog"

export function ManageLibrary() {
  const [audioItems, setAudioItems] = useState<AudioTrack[]>([])
  const [filteredAudioItems, setFilteredAudioItems] = useState<AudioTrack[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentPreviewTrack, setCurrentPreviewTrack] = useState<AudioTrack | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [trackToDelete, setTrackToDelete] = useState<AudioTrack | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [editingTrack, setEditingTrack] = useState<AudioTrack | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set())
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState<boolean>(false)
  const { toast } = useToast()

  // Fetch audio items on component mount
  useEffect(() => {
    fetchAudioItems()
  }, [])

  // Filter tracks when search term or category changes
  useEffect(() => {
    filterAudioItems()
  }, [searchTerm, selectedCategory, audioItems])

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
      
      // Fetch tracks from Cloudinary
      const fetchedTracks = await getAudioFromCloudinary(false)
      const fetchedVoiceMemos = await getAudioFromCloudinary(true)
      const allAudio = [...fetchedTracks, ...fetchedVoiceMemos]
      setAudioItems(allAudio)
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(allAudio.map(item => item.category || "Uncategorized"))
      ).sort()
      
      setCategories(uniqueCategories)
      
      // Clear selected tracks when refreshing
      setSelectedTracks(new Set())
      
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
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    // Filter by search term
    if (searchTerm && searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.artist.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
      )
    }
    
    setFilteredAudioItems(filtered)
  }

  const handleEdit = (track: AudioTrack) => {
    setEditingTrack(track)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (track: AudioTrack) => {
    setTrackToDelete(track)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTrack = async () => {
    if (!trackToDelete) return
    
    try {
      setIsDeleting(true)
      
      // Delete from Cloudinary
      await deleteAudioFromCloudinary(trackToDelete.id)
      
      // Update state
      setAudioItems(prev => prev.filter(item => item.id !== trackToDelete.id))
      
      // Remove from selected tracks if it was selected
      if (selectedTracks.has(trackToDelete.id)) {
        const newSelected = new Set(selectedTracks)
        newSelected.delete(trackToDelete.id)
        setSelectedTracks(newSelected)
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
      setIsLoading(true)
      
      // Update track in Cloudinary
      await updateAudioMetadata(updatedTrack)
      
      // Update state
      setAudioItems(prev => 
        prev.map(t => t.id === updatedTrack.id ? updatedTrack : t)
      )
      
      setIsEditDialogOpen(false)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPreview = async (track: AudioTrack) => {
    try {
      if (isPlaying) {
        // Stop playback if we're already playing
        if (currentPreviewTrack?.id === track.id) {
          // If this is the current track, stop it
          handleStopPlayback()
          return
        } else {
          // If a different track is playing, stop it first
          handleStopPlayback()
          // Then continue to play the new track
        }
      }
      
      // Set the new track as current
      setCurrentPreviewTrack(track)
      
      // Play the track using Howler service
      await howlerService.loadTrack(track)
      howlerService.play()
      setIsPlaying(true)
      
      toast({
        title: "Now Playing",
        description: `${track.title} by ${track.artist}`,
      })
    } catch (error) {
      handlePlaybackError(error, track)
    }
  }

  const handlePlaybackError = (error: any, track: AudioTrack) => {
    console.error("Error playing track:", track.id, error)
    setIsPlaying(false)
    setCurrentPreviewTrack(null)
    
    toast({
      title: "Playback Error",
      description: `Could not play "${track.title}". The file may be missing or corrupted.`,
      variant: "destructive"
    })
  }

  const handleStopPlayback = () => {
    setIsPlaying(false)
    setCurrentPreviewTrack(null)
    howlerService.stop()
  }

  const handleBatchDelete = async () => {
    try {
      setIsDeleting(true)
      
      // Delete all selected tracks
      const deletePromises = Array.from(selectedTracks).map(id => {
        const track = audioItems.find(item => item.id === id)
        if (track) {
          return deleteAudioFromCloudinary(id)
        }
        return Promise.resolve()
      })
      
      await Promise.all(deletePromises)
      
      // Update state
      setAudioItems(prev => prev.filter(item => !selectedTracks.has(item.id)))
      
      toast({
        title: "Tracks Deleted",
        description: `${selectedTracks.size} tracks have been removed from your library.`,
      })
      
      // Clear selection and close dialog
      setSelectedTracks(new Set())
      setIsBatchDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting tracks:", error)
      toast({
        title: "Error",
        description: "Failed to delete tracks. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSelectTrack = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTracks)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedTracks(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all filtered tracks
      const allIds = new Set(filteredAudioItems.map(track => track.id))
      setSelectedTracks(allIds)
    } else {
      // Deselect all tracks
      setSelectedTracks(new Set())
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Audio Library</h2>
        
        {selectedTracks.size > 0 && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setIsBatchDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Selected ({selectedTracks.size})
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAudioItems}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by title, artist, or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredAudioItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No audio items found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your filters"
              : "Upload some audio to get started"}
          </p>
        </div>
      ) : (
        <AudioTable 
          audioItems={filteredAudioItems}
          currentPreviewTrack={currentPreviewTrack}
          isPlaying={isPlaying}
          selectedTracks={selectedTracks}
          onSelectTrack={handleSelectTrack}
          onSelectAll={handleSelectAll}
          onPlayPreview={handlePlayPreview}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          formatTime={formatTime}
        />
      )}
      
      {/* Edit Track Dialog */}
      <EditTrackDialog 
        track={editingTrack}
        categories={categories}
        isLoading={isLoading}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveTrack}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        trackToDelete={trackToDelete}
        isDeleting={isDeleting}
        onDelete={handleDeleteTrack}
      />
      
      {/* Batch Delete Confirmation Dialog */}
      <DeleteDialog
        open={isBatchDeleteDialogOpen}
        onOpenChange={setIsBatchDeleteDialogOpen}
        trackToDelete={null}
        isDeleting={isDeleting}
        onDelete={handleBatchDelete}
        isBatch={true}
        selectedCount={selectedTracks.size}
      />
    </div>
  )
}
