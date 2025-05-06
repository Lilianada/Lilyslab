"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>
  isPlaying: boolean
  className?: string
}

export function AudioVisualizer({ audioRef, isPlaying, className }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const analyserRef = useRef<AnalyserNode | undefined>(undefined)
  const dataArrayRef = useRef<Uint8Array | undefined>(undefined)
  const audioContextRef = useRef<AudioContext | undefined>(undefined)

  useEffect(() => {
    let audioContext: AudioContext
    let analyser: AnalyserNode
    let audioSource: MediaElementAudioSourceNode

    const setupAudioContext = () => {
      if (!audioRef.current) return

      // Create audio context
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      // Create analyser
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      // Connect audio element to analyser
      audioSource = audioContext.createMediaElementSource(audioRef.current)
      audioSource.connect(analyser)
      analyser.connect(audioContext.destination)

      // Create data array for frequency data
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      dataArrayRef.current = dataArray
    }

    if (audioRef.current && !audioContextRef.current) {
      setupAudioContext()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      // Clean up audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [audioRef])

  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      if (!ctx || !analyser || !dataArray) return

      // Request next animation frame
      animationRef.current = requestAnimationFrame(draw)

      // Get frequency data
      analyser.getByteFrequencyData(dataArray)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set visualization style
      const barWidth = (canvas.width / dataArray.length) * 2.5
      let barHeight
      let x = 0

      // Draw bars
      for (let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i] / 2

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, 'rgba(100, 149, 237, 0.8)') // cornflowerblue
        gradient.addColorStop(1, 'rgba(100, 149, 237, 0.2)')

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    if (isPlaying) {
      // Resume audio context if it's suspended
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }
      
      // Start animation
      draw()
    } else {
      // Stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, audioRef])

  return (
    <canvas 
      ref={canvasRef} 
      className={cn("w-full h-24 rounded-md", className)}
    />
  )
}
