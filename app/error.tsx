"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="mb-4 text-2xl font-medium">A weed got in.</h2>
      <p className="mb-8 text-sm text-muted-foreground">Something went wrong on this page. It's not you, it's the garden.</p>
      <Button onClick={() => reset()}>Pull it and try again</Button>
    </div>
  )
}
