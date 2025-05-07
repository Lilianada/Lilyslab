"use client"

import { useState, useEffect } from "react"
import { List, Music, RefreshCw, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ColorCover } from "../ColorCover"
import howlerService, { AudioTrack, PlaybackState } from "@/lib/audio/howler-service"
import { getAudioFromCloudinary } from "@/lib/cloudinary/audio-service"

// Import sub-components
import { PlayerControls } from "./PlayerControls"
import { ProgressBar } from "./ProgressBar"
import { VolumeControl } from "./VolumeControl"
import { PlaybackOptions } from "./PlaybackOptions"
import { TrackInfo } from "./TrackInfo"
import { PlaylistView } from "./PlaylistView"
import { BuyMeCoffeeDialog } from "./BuyMeCoffeeDialog"

export function MusicPlayer() {
  // State for tracks and playlists
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [filteredTracks, setFilteredTracks] = useState<AudioTrack[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for current playback
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    muted: false,
    speed: 1,
    loop: false
  })
  
  // UI state
  const [showPlaylist, setShowPlaylist] = useState(true)
  const [showBuyMeCoffeeDialog, setShowBuyMeCoffeeDialog] = useState(false)
  
  // Auth and toast
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Load tracks from Cloudinary
  useEffect(() => {
    fetchTracks()
    
    // Set up event listeners for howler service
    setupHowlerListeners()
    
    // Cleanup
    return () => {
      cleanupHowlerListeners()
      howlerService.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Filter tracks when search or category changes
  useEffect(() => {
    filterTracks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, tracks])
  
  const fetchTracks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch tracks from Cloudinary
      const fetchedTracks = await getAudioFromCloudinary(false) // Regular tracks
      const fetchedVoiceMemos = await getAudioFromCloudinary(true) // Voice memos
      
      // Combine all audio items
      const allAudio = [...fetchedTracks, ...fetchedVoiceMemos]
      
      if (allAudio.length === 0) {
        setError("No audio tracks found in your Cloudinary library.")
        setTracks([])
        setFilteredTracks([])
        return
      }
      
      // Sort tracks by title
      const sortedTracks = allAudio.sort((a, b) => 
        a.title.localeCompare(b.title)
      )
      setTracks(sortedTracks)
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(sortedTracks.map((track) => track.category || 'Uncategorized'))
      ).sort() as string[]
      uniqueCategories.unshift('all')
      setCategories(uniqueCategories)
      
      // Set a default track
      if (sortedTracks.length > 0 && !currentTrack) {
        setCurrentTrack(sortedTracks[0])
        await howlerService.loadTrack(sortedTracks[0])
      }
      
      setFilteredTracks(sortedTracks)
    } catch (error) {
      console.error("Error loading tracks:", error)
      
      // Handle different error types with user-friendly messages
      if (error instanceof Error) {
        // Network errors
        if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT') || error.message.includes('network')) {
          setError("Unable to connect to the audio service. Please check your internet connection and try again.")
        }
        // Authentication errors
        else if (error.message.includes('authentication') || error.message.includes('credentials') || error.message.includes('401')) {
          setError("Authentication failed with the audio service. Please contact an administrator.")
        }
        // API errors
        else if (typeof error.message === 'string' && error.message.includes('Failed to fetch')) {
          setError("No music available yet. Check back later or upload some tracks in the control room.")
        }
        // Generic error
        else {
          setError("Failed to load tracks. Please try again later.")
        }
      } else {
        // If it's not an Error object
        setError("No music available yet. Check back later or upload some tracks in the control room.")
      }
      
      setTracks([])
      setFilteredTracks([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter tracks based on search query and category
  const filterTracks = () => {
    if (!tracks.length) return
    
    let result = [...tracks]
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(track => 
        track.title.toLowerCase().includes(query) || 
        track.artist.toLowerCase().includes(query)
      )
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(track => track.category === selectedCategory)
    }
    
    setFilteredTracks(result)
  }
  
  // Set up Howler event listeners
  const setupHowlerListeners = () => {
    howlerService.on('play', () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: true }))
    })
    
    howlerService.on('pause', () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: false }))
    })
    
    howlerService.on('stop', () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
    })
    
    howlerService.on('end', () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: false }))
      // Auto play next track
      playNextTrack()
    })
    
    howlerService.on('timeupdate', (position: number) => {
      setPlaybackState(prev => ({ ...prev, currentTime: position }))
    })
    
    howlerService.on('load', (duration: number) => {
      setPlaybackState(prev => ({ ...prev, duration }))
    })
    
    howlerService.on('error', (message: string) => {
      toast({
        title: "Playback Error",
        description: message,
        variant: "destructive"
      })
    })
  }
  
  // Clean up Howler event listeners
  const cleanupHowlerListeners = () => {
    // Using empty function as callback since we're removing all listeners
    const noop = () => {}
    howlerService.off('play', noop)
    howlerService.off('pause', noop)
    howlerService.off('stop', noop)
    howlerService.off('end', noop)
    howlerService.off('timeupdate', noop)
    howlerService.off('load', noop)
    howlerService.off('error', noop)
  }
  
  // Play/pause functions
  const togglePlayPause = () => {
    if (!currentTrack) return
    
    if (playbackState.isPlaying) {
      howlerService.pause()
    } else {
      howlerService.play()
    }
  }
  
  // Track selection
  const playTrack = async (track: AudioTrack) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlayPause()
      return
    }
    
    try {
      setCurrentTrack(track)
      
      // Update playback state
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        duration: 0
      }))
      
      // Load and play the track
      await howlerService.loadTrack(track)
      howlerService.play()
      
      // If premium track and user not logged in, show buy me coffee dialog
      if (track.isPremium && !user) {
        setShowBuyMeCoffeeDialog(true)
        howlerService.pause()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to play track. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  // Navigation functions
  const playNextTrack = () => {
    if (!currentTrack || filteredTracks.length === 0) return
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
    if (currentIndex < filteredTracks.length - 1) {
      playTrack(filteredTracks[currentIndex + 1])
    } else {
      playTrack(filteredTracks[0]) // Loop back to the first track
    }
  }
  
  const playPreviousTrack = () => {
    if (!currentTrack || filteredTracks.length === 0) return
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
    if (currentIndex > 0) {
      playTrack(filteredTracks[currentIndex - 1])
    } else {
      playTrack(filteredTracks[filteredTracks.length - 1]) // Loop to the last track
    }
  }
  
  // Seek functions
  const seekTo = (time: number) => {
    howlerService.seek(time)
  }
  
  const skipForward = () => {
    const newTime = Math.min(playbackState.currentTime + 10, playbackState.duration)
    seekTo(newTime)
  }
  
  const skipBackward = () => {
    const newTime = Math.max(playbackState.currentTime - 10, 0)
    seekTo(newTime)
  }
  
  // Volume functions
  const toggleMute = () => {
    if (playbackState.muted) {
      setPlaybackState(prev => ({ ...prev, muted: false }))
      howlerService.setMuted(false)
    } else {
      setPlaybackState(prev => ({ ...prev, muted: true }))
      howlerService.setMuted(true)
    }
  }
  
  const changeVolume = (value: number[]) => {
    const volume = value[0]
    if (playbackState.muted) {
      setPlaybackState(prev => ({ 
        ...prev, 
        volume, 
        muted: false 
      }))
      howlerService.setMuted(false)
    } else {
      setPlaybackState(prev => ({ ...prev, volume }))
    }
    howlerService.setVolume(volume)
  }
  
  // Playback speed
  const changeSpeed = (speed: number) => {
    setPlaybackState(prev => ({ ...prev, speed }))
    // Use the correct method for setting playback rate
    howlerService.setPlaybackRate(speed)
  }
  
  // Loop toggle
  const toggleLoop = () => {
    const newLoopState = !playbackState.loop
    setPlaybackState(prev => ({ ...prev, loop: newLoopState }))
    howlerService.setLoop(newLoopState)
  }
  
  // Download track
  const downloadTrack = (track: AudioTrack, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Check if premium content
    if (track.isPremium && !user) {
      setShowBuyMeCoffeeDialog(true)
      return
    }
    
    try {
      // Create a temporary anchor element
      const anchor = document.createElement('a')
      anchor.href = track.url
      anchor.download = `${track.artist} - ${track.title}.mp3`
      anchor.target = '_blank'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      
      toast({
        title: "Download Started",
        description: `Downloading ${track.title}`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the track. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
      {/* Player Section */}
      <div className={cn(
        "flex-1 bg-card/90 backdrop-blur-sm border rounded-lg overflow-hidden shadow-md",
        showPlaylist ? "w-full md:w-2/3" : "w-full"
      )}>
        <div className="flex flex-col h-full p-6">
          {currentTrack ? (
            <>
              {/* Track Info */}
              <div className="flex items-center justify-center mt-6">
                <TrackInfo
                  track={currentTrack}
                />
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <ProgressBar
                  currentTime={playbackState.currentTime}
                  duration={playbackState.duration}
                  formatTime={formatTime}
                  onSeek={seekTo}
                />
              </div>
              
              {/* Player Controls */}
              <div className="mb-6">
                <PlayerControls
                  isPlaying={playbackState.isPlaying}
                  onPlayPause={togglePlayPause}
                  onSkipForward={skipForward}
                  onSkipBackward={skipBackward}
                />
              </div>
              
              {/* Additional Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={playPreviousTrack}
                    title="Previous track"
                    className="rounded-full px-4"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={playNextTrack}
                    title="Next track"
                    className="rounded-full px-4"
                  >
                    Next
                  </Button>
                </div>
                
                {/* Volume Control */}
                <VolumeControl
                  volume={playbackState.volume}
                  isMuted={playbackState.muted}
                  onVolumeChange={changeVolume}
                  onToggleMute={toggleMute}
                />
                
                <div className="flex items-center gap-2">
                  {/* Playback Options */}
                  <PlaybackOptions 
                    speed={playbackState.speed}
                    isLooping={playbackState.loop}
                    onSpeedChange={changeSpeed}
                    onToggleLoop={toggleLoop}
                  />
                  
                  {/* Toggle Playlist Button (mobile only) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-full"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    title={showPlaylist ? "Hide playlist" : "Show playlist"}
                  >
                    <List size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Music size={64} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No track selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a track from the playlist to start listening
              </p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t text-xs text-muted-foreground text-center">
          Powered by Howler.js - a powerful audio library with excellent cross-browser compatibility
        </div>
      </div>
      
      {/* Playlist View */}
      {showPlaylist && (
        <div className="w-full md:w-1/3 h-full">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border rounded-lg mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search</h3>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchTracks}
                disabled={isLoading}
                title="Refresh tracks"
                className="h-8 w-8 rounded-full"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 bg-background/70 rounded-full"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <PlaylistView 
            isLoading={isLoading}
            error={error}
            selectedCategory={selectedCategory}
            categories={categories}
            filteredTracks={filteredTracks}
            currentTrack={currentTrack}
            onCategoryChange={setSelectedCategory}
            onTrackSelect={playTrack}
            onDownload={downloadTrack}
            onHidePlaylist={() => setShowPlaylist(false)}
            formatTime={formatTime}
          />
        </div>
      )}
      
      {/* Buy Me Coffee Dialog */}
      <BuyMeCoffeeDialog 
        isOpen={showBuyMeCoffeeDialog}
        onOpenChange={setShowBuyMeCoffeeDialog}
      />
    </div>
  )
}
