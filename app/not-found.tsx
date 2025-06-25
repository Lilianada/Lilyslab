"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-xl mx-auto text-center ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <h2 className="mb-4 text-2xl font-medium">Page Not Found</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  )
}
