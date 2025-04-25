"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Scissors, FileText } from "lucide-react"

export default function PlaygroundPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-xl mx-auto ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">Playground</h1>
        <p className="text-xs text-muted-foreground">A collection of fun experiments, analyses, and resources.</p>
      </header>

      <div className="space-y-6 stagger-children">
        <div className="opacity-0 animate-slide-up">
          <Link
            href="/playground/app-dissection"
            className="flex items-center gap-3 rounded-md border p-4 transition-colors hover:bg-accent"
          >
            <Scissors size={20} className="text-primary" />
            <div>
              <h2 className="text-sm font-medium">App Dissection</h2>
              <p className="text-xs text-muted-foreground">
                In-depth analyses of popular applications and their design patterns.
              </p>
            </div>
          </Link>
        </div>

        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Link
            href="/playground/resources"
            className="flex items-center gap-3 rounded-md border p-4 transition-colors hover:bg-accent"
          >
            <FileText size={20} className="text-primary" />
            <div>
              <h2 className="text-sm font-medium">Resources</h2>
              <p className="text-xs text-muted-foreground">
                A collection of tools, templates, and resources I've created or found useful.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
