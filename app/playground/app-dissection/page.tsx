"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlaceholderImage from "@/components/placeholder-image"
import { ExternalLink } from "lucide-react"

interface AppDissection {
  id: string
  title: string
  slug: string
  logo: string | null
  category: string
}

export default function AppDissectionPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [apps, setApps] = useState<AppDissection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)

    // Fetch app dissections from Notion
    async function fetchAppDissections() {
      try {
        const response = await fetch("/api/app-dissections")
        const data = await response.json()
        setApps(data.apps || [])
      } catch (error) {
        console.error("Error fetching app dissections:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppDissections()
  }, [])

  // Filter apps based on active tab
  const filteredApps = activeTab === "all" ? apps : apps.filter((app) => app.category === activeTab)

  return (
    <div className={`max-w-xl mx-auto ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">App Dissection</h1>
        <p className="text-xs text-muted-foreground">In-depth analyses of applications and their design patterns.</p>
      </header>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my">My Apps</TabsTrigger>
          <TabsTrigger value="fancy">Apps I Fancy</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="space-y-4 stagger-children">
          {filteredApps.map((app, index) => (
            <Link
              key={app.id}
              href={`/playground/app-dissection/${app.slug}`}
              className="group flex overflow-hidden rounded-lg border transition-colors hover:bg-accent opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PlaceholderImage
                width={80}
                height={80}
                className="h-auto w-20 object-cover"
                alt={`${app.title} logo`}
                src={app.logo || undefined}
              />
              <div className="flex flex-1 items-center justify-between p-4">
                <h3 className="text-sm font-medium group-hover:text-primary">{app.title}</h3>
                <ExternalLink size={16} className="text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-sm text-muted-foreground">No app dissections found for this category.</p>
        </div>
      )}
    </div>
  )
}
