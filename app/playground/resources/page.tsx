"use client"

import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

interface Resource {
  id: string
  title: string
  description: string
  type: "download" | "external"
  url: string
  category: string
  files?: string | null
}

export default function ResourcesPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)

    // Fetch resources from Notion
    async function fetchResources() {
      try {
        const response = await fetch("/api/resources")
        const data = await response.json()
        setResources(data.resources || [])

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.resources.map((r: Resource) => r.category)))
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching resources:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  const filteredResources = activeCategory ? resources.filter((r) => r.category === activeCategory) : resources

  return (
    <div className={`max-w-2xl mx-auto ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">Resources</h1>
        <p className="text-xs text-muted-foreground">
          A collection of tools, templates, and resources I've created or found useful.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
          <div className="h-40 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 stagger-children">
          {filteredResources.map((resource, index) => (
            <div
              key={resource.id}
              className="rounded-lg border p-4 opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-2 flex items-start justify-between">
                <h2 className="text-sm font-medium">{resource.title}</h2>
                <span className="rounded-full bg-muted px-2 py-1 text-[10px]">{resource.category}</span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{resource.description}</p>
              <Button variant="outline" size="sm" className="text-xs w-full" asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.type === "download" ? (
                    <>
                      <Download size={14} className="mr-1" /> Download
                    </>
                  ) : (
                    <>
                      <ExternalLink size={14} className="mr-1" /> Check It
                    </>
                  )}
                </a>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-sm text-muted-foreground">No resources found for this category.</p>
        </div>
      )}
    </div>
  )
}
