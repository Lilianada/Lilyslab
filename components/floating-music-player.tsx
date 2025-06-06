"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple configuration
const AUDIO_FILE = "/audio/wherehaveallthecowboysgone.mp3";
const LOCAL_STORAGE_KEY = "music_player_paused";
const COLOR_VARS = [
  "--extra-lavender",
  "--extra-yellow",
  "--extra-green",
  "--extra-pink",
  "--extra-cream",
  "--extra-lilac",
  "--extra-peach",
  "--extra-paleYellow",
  "--extra-steelBlue"
];

function FloatingMusicPlayer() {
  // Basic state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColor, setCurrentColor] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize once on mount
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(AUDIO_FILE);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    
    // Check saved state
    const isPaused = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
    setIsPlaying(!isPaused);
    
    // Set up color rotation
    intervalRef.current = setInterval(() => {
      setCurrentColor(prev => (prev + 1) % COLOR_VARS.length);
    }, 3000);
    
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
    
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
    
    // Save state
    localStorage.setItem(LOCAL_STORAGE_KEY, isPlaying ? "false" : "true");
  }, [isPlaying]);

  // Simple toggle function
  const togglePlayPause = () => setIsPlaying(prev => !prev);

  // Button styling
  const buttonStyle = {
    backgroundColor: `hsl(var(${COLOR_VARS[currentColor]}))`,
    transition: 'background-color 1s ease-in-out',
    boxShadow: isPlaying 
      ? '0 0 15px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={togglePlayPause}
        className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center transition-all",
          isPlaying && "animate-spin-slow"
        )}
        style={buttonStyle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 text-white" />
        ) : (
          <Play className="h-6 w-6 text-white ml-1" />
        )}
      </button>
    </div>
  );
}

export default FloatingMusicPlayer;
