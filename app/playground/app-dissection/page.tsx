"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlaceholderImage from "@/components/placeholder-image"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppDissection {
  id: string
  title: string
  slug: string
  logo: string | null
  category: string
}

export default function AppDissectionPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [apps, setApps] = useState<AppDissection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tabs, setTabs] = useState<string[]>([
    "Web Apps",
    "Mobile Apps"
  ])

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
    <div className={`max-w-5xl mx-auto px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">App Dissection</h1>
        <p className="text-sm text-muted-foreground">In-depth analyses of applications and their design patterns.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={activeTab === null ? "default" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() => setActiveTab(null)}
        >
          All
        </Button>
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-40 bg-muted animate-pulse rounded-lg"></div>
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
