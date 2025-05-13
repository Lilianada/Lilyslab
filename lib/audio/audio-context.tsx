"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { AudioTrack } from './howler-service'
import { getAudioFromCloudinary } from '@/lib/cloudinary/audio-service'
import howlerService from './howler-service'

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

export function AudioProvider({ children }: AudioProviderProps) {
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  // Refs to store audio state between renders
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const fetchAudioTracks = async () => {
    try {
      setLoadingTracks(true)
      // Fetch regular tracks
      const tracks = await getAudioFromCloudinary(false)
      
      // Cache the tracks in localStorage for persistence
      localStorage.setItem('cachedAudioTracks', JSON.stringify(tracks))
      
      setAudioTracks(tracks)
      return tracks
    } catch (error) {
      console.error('Error fetching audio tracks:', error)
      return []
    } finally {
      setLoadingTracks(false)
    }
  }

  // Load tracks on initial mount
  useEffect(() => {
    if (!initialized) {
      // Try to load from cache first
      const cachedTracks = localStorage.getItem('cachedAudioTracks')
      
      if (cachedTracks) {
        try {
          const parsedTracks = JSON.parse(cachedTracks)
          setAudioTracks(parsedTracks)
        } catch (e) {
          console.error('Error parsing cached tracks:', e)
        }
      }
      
      // Try to restore current track from localStorage
      const savedCurrentTrack = localStorage.getItem('currentAudioTrack')
      if (savedCurrentTrack) {
        try {
          const parsedTrack = JSON.parse(savedCurrentTrack)
          setCurrentTrack(parsedTrack)
        } catch (e) {
          console.error('Error parsing current track:', e)
        }
      }
      
      // Then fetch fresh data in the background
      fetchAudioTracks()
      setInitialized(true)
    }
  }, [initialized])
  
  // Set up event listeners for howler service
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = (time: number) => setCurrentTime(time)
    const handleDurationChange = (dur: number) => setDuration(dur)
    
    howlerService.on('play', handlePlay)
    howlerService.on('pause', handlePause)
    howlerService.on('timeupdate', handleTimeUpdate)
    howlerService.on('durationchange', handleDurationChange)
    
    return () => {
      howlerService.off('play', handlePlay)
      howlerService.off('pause', handlePause)
      howlerService.off('timeupdate', handleTimeUpdate)
      howlerService.off('durationchange', handleDurationChange)
    }
  }, [])
  
  // Save current track to localStorage when it changes
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('currentAudioTrack', JSON.stringify(currentTrack))
    }
  }, [currentTrack])

  const refreshTracks = async () => {
    await fetchAudioTracks()
  }
  
  const togglePlayback = (track?: AudioTrack) => {
    if (track) {
      // If a new track is provided, load and play it
      if (!currentTrack || currentTrack.id !== track.id) {
        setCurrentTrack(track)
        howlerService.loadTrack(track).then(() => {
          howlerService.play()
        })
      } else {
        // Toggle playback of current track
        if (isPlaying) {
          howlerService.pause()
        } else {
          howlerService.play()
        }
      }
    } else if (currentTrack) {
      // Toggle playback of current track
      if (isPlaying) {
        howlerService.pause()
      } else {
        howlerService.play()
      }
    }
  }

  return (
    <AudioContext.Provider value={{
      audioTracks,
      loadingTracks,
      refreshTracks,
      currentTrack,
      setCurrentTrack,
      isPlaying,
      togglePlayback,
      duration,
      currentTime
    }}>
      {children}
    </AudioContext.Provider>
  )
}
