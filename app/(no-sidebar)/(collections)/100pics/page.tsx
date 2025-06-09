"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"

interface PictureData {
  id: string
  title: string
  dateTaken: string
  imageUrl: string
  dayNumber: number
  blurDataURL?: string
}

// Generate a simple blur placeholder
function generateBlurDataURL(color = '#e5e7eb'): string {
  // Create a 10x10 SVG with the specified color
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill="${color}"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Generate different colored placeholders for variety
function getColoredBlurDataURL(index: number): string {
  const colors = [
    '#f3f4f6', // gray-100
    '#e5e7eb', // gray-200
    '#d1d5db', // gray-300
    '#f9fafb', // gray-50
    '#f1f5f9', // slate-100
    '#f8fafc', // slate-50
    '#fef3f2', // red-50
    '#fef7f0', // orange-50
    '#fefbf0', // yellow-50
    '#f7fef0', // green-50
  ]
  return generateBlurDataURL(colors[index % colors.length])
}

// Generate a shimmer effect for loading state
function generateShimmerDataURL(): string {
  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e2e8f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" fill="url(#shimmer)"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Helper: Get grid dimensions to fill available area with 100 squares
function getBestGrid(width: number, height: number, boxCount: number) {
  let best = { cols: 1, rows: boxCount, size: 0 }
  for (let cols = 1; cols <= boxCount; cols++) {
    const rows = Math.ceil(boxCount / cols)
    const boxWidth = width / cols
    const boxHeight = height / rows
    const size = Math.floor(Math.min(boxWidth, boxHeight))
    if (size > best.size) {
      best = { cols, rows, size }
    }
  }
  return best
}

function ImageModal({
  isOpen,
  onClose,
  image,
  onPrev,
  onNext,
  showPrev,
  showNext,
}: {
  isOpen: boolean
  onClose: () => void
  image: PictureData | null
  onPrev: () => void
  onNext: () => void
  showPrev: boolean
  showNext: boolean
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && showPrev) onPrev()
      if (e.key === "ArrowRight" && showNext) onNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onPrev, onNext, showPrev, showNext])

  if (!isOpen || !image) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      ref={modalRef}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="
        relative w-full
        max-w-sm sm:max-w-md md:max-w-md lg:max-w-xl xl:max-w-2xl
        bg-white dark:bg-gray-900
        rounded-xl overflow-hidden shadow-2xl
        flex flex-col
        animate-in zoom-in-95 duration-200
      ">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all duration-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {showPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {showNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        )}
        <div
          className="
            relative w-full bg-black
            h-[60vw] max-h-[70vh] min-h-[300px]
            sm:h-[350px] md:h-[450px] lg:h-[500px]
            flex items-center justify-center
          "
        >
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
            placeholder="blur"
            blurDataURL={image.blurDataURL || generateBlurDataURL()}
            unoptimized
            priority
          />
        </div>
        <div className="p-4 bg-white dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                Day {image.dayNumber} • {image.dateTaken}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>{image.dayNumber}/100</span>
              </div>
            </div>
          </div>
          {(showPrev || showNext) && (
            <div className="mt-2 text-xs text-gray-400">
              Use ← → keys to navigate
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HundredPicsPage() {
  // For test/demo: 5 sample images, rest placeholders
  const mockPictures: PictureData[] = Array.from({ length: 5 }, (_, i) => ({
    id: `pic-${i + 1}`,
    title: `Picture ${i + 1}`,
    dateTaken: `2025-06-0${i + 1}`,
    imageUrl: `https://picsum.photos/id/${100 + i}/400/400`,
    dayNumber: i + 1,
    blurDataURL: getColoredBlurDataURL(i),
  }))

  const router = useRouter()
  const [pictures] = useState<PictureData[]>(mockPictures)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Track grid dimensions and box size
  const [grid, setGrid] = useState({cols: 10, rows: 10, size: 10})

  const headerRef = useRef<HTMLDivElement>(null)
  const gridPadY = 16 // e.g. py-2 = 16px vertical padding
  const gridPadX = 16 // e.g. px-2 = 16px horizontal padding

  // Responsive grid calculation on resize
  useEffect(() => {
    function updateGrid() {
      const headerH = headerRef.current?.offsetHeight ?? 0
      const width = window.innerWidth - gridPadX * 2
      const height = window.innerHeight - headerH - gridPadY * 2
      setGrid(getBestGrid(width, height, 100))
    }
    updateGrid()
    window.addEventListener("resize", updateGrid)
    return () => window.removeEventListener("resize", updateGrid)
  }, [])

  // Map by day
  const picturesByDay = new Map(pictures.map(pic => [pic.dayNumber, pic]))
  const allDays = Array.from({ length: 100 }, (_, index) => {
    const dayNumber = index + 1
    const picture = picturesByDay.get(dayNumber)
    return {
      dayNumber,
      picture,
      id: picture ? picture.id : `placeholder-${dayNumber}`,
    }
  })

  const imagesOnly = allDays.filter(day => day.picture).map(day => day.picture!)

  const handleImageClick = (picture: PictureData) => {
    const idx = imagesOnly.findIndex(img => img.id === picture.id)
    if (idx !== -1) {
      setSelectedIndex(idx)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIndex(null)
  }
  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    if (selectedIndex < imagesOnly.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }, [selectedIndex, imagesOnly.length])
  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }, [selectedIndex])

  return (
    <div className="h-screen w-screen bg-white dark:bg-gray-950 overflow-hidden flex flex-col">
      {/* Header */}
      <div 
        ref={headerRef}
        className="flex-shrink-0 p-2 sm:p-4 border-b border-gray-200 dark:border-gray-800 text-left"
        style={{minHeight: 0}}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-sm font-medium">100 pics in 100 days</h1>
        </div>
      </div>
      {/* Grid */}
      <div 
        className="flex-1 w-full"
        style={{padding: `${gridPadY}px ${gridPadX}px`, minHeight: 0, minWidth: 0}}
      >
        <div
          className="w-full h-full"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
            gap: "0.25rem" // gap-1
          }}
        >
          {allDays.map((day) =>
            day.picture ? (
              <div
                key={day.id}
                style={{width: "100%", height: "100%"}}
                className="bg-gray-100 dark:bg-gray-800 rounded cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-200 overflow-hidden group"
                onClick={() => handleImageClick(day.picture!)}
              >
                <Image
                  src={day.picture.imageUrl}
                  alt={day.picture.title}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={day.picture.blurDataURL || getColoredBlurDataURL(day.dayNumber)}
                  loading="lazy"
                  unoptimized
                  
                />
              </div>
            ) : (
              <div
                key={day.id}
                style={{width: "100%", height: "100%"}}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded flex items-center justify-center relative overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200"
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '8px 8px'
                  }}></div>
                </div>
                <span className="relative text-gray-400 dark:text-gray-600 font-mono font-medium text-xs hover:text-gray-500 dark:hover:text-gray-500 transition-colors duration-200">
                  {day.dayNumber}
                </span>
              </div>
            )
          )}
        </div>
      </div>
      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        image={selectedIndex !== null ? imagesOnly[selectedIndex] : null}
        onPrev={handlePrev}
        onNext={handleNext}
        showPrev={selectedIndex !== null && selectedIndex > 0}
        showNext={selectedIndex !== null && selectedIndex < imagesOnly.length - 1}
      />
    </div>
  )
}