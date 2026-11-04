"use client";

import React, { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";

const AUDIO_FILE = "/audio/wherehaveallthecowboysgone.mp3";
const LOCAL_STORAGE_KEY = "music_player_paused";

export default function FloatingMusicPlayer() {
  const [isPaused, setIsPaused] = useLocalStorage(LOCAL_STORAGE_KEY, true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // The audio element (and its 3.6MB download) only exists once someone asks
  // for music. A returning listener's "playing" preference counts as asking.
  useEffect(() => {
    if (isPaused) {
      audioRef.current?.pause();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(AUDIO_FILE);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;
    }

    // Browsers block autoplay until the visitor interacts with the page.
    audioRef.current.play().catch(() => setIsPaused(true));
  }, [isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => audioRef.current?.pause(), []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsPaused((paused) => !paused)}
        className={cn(
          "music-orb h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110",
          !isPaused && "animate-spin-slow"
        )}
        aria-label={isPaused ? "Play music" : "Pause music"}
      >
        {isPaused ? (
          <Play className="h-4 w-4 text-white" />
        ) : (
          <Pause className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  );
}
