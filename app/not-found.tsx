"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Construction } from "lucide-react"

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

    const router = useRouter();
  return (
    <div className={`max-w-xl mx-auto my-20 text-center ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <h2 className="mb-4 text-2xl font-medium flex">Sorry, the page you're looking for doesn't exist or still under construction
        </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Go Back
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

