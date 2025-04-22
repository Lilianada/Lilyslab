"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"

type Utility = {
  id: string
  name: string
  description: string
  url: string
  tags: string[]
  category: string
}

export default function UtilitiesPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [utilities, setUtilities] = useState<Utility[]>([])
  const [filteredUtilities, setFilteredUtilities] = useState<Utility[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setIsLoaded(true)

    async function fetchUtilities() {
      try {
        const response = await fetch("/api/utilities")
        const data = await response.json()
        setUtilities(data.utilities || [])
        setFilteredUtilities(data.utilities || [])
        
      } catch (error) {
        console.error("Error fetching utilities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUtilities()
  }, [])

  useEffect(() => {
    const filtered = utilities.filter((utility) => {
      const name = utility.name ?? "";
      const description = utility.description ?? "";
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search) 
      return matchesSearch;
    });
    setFilteredUtilities(filtered);
  }, [searchQuery, utilities]);

  return (
    <div className={`max-w-5xl mx-auto sm:px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium">Fun Projects</h1>
        <p className="text-sm text-muted-foreground">
          Apps I have built for fun and for work.
        </p>
      </header>

      {/* <div className="mb-6 space-y-4">
        <SearchBar
          placeholder="Search utilities by name, description, or tags..."
          onSearch={setSearchQuery}
          className="max-w-md"
        />
      </div> */}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-muted rounded-lg"></div>
          ))}
        </div>
      ) : filteredUtilities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
          {filteredUtilities.map((utility, index) => (
            <Card
              key={utility.id}
              className="rounded-lg border p-4 opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
                <CardHeader className="text-sm font-medium p-0 mb-2">{utility.name}</CardHeader>
              <CardDescription className="mb-3 text-xs text-muted-foreground">{utility.description}</CardDescription>
              
              <Button variant="outline" size="sm" className="text-xs w-full bg-card" asChild>
                <a 
                  href={utility.url.startsWith('http') ? utility.url : `https://${utility.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} className="mr-1" /> Try it
                </a>
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-sm text-muted-foreground">No utilities found matching your search.</p>
        </div>
      )}
    </div>
  )
}
