"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Markdown } from "@/components/markdown"
import { getChangelogs } from "@/lib/notion"
import type { ChangelogEntry } from "@/lib/notion"
import { useToast } from "@/hooks/use-toast"

export default function ChangelogPage() {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchChangelogs = async () => {
      setIsLoading(true)
      try {
        const entries = await getChangelogs()
        console.log(`Fetched ${entries.length} changelog entries with content`)
        
        if (Array.isArray(entries)) {
          setChangelogs(entries)
        } else {
          console.error("getChangelogs did not return an array:", entries)
          setChangelogs([])
          toast({
            title: "Data Error",
            description: "Received invalid data format for changelogs.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Error fetching changelogs in component:", error)
        toast({
          title: "Error Fetching Changelogs",
          description: error.message || "Failed to fetch changelogs.",
          variant: "destructive",
        })
        setChangelogs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchChangelogs()
  }, [toast])

  // Filter changelogs based on search and filters
  const filteredChangelogs = changelogs.filter(entry => {
    const titleMatch = entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true
    const contentMatch = entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true
    const typeMatch = selectedType === "all" || entry.type === selectedType
    const categoryMatch = selectedCategory === "all" || entry.category === selectedCategory

    return titleMatch && contentMatch && typeMatch && categoryMatch
  })

  // Toggle changelog expansion
  const toggleExpansion = (id: string) => {
    setExpandedEntries((prevExpanded) => {
      const newExpanded = new Set(prevExpanded)
      if (newExpanded.has(id)) {
        newExpanded.delete(id)
      } else {
        newExpanded.add(id)
      }
      return newExpanded
    })
  }

  // Get badge color based on change type
  const getBadgeColor = (type: ChangelogEntry["type"]): string => {
    const colors: Record<ChangelogEntry["type"], string> = {
      feature: "bg-green-500/10 text-green-500 border border-green-500/30",
      improvement: "bg-blue-500/10 text-blue-500 border border-blue-500/30",
      fix: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30",
      breaking: "bg-red-500/10 text-red-500 border border-red-500/30",
    }
    return colors[type] ?? colors.improvement
  }

  if (isLoading) {
    return (
      <div className="min-h-screen animate-fade-in flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading changelogs...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
          <p className="mt-2 text-muted-foreground">
            Track the evolution of Lily's Lab - documenting improvements, fixes, and new features.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search changes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="feature">Features</SelectItem>
              <SelectItem value="improvement">Improvements</SelectItem>
              <SelectItem value="fix">Fixes</SelectItem>
              <SelectItem value="breaking">Breaking Changes</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="UI/UX">UI/UX</SelectItem>
              <SelectItem value="Architecture">Architecture</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-6">
          {filteredChangelogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg p-6">
              No changelog entries found matching your current filters.
            </div>
          ) : (
            filteredChangelogs.map((entry) => (
              <div
                key={entry.id}
                className="border rounded-lg bg-card transition-all duration-200 hover:shadow-md overflow-hidden"
              >
                <div
                  className="flex items-start justify-between cursor-pointer p-4 hover:bg-muted/30 transition-colors"
                  onClick={() => toggleExpansion(entry.id)}
                  role="button"
                  aria-expanded={expandedEntries.has(entry.id)}
                  aria-controls={`changelog-content-${entry.id}`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        className={cn(
                          "font-medium whitespace-nowrap px-2.5 py-0.5 text-xs",
                          getBadgeColor(entry.type)
                        )}
                      >
                        {entry.type}
                      </Badge>
                      <Badge variant="outline" className="whitespace-nowrap px-2.5 py-0.5 text-xs">
                        {entry.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(entry.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium">{entry.title ?? "Untitled Entry"}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                      expandedEntries.has(entry.id) ? "Collapse" : "Expand"
                    }
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {expandedEntries.has(entry.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {/* Expanded Content */}
                {expandedEntries.has(entry.id) && (
                  <div
                    id={`changelog-content-${entry.id}`}
                    className="p-4 border-t border-border bg-background prose prose-sm dark:prose-invert max-w-none"
                  >
                    {entry.content ? (
                      <Markdown content={entry.content} />
                    ) : (
                      <div className="text-sm text-muted-foreground py-4 text-center">
                        No detailed content available.
                      </div>
                    )}
                    {entry.media && entry.media.length > 0 && (
                      <div className="mt-4 space-y-4 not-prose">
                        {entry.media.map((media, index) => (
                          <div key={index} className="rounded-lg overflow-hidden border">
                            {media.type === "image" ? (
                              <img
                                src={media.url}
                                alt="Changelog media"
                                className="w-full h-auto object-contain max-h-96"
                              />
                            ) : media.type === 'video' ? (
                              <video
                                src={media.url}
                                controls
                                className="w-full h-auto max-h-96"
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 