"use client"

import { useEffect, useState, ReactNode } from "react"

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component that only renders its children on the client side
 * This prevents hydration errors from dynamic content
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
