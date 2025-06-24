"use client";

import React, { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ClientOnly } from "@/components/hydration/client-only";

// Simple configuration
const AUDIO_FILE = "/audio/wherehaveallthecowboysgone.mp3";
const LOCAL_STORAGE_KEY = "music_player_paused";
const COLOR_VARS = [
  "--lavender",
  "--siteYellow",
  "--siteGreen",
  "--sitePink",
  "--codeRed",
  "--lilac",
  "--peach",
  "--paleYellow",
  "--steelBlue"
];

function FloatingMusicPlayerContent() {
  // Use our custom localStorage hook for state persistence
  const [isPaused, setIsPaused] = useLocalStorage(LOCAL_STORAGE_KEY, true);
  const [currentColor, setCurrentColor] = useLocalStorage("music_player_color", 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize once on mount
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(AUDIO_FILE);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    
    // Play if not paused
    if (!isPaused && audioRef.current) {
      audioRef.current.play().catch(() => setIsPaused(true));
    }
    
    // Set up color rotation
    intervalRef.current = setInterval(() => {
      setCurrentColor(prev => (prev + 1) % COLOR_VARS.length);
    }, 1000);
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (!isPaused) {
      audioRef.current.play().catch(() => setIsPaused(true));
    } else {
      audioRef.current.pause();
    }
  }, [isPaused, setIsPaused]);

  // Button styling
  const buttonStyle = {
    backgroundColor: `hsl(var(${COLOR_VARS[currentColor]}))`,
    transition: 'background-color 1s ease-in-out',
    boxShadow: !isPaused 
      ? '0 0 15px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setIsPaused(prev => !prev)}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center transition-all",
          !isPaused && "animate-spin-slow"
        )}
        style={buttonStyle}
        aria-label={isPaused ? "Play music" : "Pause music"}
      >
        {!isPaused ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  );
}

// Export a wrapped version that only renders on the client
export default function FloatingMusicPlayer() {
  return (
    <ClientOnly fallback={
      <div className="fixed bottom-6 right-6 z-50">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center"></div>
      </div>
    }>
      <FloatingMusicPlayerContent />
    </ClientOnly>
  );
}
