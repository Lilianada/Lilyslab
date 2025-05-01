"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Compass, MoveLeft, Home, MapPin } from "lucide-react"

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const router = useRouter()
  
  return (
    <div className={`min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <div className="max-w-md w-full">
        <div className="relative mb-8">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/40 to-primary/10 opacity-70 blur-xl"></div>
          <div className="relative flex h-32 w-32 mx-auto items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full bg-muted animate-ping opacity-20"></div>
            <div className="relative flex h-24 w-24 rounded-full bg-background shadow-lg items-center justify-center border border-border">
              <Compass className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">
            Oops! It seems you've wandered into uncharted territory.
            The page you're looking for doesn't exist or is still under construction.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <MoveLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>Location: 404 - Not Found</span>
          </div>
        </div>
      </div>
    </div>
  )
}
