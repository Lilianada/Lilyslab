"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { format } from "date-fns";

const AUDIO_FILE = "/audio/intro.mp3";
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Reads the play count over Firestore's REST API, so showing a number on the
// homepage doesn't require downloading the Firestore SDK.
async function fetchPlayCount(): Promise<number | null> {
  if (!PROJECT_ID) return null;
  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/audioStats/intro`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return Number(data.fields?.playCount?.integerValue ?? 0);
  } catch {
    return null;
  }
}

async function recordPlay() {
  try {
    const [{ doc, increment, setDoc }, { db }] = await Promise.all([
      import("firebase/firestore"),
      import("@/lib/garden/firebase"),
    ]);
    if (!db) return;
    await setDoc(doc(db, "audioStats", "intro"), { playCount: increment(1) }, { merge: true });
  } catch (error) {
    console.error("Error updating play count:", error);
  }
}

interface MusicPlayerWidgetProps {
  imageUrl: string;
  title?: string;
  artist?: string;
}

export const MusicPlayerWidget = ({
  imageUrl,
  title = "Lily's Garden Intro",
  artist = "Lily",
}: MusicPlayerWidgetProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(5);
  const [lastPlayed, setLastPlayed] = useState("");
  const [playCount, setPlayCount] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(NaN);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchPlayCount().then((count) => {
      if (count !== null) setPlayCount(count);
    });
    return () => audioRef.current?.pause();
  }, []);

  // Created on first play so the audio file isn't downloaded for every visitor.
  const getAudio = () => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(AUDIO_FILE);
    audio.volume = volume / 10;
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    });
    audioRef.current = audio;
    return audio;
  };

  const togglePlayback = () => {
    const audio = getAudio();
    if (isPlaying) {
      audio.pause();
      return;
    }

    audio.play().catch((error) => console.error("Could not play intro:", error));
    setLastPlayed(format(new Date(), "MMM d, yyyy h:mm a"));

    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (!isLocalhost) {
      setPlayCount((count) => (count ?? 0) + 1);
      recordPlay();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const changeVolume = (step: number) => {
    const next = Math.min(10, Math.max(1, volume + step));
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next / 10;
  };

  const progress = isFinite(duration) && duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-muted rounded-lg p-2 shadow-sm transition-colors duration-300">
      <div className="bg-accent rounded-md border p-1 flex items-center gap-3">
        <div className="flex-shrink-0 relative">
          <Image
            src={imageUrl}
            alt=""
            width={56}
            height={56}
            className="rounded-md object-cover w-14"
            style={{ height: "56px" }}
          />
          <button
            onClick={togglePlayback}
            className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md hover:bg-black/50 transition-colors"
            aria-label={isPlaying ? "Pause intro" : "Play intro"}
          >
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-card-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>

          <div className="mt-1">
            <div className="h-1.5 bg-muted-foreground/20 rounded-full cursor-pointer" onClick={handleProgressClick}>
              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-muted-foreground">{formatTime(currentTime)}</span>
              <span className="text-[10px] text-muted-foreground">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center mt-1 gap-1">
            <Volume2 className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => changeVolume(-1)}
                className="text-xs text-muted-foreground hover:text-primary"
                aria-label="Decrease volume"
              >
                -
              </button>
              <span className="text-xs text-muted-foreground">{volume}</span>
              <button
                onClick={() => changeVolume(1)}
                className="text-xs text-muted-foreground hover:text-primary"
                aria-label="Increase volume"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
          <span className="text-xs text-muted-foreground">
            {lastPlayed ? `Last played: ${lastPlayed}` : "Not played yet"}
          </span>
        </div>
        {playCount !== null && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
            <span className="text-xs text-muted-foreground">
              {playCount} {playCount === 1 ? "play" : "plays"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
