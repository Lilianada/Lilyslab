"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const AUDIO_FILE = "/audio/wherehaveallthecowboysgone.mp3";
const LOCAL_STORAGE_KEY = "music_player_paused";
// These colors will be applied as style backgrounds using CSS variables
const COLOR_VARS = [
  "--extra-lavender",
  "--extra-yellow",
  "--extra-green",
  "--extra-pink",
  "--extra-Blue",
  "--extra-cream",
  "--extra-lilac",
  "--extra-peach",
  "--extra-paleYellow",
  "--extra-steelBlue"
];

export const FloatingMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColorVar, setCurrentColorVar] = useState(COLOR_VARS[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const colorIntervalRef = useRef<NodeJS.Timeout>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(AUDIO_FILE);
    audioRef.current.loop = true;
    
    // Check local storage for saved state
    const savedPaused = localStorage.getItem(LOCAL_STORAGE_KEY);
    const shouldPlay = savedPaused !== "true";
    
    if (shouldPlay) {
      // We need to wait for user interaction before playing
      setIsPlaying(true);
      // Note: actual play() happens on click due to browser autoplay policies
    }

    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (colorIntervalRef.current) {
        clearInterval(colorIntervalRef.current);
      }
    };
  }, []);

  // Start color rotation when component mounts
  useEffect(() => {
    let colorIndex = 0;
    
    const rotateColors = () => {
      colorIndex = (colorIndex + 1) % COLOR_VARS.length;
      setCurrentColorVar(COLOR_VARS[colorIndex]);
    };
    
    colorIntervalRef.current = setInterval(rotateColors, 2000);
    
    return () => {
      if (colorIntervalRef.current) {
        clearInterval(colorIntervalRef.current);
      }
    };
  }, []);

  // Handle play/pause when isPlaying changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio play failed:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
    
    // Save state to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, isPlaying ? "false" : "true");
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Get the current color value from CSS variable
  const buttonStyle = {
    backgroundColor: `hsl(var(${currentColorVar}))`,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      <button 
        ref={buttonRef}
        onClick={togglePlayPause}
        className={cn(
          "h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          isPlaying && "animate-spin-slow"
        )}
        style={buttonStyle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white ml-1" />
        )}
      </button>
    </div>
  );
};

export default FloatingMusicPlayer;
