import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { format } from "date-fns";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface MusicPlayerWidgetProps {
  imageUrl: string;
  title?: string; // Made optional to allow default value
  artist?: string; // Added back the artist property
}

export const MusicPlayerWidget = ({
  imageUrl = "/audio/placeholder-cover.jpg", // Default image
  title = "Lily's Lab Intro", // Default title
  artist = "Lily", // Default artist
}: MusicPlayerWidgetProps) => {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(5); // Volume from 1-10
  const [lastPlayed, setLastPlayed] = useState<string>("");
  const [playCount, setPlayCount] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio on component mount
  useEffect(() => {
    // Create audio element with intro audio
    audioRef.current = new Audio("/audio/intro.mp3");
    
    // Set initial volume (scale 1-10 to 0-1)
    if (audioRef.current) {
      audioRef.current.volume = volume / 10;
    }
    
    // Load play count from Firestore
    const fetchPlayCount = async () => {
      try {
        // Reference to the audio stats document
        const audioStatsRef = doc(db, 'audioStats', 'intro');
        const docSnap = await getDoc(audioStatsRef);
        
        if (docSnap.exists()) {
          // Document exists, get the play count
          const data = docSnap.data();
          setPlayCount(data.playCount || 0);
        } else {
          // Document doesn't exist yet, create it with initial count of 0
          await setDoc(audioStatsRef, { playCount: 0 });
          setPlayCount(0);
        }
      } catch (error) {
        console.error('Error fetching play count:', error);
        // Fallback to localStorage if Firestore fails
        const savedPlayCount = localStorage.getItem('musicPlayerPlayCount');
        if (savedPlayCount) {
          setPlayCount(parseInt(savedPlayCount, 10));
        }
      }
    };
    
    fetchPlayCount();
    
    // Update progress during playback
    const updateProgress = () => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        const currentProgress = (current / total) * 100;
        
        setCurrentTime(current);
        setDuration(total);
        setProgress(currentProgress);
      }
    };
    
    // Handle audio ended event
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    };
    
    // Set up event listeners
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
    }
    
    // Clean up on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, []);
  
  // Handle play/pause
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      // Update last played timestamp when play is clicked
      setLastPlayed(format(new Date(), "MMM d, yyyy h:mm a"));
      
      // Increment play count locally
      const newPlayCount = playCount + 1;
      setPlayCount(newPlayCount);
      
      // Save to Firestore
      const updateFirestorePlayCount = async () => {
        try {
          const audioStatsRef = doc(db, 'audioStats', 'intro');
          await updateDoc(audioStatsRef, {
            playCount: increment(1)
          });
          console.log('Play count updated in Firestore');
        } catch (error) {
          console.error('Error updating play count in Firestore:', error);
          // Fallback to localStorage if Firestore fails
          localStorage.setItem('musicPlayerPlayCount', newPlayCount.toString());
        }
      };
      
      updateFirestorePlayCount();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle progress bar click for seeking
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    // Set new playback position
    audioRef.current.currentTime = clickPosition * audioRef.current.duration;
  };
  
  // Handle volume change
  const changeVolume = (increment: boolean) => {
    setVolume(prev => {
      const newVolume = increment ? Math.min(prev + 1, 10) : Math.max(prev - 1, 1);
      
      // Update audio volume
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 10;
      }
      
      return newVolume;
    });
  };
  
  return (
    <div className="bg-muted rounded-lg p-2 shadow-sm opacity-0 animate-slide-up transition-colors duration-300">
      {/* Inner container for main content with card background */}
      <div className="bg-accent rounded-md border p-1 flex items-center gap-3">
        {/* Album Art */}
        <div className="flex-shrink-0 relative">
          <Image
            src={imageUrl}
            alt={`${title} album art`}
            width={56} 
            height={56} 
            className="rounded-md object-cover"
            style={{ height: "auto" }} // Maintain aspect ratio
          />
          
          {/* Play button overlay */}
          <button 
            onClick={togglePlayback}
            className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md hover:bg-black/50 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
        
        {/* Text Info and Controls */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-card-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
          
          {/* Progress bar and duration */}
          <div className="mt-1">
            <div 
              className="h-1.5 bg-muted-foreground/20 rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {/* Volume control */}
          <div className="flex items-center mt-1 gap-1">
            <Volume2 className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1">
              <button 
                onClick={() => changeVolume(false)}
                className="text-xs text-muted-foreground hover:text-primary"
                aria-label="Decrease volume"
              >
                -
              </button>
              <span className="text-xs text-muted-foreground">{volume}</span>
              <button 
                onClick={() => changeVolume(true)}
                className="text-xs text-muted-foreground hover:text-primary"
                aria-label="Increase volume"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer section within the outer container */}
      <div className="flex items-center justify-between pt-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
          <span className="text-xs text-muted-foreground">
            {lastPlayed ? `Last played: ${lastPlayed}` : "Not played yet"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
          <span className="text-xs text-muted-foreground">
            {playCount} {playCount === 1 ? 'play' : 'plays'}
          </span>
        </div>
      </div>
    </div>
  );
};