"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PinCard } from "@/components/pin-card"
import { useInView } from "react-intersection-observer"
import Masonry from 'react-masonry-css'

// Sample data with Unsplash images
const samplePins = [
  {
    id: 1,
    title: "Mountain Serenity",
    description: "Majestic mountain peaks shrouded in morning mist",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["nature", "mountains", "landscape"],
  },
  {
    id: 2,
    title: "Urban Nights",
    description: "City skyline illuminated in the dark",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    tags: ["city", "night", "architecture"],
  },
  {
    id: 3,
    title: "Ocean Waves",
    description: "Powerful waves crashing on rocky shore",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["ocean", "nature", "waves"],
  },
  {
    id: 4,
    title: "Desert Solitude",
    description: "Endless sand dunes under golden sunlight",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80",
    tags: ["desert", "landscape", "nature"],
  },
  {
    id: 5,
    title: "Forest Mystery",
    description: "Misty forest with towering ancient trees",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=874&q=80",
    tags: ["forest", "nature", "mist"],
  },
  {
    id: 6,
    title: "Modern Architecture",
    description: "Contemporary building with geometric patterns",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=771&q=80",
    tags: ["architecture", "modern", "design"],
  },
  {
    id: 7,
    title: "Northern Lights",
    description: "Aurora Borealis dancing in the night sky",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    tags: ["aurora", "night", "nature"],
  },
  
  {
    id: 9,
    title: "Autumn Colors",
    description: "Fall foliage in brilliant red and orange",
    image: "https://images.unsplash.com/photo-1507783548227-544c3b8fc065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=875&q=80",
    tags: ["autumn", "nature", "trees"],
  },
  {
    id: 10,
    title: "Wildlife Portrait",
    description: "Majestic lion in natural habitat",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=859&q=80",
    tags: ["wildlife", "animals", "nature"],
  },
  {
    id: 11,
    title: "Tranquil Lake",
    description: "Mirror-like lake reflecting mountain peaks",
    image: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    tags: ["lake", "nature", "reflection"],
  },
  {
    id: 12,
    title: "Ancient Temple",
    description: "Historic temple architecture at sunset",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    tags: ["architecture", "history", "temple"],
  },
]

export default function PicPinsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [pins, setPins] = useState(samplePins)
  const [loading, setLoading] = useState(false)
  const { ref: loadMoreRef, inView } = useInView()

  // Define breakpoints for the Masonry grid
  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 2,
    640: 1
  }

  // Load more pins when scrolling
  useEffect(() => {
    if (inView && !loading) {
      loadMorePins()
    }
  }, [inView])

  const loadMorePins = async () => {
    setLoading(true)
    // Simulate loading more pins
    setTimeout(() => {
      setPins((prev) => [...prev, ...samplePins])
      setLoading(false)
    }, 1000)
  }

  // Filter pins based on search query
  const filteredPins = pins.filter(
    (pin) =>
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Pic Pins</h1>
            <p className="text-sm text-muted-foreground">
            A readaptation of the Pinterest layout. Hover on any pin to see more details.
            </p>
          </div>
        </header>
        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search pins by title, description, or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {filteredPins.map((pin) => (
            <div key={pin.id} className="mb-4">
              <PinCard
                title={pin.title}
                description={pin.description}
                image={pin.image}
                tags={pin.tags}
              />
            </div>
          ))}
        </Masonry>

        {/* Loading Indicator */}
        <div ref={loadMoreRef} className="mt-8 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading more pins...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 