"use client"

import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { type Resource } from "@/types"

export default function ResourcesPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setIsLoaded(true)

    // Fetch resources from Notion
    async function fetchResources() {
      try {
        const response = await fetch("/api/resources")
        const data = await response.json()
        setResources(data.resources || [])
        setFilteredResources(data.resources || [])
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.resources.map((r: Resource) => r.category)))
        setCategories(uniqueCategories as string[])
      } catch (error) {
        console.error("Error fetching resources:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  useEffect(() => {
    const filtered = resources.filter((resource) => {
      const name = resource.name ?? "";
      const description = resource.description ?? "";
      const tags = Array.isArray(resource.tags) ? resource.tags : [];
      const category = resource.category ?? "";
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search) ||
        tags.some(tag => (tag ?? "").toLowerCase().includes(search));
      const matchesCategory = !activeCategory || category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredResources(filtered);
  }, [searchQuery, activeCategory, resources]);

  return (
    <div className={`max-w-5xl mx-auto px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">Resources</h1>
        <p className="text-sm text-muted-foreground">
          A collection of tools, templates, and resources I've created or found useful.
        </p>
      </header>

      <div className="mb-6 space-y-4">
        <SearchBar
          placeholder="Search resources by name, description, or tags..."
          onSearch={setSearchQuery}
          className="max-w-md"
        />

        <div className="flex flex-wrap gap-2">
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
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 stagger-children">
          {filteredResources.map((resource, index) => (
            <div
              key={resource.id}
              className="rounded-lg border p-4 opacity-0 animate-slide-up bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-2 flex items-start justify-between">
                <h2 className="text-sm font-medium">{resource.name}</h2>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{resource.description}</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {resource.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="text-xs w-full bg-card" asChild>
                <a href={resource.url || "#"} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} className="mr-1" /> View Resource
                </a>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-sm text-muted-foreground">No resources found matching your search.</p>
        </div>
      )}
    </div>
  )
}
