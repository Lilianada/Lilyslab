"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, List, Download, Music, Bookmark, 
  ChevronDown, ChevronUp, Coffee
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ColorCover } from "./ColorCover"
import howlerService, { AudioTrack, AudioBookmark, PlaybackState } from "@/lib/audio/howler-service"

// Define types for our component state
interface Bookmark {
  id: string;
  trackId: string;
  position: number;
  label: string;
  timestamp: number;
}

export function HowlerMusicPlayer() {
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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  
  // UI state
  const [showPlaylist, setShowPlaylist] = useState(true)
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [bookmarkLabel, setBookmarkLabel] = useState("")
  const [showBuyMeCoffeeDialog, setShowBuyMeCoffeeDialog] = useState(false)
  
  // Auth and toast
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Load tracks from Firebase (or mock data for now)
  useEffect(() => {
    async function fetchTracks() {
      try {
        setIsLoading(true)
        
        // This is a placeholder for actual Firebase implementation
        // In a real implementation, you would fetch from Firebase Storage
        
        // Simulated data for development
        const mockTracks: AudioTrack[] = [
          {
            id: "1",
            title: "Peaceful Morning",
            artist: "Lily",
            duration: 180, // 3 minutes
            url: "/audio/sample1.mp3", // This would be a Firebase URL in production
            coverImage: null, // Using null to trigger the ColorCover fallback
            category: "Meditation",
            isPremium: false
          },
          {
            id: "2",
            title: "Jazz Session",
            artist: "Lily",
            duration: 240, // 4 minutes
            url: "/audio/sample2.mp3",
            coverImage: null,
            category: "Jazz",
            isPremium: false
          },
          {
            id: "3",
            title: "Deep Focus",
            artist: "Lily",
            duration: 300, // 5 minutes
            url: "/audio/sample3.mp3",
            coverImage: null,
            category: "Focus",
            isPremium: true
          },
          {
            id: "4",
            title: "Ambient Sounds",
            artist: "Lily",
            duration: 270, // 4.5 minutes
            url: "/audio/sample4.mp3",
            coverImage: null,
            category: "Ambient",
            isPremium: false
          },
          {
            id: "5",
            title: "Piano Sonata",
            artist: "Lily",
            duration: 320, // 5.33 minutes
            url: "/audio/sample5.mp3",
            coverImage: null,
            category: "Classical",
            isPremium: true
          }
        ]
        
        setTracks(mockTracks)
        setFilteredTracks(mockTracks)
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(mockTracks.map(track => track.category))
        )
        setCategories(uniqueCategories)
        
        // Load user bookmarks if logged in
        if (user) {
          // This would fetch from Firestore in production
          const mockBookmarks: Bookmark[] = [
            {
              id: "bookmark1",
              trackId: "1",
              position: 60, // 1 minute
              label: "Favorite part",
              timestamp: Date.now()
            }
          ]
          setBookmarks(mockBookmarks)
        }
        
      } catch (error) {
        console.error("Error fetching tracks:", error)
        setError("Failed to load tracks. Please try again later.")
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
    howlerService.on('timeupdate', (time: number) => {
      setPlaybackState(prev => ({ ...prev, currentTime: time }))
    })
    
    // Update state when play/pause/stop events occur
    howlerService.on('play', () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: true }))
    })
    
    howlerService.on('pause', () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: false }))
    })
    
    howlerService.on('stop', () => {
      setPlaybackState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
    })
    
    // Handle track end
    howlerService.on('end', () => {
      if (!playbackState.loop) {
        playNextTrack()
      }
    })
    
    // Handle errors
    howlerService.on('error', (error: any) => {
      console.error('Howler error:', error)
      toast({
        title: "Playback Error",
        description: "There was an error playing this track. Please try again.",
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
    if (track.isPremium && !user) {
      setShowBuyMeCoffeeDialog(true)
      return
    }
    
    try {
      setCurrentTrack(track)
      
      // Load and play the track
      await howlerService.loadTrack(track)
      
      // Update duration in playback state
      setPlaybackState(prev => ({
        ...prev,
        duration: howlerService.getDuration(),
        volume: howlerService.getVolume(),
        muted: howlerService.isMuted(),
        speed: howlerService.getPlaybackRate(),
        loop: howlerService.isLooping()
      }))
      
      // Start playback
      howlerService.play()
    } catch (error) {
      console.error("Error playing track:", error)
      toast({
        title: "Playback Error",
        description: "Failed to load the audio track. Please try again.",
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
  
  // Bookmark functions
  const addBookmark = () => {
    if (!currentTrack || !user) return
    
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      trackId: currentTrack.id,
      position: playbackState.currentTime,
      label: bookmarkLabel || `Bookmark at ${formatTime(playbackState.currentTime)}`,
      timestamp: Date.now()
    }
    
    setBookmarks([...bookmarks, newBookmark])
    setShowBookmarkDialog(false)
    setBookmarkLabel("")
    
    // In production, save to Firestore
    toast({
      title: "Bookmark added",
      description: `Bookmark added at ${formatTime(playbackState.currentTime)}`,
    })
  }
  
  const jumpToBookmark = (bookmark: Bookmark) => {
    if (currentTrack?.id === bookmark.trackId) {
      seekTo(bookmark.position)
    } else {
      const track = tracks.find(t => t.id === bookmark.trackId)
      if (track) {
        playTrack(track).then(() => {
          // Set timeout to allow track to load
          setTimeout(() => seekTo(bookmark.position), 300)
        })
      }
    }
  }
  
  // Download track
  const downloadTrack = (track: AudioTrack) => {
    if (track.isPremium && !user) {
      setShowBuyMeCoffeeDialog(true)
      return
    }
    
    // In production, this would get the download URL from Firebase
    // and trigger a download
    toast({
      title: "Download started",
      description: `Downloading ${track.title}`,
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
              <div className="relative w-48 h-48 mb-4">
                {currentTrack.coverImage ? (
                  <img 
                    src={currentTrack.coverImage} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <ColorCover 
                    title={currentTrack.title}
                    artist={currentTrack.artist}
                    size="md"
                    isPremium={currentTrack.isPremium}
                  />
                )}
              </div>
              
              <h3 className="text-xl font-bold">{currentTrack.title}</h3>
              <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              
              {/* Progress bar */}
              <div className="w-full mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{formatTime(playbackState.currentTime)}</span>
                  <span>{formatTime(playbackState.duration)}</span>
                </div>
                <Slider
                  value={[playbackState.currentTime]}
                  min={0}
                  max={playbackState.duration || 100}
                  step={0.1}
                  onValueChange={(value) => seekTo(value[0])}
                  className="w-full"
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipBackward}
                  title="Skip back 10 seconds"
                >
                  <SkipBack size={20} />
                </Button>
                
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={togglePlayPause}
                >
                  {playbackState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipForward}
                  title="Skip forward 10 seconds"
                >
                  <SkipForward size={20} />
                </Button>
              </div>
              
              {/* Additional controls */}
              <div className="flex items-center justify-between w-full mt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    title={playbackState.muted ? "Unmute" : "Mute"}
                  >
                    {playbackState.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                  
                  <Slider
                    value={[playbackState.volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={changeVolume}
                    className="w-24"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={playbackState.loop ? "default" : "ghost"}
                    size="icon"
                    onClick={toggleLoop}
                    title={playbackState.loop ? "Disable loop" : "Enable loop"}
                  >
                    <Repeat size={20} />
                  </Button>
                  
                  <select
                    value={playbackState.speed}
                    onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                    className="bg-background border rounded px-2 py-1 text-sm"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                  
                  <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!currentTrack || !user}
                        title={user ? "Add bookmark" : "Sign in to bookmark"}
                      >
                        <Bookmark size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Bookmark</DialogTitle>
                        <DialogDescription>
                          Bookmark this position ({formatTime(playbackState.currentTime)}) for later.
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
                        <Button onClick={addBookmark}>Save Bookmark</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    title={showPlaylist ? "Hide playlist" : "Show playlist"}
                    className="md:hidden"
                  >
                    <List size={20} />
                  </Button>
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
        
        {/* Bookmarks (visible only when logged in) */}
        {user && bookmarks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Your Bookmarks</h3>
            <div className="space-y-2">
              {bookmarks.map((bookmark) => {
                const track = tracks.find(t => t.id === bookmark.trackId)
                return (
                  <div 
                    key={bookmark.id}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => jumpToBookmark(bookmark)}
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
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Playlist section */}
      {showPlaylist && (
        <div className="w-full md:w-1/3 bg-card border rounded-lg p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Playlist</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPlaylist(false)}
              className="md:hidden"
            >
              <ChevronDown size={20} />
            </Button>
          </div>
          
          {/* Category filter */}
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
                  onClick={() => playTrack(track)}
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
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadTrack(track)
                      }}
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
      )}
      
      {/* Buy Me Coffee Dialog */}
      <Dialog open={showBuyMeCoffeeDialog} onOpenChange={setShowBuyMeCoffeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Premium Content</DialogTitle>
            <DialogDescription>
              This track is available for supporters who buy me a coffee.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <Coffee size={48} className="text-amber-500 mb-4" />
            <p className="text-center mb-4">
              Support my work by buying me a coffee to unlock premium content including downloads and exclusive tracks.
            </p>
            <Button 
              onClick={() => window.open("https://www.buymeacoffee.com/lilian.ada", "_blank")}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Buy Me A Coffee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
