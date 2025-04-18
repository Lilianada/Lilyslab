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
import { getChangelogEntries } from "@/app/actions/get-changelogs"
import { useChangelogNotification } from "@/hooks/use-changelog-notification"
import { useToast } from "@/hooks/use-toast"
import type { ChangelogEntry } from "@/lib/notion"

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
      try {
        const result = await getChangelogEntries()
        if ("error" in result) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          setChangelogs(result.changelogs)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch changelogs",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchChangelogs()
  }, [toast])

  // Filter changelogs based on search and filters
  const filteredChangelogs = changelogs.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || entry.type === selectedType
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory

    return matchesSearch && matchesType && matchesCategory
  })

  // Toggle changelog expansion
  const toggleExpansion = (id: string) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedEntries(newExpanded)
  }

  // Get badge color based on change type
  const getBadgeColor = (type: ChangelogEntry["type"]) => {
    const colors = {
      feature: "bg-green-500/10 text-green-500",
      improvement: "bg-blue-500/10 text-blue-500",
      fix: "bg-yellow-500/10 text-yellow-500",
      breaking: "bg-red-500/10 text-red-500"
    }
    return colors[type]
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
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="UI/UX">UI/UX</SelectItem>
              <SelectItem value="Architecture">Architecture</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-6">
          {filteredChangelogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No changelog entries found.
            </div>
          ) : (
            filteredChangelogs.map((entry) => (
              <div
                key={entry.id}
                className="border rounded-lg p-4 bg-card transition-all duration-200 hover:shadow-sm"
              >
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleExpansion(entry.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={cn("font-medium", getBadgeColor(entry.type))}>
                        {entry.type}
                      </Badge>
                      <Badge variant="outline">{entry.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium">{entry.title}</h3>
                  </div>
                  <Button variant="ghost" size="icon">
                    {expandedEntries.has(entry.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Expanded Content */}
                {expandedEntries.has(entry.id) && (
                  <div className="mt-4 prose prose-sm dark:prose-invert max-w-none">
                    <Markdown content={entry.content} />
                    {entry.media && entry.media.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {entry.media.map((media, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            {media.type === "image" ? (
                              <img
                                src={media.url}
                                alt="Changelog media"
                                className="w-full h-auto"
                              />
                            ) : (
                              <video
                                src={media.url}
                                controls
                                className="w-full h-auto"
                              />
                            )}
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