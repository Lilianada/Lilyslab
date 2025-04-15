"use client"

import { useEffect, useState } from "react"
import { ToolCard } from "@/components/tool-card"
import { SearchBar } from "@/components/search-bar"
import { type Tool } from "@/types"
import { Button } from "@/components/ui/button"

const categories = ["All", "Productivity", "Education", "Utilities", "Health & Fitness"]

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    async function fetchTools() {
      try {
        const response = await fetch(`/api/tools?category=${selectedCategory}`)
        const data = await response.json()
        setTools(data)
        setFilteredTools(data)
      } catch (error) {
        console.error("Error fetching tools:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTools()
  }, [selectedCategory])

  useEffect(() => {
    const filtered = tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    setFilteredTools(filtered)
  }, [searchQuery, selectedCategory, tools])

  return (
    <div className={`max-w-5xl mx-auto px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-4">
        <h1 className="mb-1 text-xl font-medium">Tools</h1>
        <p className="text-sm text-muted-foreground"> A curated collection of {tools.length} tools and resources for digital minimalists.</p>
      </header>

      <div className="mb-6 space-y-4">
        <SearchBar
          placeholder="Search tools by name, description, or category..."
          onSearch={setSearchQuery}
          className="max-w-md mb-12"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
            
          ))}
        </div>
      </div> 
      

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              name={tool.name}
              description={tool.description}
              logo={tool.logo}
              platforms={tool.platforms}
              url={tool.url}
            />
          ))}
        </div>
      )}
    </div>
  )
} 