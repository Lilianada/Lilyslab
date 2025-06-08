"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AudioTrack } from './howler-service'
import { getAudioFromCloudinary } from '@/lib/cloudinary/audio-service'
import howlerService from './howler-service'
import { ClientOnly } from '@/components/hydration/client-only'

interface AudioContextType {
  audioTracks: AudioTrack[]
  loadingTracks: boolean
  refreshTracks: () => Promise<void>
  currentTrack: AudioTrack | null
  setCurrentTrack: (track: AudioTrack | null) => void
  isPlaying: boolean
  togglePlayback: (track?: AudioTrack) => void
  duration: number
  currentTime: number
}

const AudioContext = createContext<AudioContextType>({
  audioTracks: [],
  loadingTracks: false,
  refreshTracks: async () => {},
  currentTrack: null,
  setCurrentTrack: () => {},
  isPlaying: false,
  togglePlayback: () => {},
  duration: 0,
  currentTime: 0
})

export const useAudio = () => useContext(AudioContext)

interface AudioProviderProps {
  children: ReactNode
}

// Simplified audio provider without excessive caching
function AudioProviderContent({ children }: AudioProviderProps) {
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const fetchAudioTracks = async () => {
    try {
      setLoadingTracks(true)
      const tracks = await getAudioFromCloudinary(false)
      setAudioTracks(tracks)
      return tracks
    } catch (error) {
      console.error('Error fetching audio tracks:', error)
      return []
    } finally {
      setLoadingTracks(false)
    }
  }

  // Load tracks on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchAudioTracks()
    }
  }, [])

  // Set up howler service event listeners
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleStop = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const handleTimeUpdate = (time: number) => setCurrentTime(time)
    const handleDurationChange = (duration: number) => setDuration(duration)

    howlerService.on('play', handlePlay)
    howlerService.on('pause', handlePause)
    howlerService.on('stop', handleStop)
    howlerService.on('timeupdate', handleTimeUpdate)
    howlerService.on('durationchange', handleDurationChange)

    return () => {
      howlerService.off('play', handlePlay)
      howlerService.off('pause', handlePause)
      howlerService.off('stop', handleStop)
      howlerService.off('timeupdate', handleTimeUpdate)
      howlerService.off('durationchange', handleDurationChange)
    }
  }, [])

  const togglePlayback = (track?: AudioTrack) => {
    if (track && track !== currentTrack) {
      // Play new track
      setCurrentTrack(track)
      howlerService.loadTrack(track).then(() => {
        howlerService.play()
      })
    } else if (currentTrack) {
      // Toggle current track
      if (isPlaying) {
        howlerService.pause()
      } else {
        howlerService.play()
      }
    }
  }

  const refreshTracks = async () => {
    await fetchAudioTracks()
  }

  const contextValue: AudioContextType = {
    audioTracks,
    loadingTracks,
    refreshTracks,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    togglePlayback,
    duration,
    currentTime
  }

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  )
}

// Main provider component with hydration safety
export function AudioProvider({ children }: AudioProviderProps) {
  return (
    <ClientOnly>
      <AudioProviderContent>
        {children}
      </AudioProviderContent>
    </ClientOnly>
  )
}
