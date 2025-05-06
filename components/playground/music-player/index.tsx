"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { List, Music, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import howlerService, { AudioTrack } from "@/lib/audio/howler-service"
import { getAllAudioItems } from "@/lib/audio/local-tracks"

// Import sub-components
import { PlayerControls } from "./PlayerControls"
import { ProgressBar } from "./ProgressBar"
import { VolumeControl } from "./VolumeControl"
import { PlaybackOptions } from "./PlaybackOptions"
import { TrackInfo } from "./TrackInfo"
import { PlaylistView } from "./PlaylistView"
import { BuyMeCoffeeDialog } from "./BuyMeCoffeeDialog"


interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;
  loop: boolean;
}

export function MusicPlayer() {
  // State for tracks and playlists
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [filteredTracks, setFilteredTracks] = useState<AudioTrack[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
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
  
  // Load local audio tracks
  useEffect(() => {
    async function fetchTracks() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch all audio tracks from local files
        const allAudioItems = await getAllAudioItems()
        
        if (allAudioItems.length === 0) {
          setError("No audio tracks found. Please add sample audio files to the public/audio folder.")
          setTracks([])
          setFilteredTracks([])
          return
        }
        
        // Sort tracks by title
        const sortedTracks = allAudioItems.sort((a: AudioTrack, b: AudioTrack) => 
          a.title.localeCompare(b.title)
        )
        setTracks(sortedTracks)
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(sortedTracks.map((track: AudioTrack) => track.category || 'Uncategorized'))
        ).sort() as string[]
        setCategories(uniqueCategories)
        
        // Initially show all tracks
        setFilteredTracks(sortedTracks)
        
        // Set a default track
        if (sortedTracks.length > 0 && !currentTrack) {
          setCurrentTrack(sortedTracks[0])
          await howlerService.loadTrack(sortedTracks[0])
        }
      } catch (error) {
        console.error("Error loading tracks:", error)
        setError("Failed to load tracks. Please try again.")
        setTracks([])
        setFilteredTracks([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTracks()
    
    // Set up event listeners for howler service
    setupHowlerListeners()
    
    // Cleanup
    return () => {
      cleanupHowlerListeners()
      howlerService.destroy()
    }
  }, [user])
  
  // Set up Howler event listeners
  const setupHowlerListeners = () => {
    // Update playback state when time changes
    howlerService.on('timeupdate', (currentTime: number) => {
      setPlaybackState(prev => ({
        ...prev,
        currentTime
      }))
    })
    
    // Update duration when it changes
    howlerService.on('durationchange', (duration: number) => {
      console.log('Duration changed:', duration)
      setPlaybackState(prev => ({
        ...prev,
        duration
      }))
    })
    
    // Update play state
    howlerService.on('play', () => {
      console.log('Play event received')
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: true
      }))
    })
    
    howlerService.on('pause', () => {
      console.log('Pause event received')
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false
      }))
    })
    
    howlerService.on('stop', () => {
      console.log('Stop event received')
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0
      }))
    })
    
    howlerService.on('end', () => {
      console.log('End event received')
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: prev.duration // Set to full duration when ended
      }))
      playNextTrack()
    })
    
    // Log errors
    howlerService.on('error', (error: any) => {
      console.error('Howler error:', error)
      toast({
        title: "Playback Error",
        description: "There was an error playing this track. Please try another.",
        variant: "destructive"
      })
    })
  }
  
  // Clean up Howler event listeners
  const cleanupHowlerListeners = () => {
    howlerService.off('timeupdate', () => {})
    howlerService.off('play', () => {})
    howlerService.off('pause', () => {})
    howlerService.off('stop', () => {})
    howlerService.off('end', () => {})
    howlerService.off('error', () => {})
  }
  
  // Filter tracks when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredTracks(tracks)
    } else {
      setFilteredTracks(tracks.filter(track => track.category === selectedCategory))
    }
  }, [selectedCategory, tracks])
  
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
    try {
      // If it's the same track, just toggle play/pause
      if (currentTrack && currentTrack.id === track.id) {
        togglePlayPause()
        return
      }
      
      // Load and play the new track
      setCurrentTrack(track)
      
      // Reset playback state
      setPlaybackState(prev => ({
        ...prev,
        currentTime: 0,
        duration: track.duration || 0, // Use 0 as fallback if duration is not set
        isPlaying: false
      }))
      
      console.log(`Loading track: ${track.title} (${track.url})`)
      
      // Show loading toast
      toast({
        title: "Loading track",
        description: `Loading ${track.title}...`
      })
      
      // Load the track
      await howlerService.loadTrack(track)
      
      // Get the actual duration from the loaded track
      const actualDuration = howlerService.getDuration()
      if (actualDuration > 0) {
        // Update the track duration if it's different
        if (Math.abs(track.duration - actualDuration) > 1) {
          console.log(`Updated duration for ${track.title}: ${track.duration} → ${actualDuration}`)
          track.duration = actualDuration
          
          // Update playback state with the correct duration
          setPlaybackState(prev => ({
            ...prev,
            duration: actualDuration
          }))
        }
      }
      
      // Start playing
      howlerService.play()
      
      // Update playback state
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: true
      }))
    } catch (error) {
      console.error("Error playing track:", error)
      toast({
        title: "Playback Error",
        description: "Failed to play this track. Please try another.",
        variant: "destructive"
      })
    }
  }
  
  // Navigation functions
  const playNextTrack = () => {
    if (!currentTrack || filteredTracks.length === 0) return
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % filteredTracks.length
    playTrack(filteredTracks[nextIndex])
  }
  
  const playPreviousTrack = () => {
    if (!currentTrack || filteredTracks.length === 0) return
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
    const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length
    playTrack(filteredTracks[prevIndex])
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
    const newMutedState = !playbackState.muted
    howlerService.setMuted(newMutedState)
    setPlaybackState(prev => ({ ...prev, muted: newMutedState }))
  }
  
  const changeVolume = (value: number[]) => {
    const newVolume = value[0]
    howlerService.setVolume(newVolume)
    
    setPlaybackState(prev => ({ 
      ...prev, 
      volume: newVolume,
      muted: newVolume === 0 ? true : prev.muted
    }))
    
    if (newVolume > 0 && playbackState.muted) {
      howlerService.setMuted(false)
      setPlaybackState(prev => ({ ...prev, muted: false }))
    }
  }
  
  // Playback speed
  const changeSpeed = (speed: number) => {
    howlerService.setPlaybackRate(speed)
    setPlaybackState(prev => ({ ...prev, speed }))
  }
  
  // Loop toggle
  const toggleLoop = () => {
    const newLoopState = !playbackState.loop
    howlerService.setLoop(newLoopState)
    setPlaybackState(prev => ({ ...prev, loop: newLoopState }))
  }
  
  // Download track
  const downloadTrack = (track: AudioTrack, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!track.url) {
      toast({
        title: "Download failed",
        description: "This track does not have a downloadable URL.",
        variant: "destructive"
      })
      return
    }
    
    // Show confirmation toast
    toast({
      title: "Confirm download",
      description: `Do you want to download "${track.title}" by ${track.artist}?`,
      action: (
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => {
            // Create a temporary anchor element
            const a = document.createElement('a')
            a.href = track.url
            a.download = `${track.title} - ${track.artist}.mp3`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            
            // Show success toast
            toast({
              title: "Download started",
              description: `"${track.title}" is being downloaded.`
            })
          }}
        >
          Download
        </Button>
      ),
    })
  }
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main player section */}
      <div className={cn(
        "flex-1 bg-card border rounded-lg p-6 overflow-hidden",
        showPlaylist ? "w-full md:w-2/3" : "w-full"
      )}>
        {/* Now playing section */}
        <div className="flex flex-col items-center mb-6">
          {currentTrack ? (
            <>
              {/* Track Info */}
              <TrackInfo track={currentTrack} />
              
              {/* Progress Bar */}
              <ProgressBar 
                currentTime={playbackState.currentTime}
                duration={playbackState.duration}
                onSeek={seekTo}
                formatTime={formatTime}
              />
              
              {/* Player Controls */}
              <PlayerControls 
                isPlaying={playbackState.isPlaying}
                onPlayPause={togglePlayPause}
                onSkipForward={skipForward}
                onSkipBackward={skipBackward}
              />
              
              {/* Additional controls */}
              <div className="flex items-center justify-between w-full mt-6">
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
                  <button
                    className="md:hidden"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    title={showPlaylist ? "Hide playlist" : "Show playlist"}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Music size={64} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No track selected</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Select a track from the playlist to start listening
              </p>
            </div>
          )}
        </div>
        
      </div>
      
      {/* Playlist View */}
      {showPlaylist && (
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
      )}
      
      {/* Buy Me Coffee Dialog */}
      <BuyMeCoffeeDialog 
        isOpen={showBuyMeCoffeeDialog}
        onOpenChange={setShowBuyMeCoffeeDialog}
      />
    </div>
  )
}
