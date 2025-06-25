"use client"

import { useEffect, useState } from "react"
import { getApps } from "firebase/app"

export function FirebaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")

  useEffect(() => {
    try {
      const apps = getApps()
      if (apps.length > 0) {
        setStatus("connected")
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Firebase status check error:", error)
      setStatus("error")
    }
  }, [])

  if (status === "loading") {
    return <span className="text-xs text-muted-foreground">Checking Firebase connection...</span>
  }

  if (status === "connected") {
    return <span className="text-xs text-green-500">Firebase connected</span>
  }

  return <span className="text-xs text-red-500">Firebase connection error</span>
}
