"use client"

import { useState, useEffect } from "react"
import { List, Music, RefreshCw, Search, Volume, Volume2, VolumeX } from "lucide-react"
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
import { BuyMeCoffeeDialog } from "../../comps/BuyMeCoffeeDialog"

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
  const [isTrackLoading, setIsTrackLoading] = useState(false)
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
    
    // Set up page visibility handling for background playback
    const handleVisibilityChange = () => {
      // Don't pause music when page is hidden
      if (document.visibilityState === 'hidden') {
        // Optionally, you could save the current state to localStorage here
        console.log('Page hidden, music continues playing in background');
      } else if (document.visibilityState === 'visible') {
        console.log('Page visible again, syncing player state');
        // Sync the UI with the actual playback state when page becomes visible again
        const isPlaying = howlerService.isPlaying();
        setPlaybackState(prev => ({ ...prev, isPlaying }));
      }
    };
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      cleanupHowlerListeners()
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Don't destroy the howler service when component unmounts to allow background playback
      // We'll let it continue playing in the background
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
          setError("Unable to connect to the music library. Please check your internet connection and try again.")
        }
        // Authentication errors
        else if (error.message.includes('authentication') || error.message.includes('credentials') || error.message.includes('401')) {
          setError("You don't have permission to access this content. Please sign in or contact support.")
        }
        // API errors or no music available
        else if (typeof error.message === 'string' && (error.message.includes('Failed to fetch') || error.message.includes('cloudinary'))) {
          setError("No music available yet. Check back later or visit the control room to add some tracks.")
        }
        // Generic error
        else {
          setError("Unable to load music at this time. Please try again later.")
        }
      } else {
        // If it's not an Error object
        setError("No music available yet. Check back later or visit the control room to add some tracks.")
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
      setIsTrackLoading(true)
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
      setIsTrackLoading(false)
      howlerService.play()
      
      // If premium track and user not logged in, show buy me coffee dialog
      if (track.isPremium && !user) {
        setShowBuyMeCoffeeDialog(true)
        howlerService.pause()
      }
    } catch (error) {
      setIsTrackLoading(false)
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
    howlerService.skipForward(10) // Skip forward 10 seconds
  }
  
  const skipBackward = () => {
    howlerService.skipBackward(10) // Skip backward 10 seconds
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
  
  // Update howlerService event listeners to properly track duration
  useEffect(() => {
    if (currentTrack) {
      // If we have a track loaded but duration is 0, update it from the track data
      if (playbackState.duration === 0 && currentTrack.duration) {
        setPlaybackState(prev => ({ ...prev, duration: currentTrack.duration }))
      }
    }
  }, [currentTrack, playbackState.duration])

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Player Section - Minimalist Style */}
      <div className=
        "flex-1 bg-transparent border border-gray-200 rounded-xl overflow-hidden shadow-md w-full">
        <div className="flex flex-col w-full h-full p-6 text-black">
          {currentTrack ? (
            <>
              {/* Track Info - Centered */}
              <div className="text-center mb-4 mt-4">
                <h2 className="text-2xl text-primary font-bold uppercase tracking-wide">{currentTrack.title}</h2>
                <p className="text-gray-500 mt-1">{currentTrack.artist || 'Unknown Artist'}</p>
              </div>
              
              {/* Time Display */}
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{formatTime(playbackState.currentTime)}</span>
                <span>{formatTime(currentTrack.duration || playbackState.duration || 0)}</span>
              </div>
              
              {/* Progress Bar - Simplified */}
              <div className="mb-4">
                <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-black transition-all duration-100"
                    style={{ 
                      width: `${((playbackState.currentTime / (currentTrack.duration || playbackState.duration || 1)) * 100).toFixed(2)}%` 
                    }}
                  />
                  <div 
                    className="absolute top-0 h-full"
                    style={{ 
                      left: `${((playbackState.currentTime / (currentTrack.duration || playbackState.duration || 1)) * 100).toFixed(2)}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="w-3 h-3 bg-black rounded-full shadow-sm"></div>
                  </div>
                  <input 
                    type="range"
                    min={0}
                    max={currentTrack.duration || playbackState.duration || 100}
                    step={0.1}
                    value={playbackState.currentTime}
                    onChange={(e) => seekTo(parseFloat(e.target.value))}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Player Controls - Centered */}
              <div>
                {isTrackLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <PlayerControls
                    isPlaying={playbackState.isPlaying}
                    onPlayPause={togglePlayPause}
                    onSkipForward={skipForward}
                    onSkipBackward={skipBackward}
                    onPreviousTrack={playPreviousTrack}
                    onNextTrack={playNextTrack}
                  />
                )}
              </div>
              
              {/* Volume Control - Simplified */}
              <div className="flex items-center justify-center gap-3 mt-auto">
                <button
                  onClick={toggleMute}
                  className="text-gray-600 hover:text-primary transition-colors focus:outline-none"
                  aria-label={playbackState.muted ? "Unmute" : "Mute"}
                >
                  {playbackState.muted ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
                
                <div className="relative w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-black transition-all duration-100"
                    style={{ width: `${playbackState.muted ? 0 : playbackState.volume * 100}%` }}
                  />
                  <input 
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={playbackState.muted ? 0 : playbackState.volume}
                    onChange={(e) => {
                      e.stopPropagation();
                      changeVolume([parseFloat(e.target.value)]);
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                <Music size={64} className="text-gray-400" />
              </div>
              <h3 className="text-2xl text-primary font-semibold mb-2">No track selected</h3>
              <p className="text-gray-500 max-w-md">
                Select a track from the playlist to start listening
              </p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-3 border-t text-xs text-gray-400 text-center">
          Built with love.
        </div>
      </div>
      
      {/* Playlist View */}
      {showPlaylist && (
        <div className="w-full h-full">
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
