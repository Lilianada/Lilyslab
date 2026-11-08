"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { markVisitCounted } from "@/components/analytics/VisitorBeacon"
import { TodayPanel } from "@/components/ctrl-room/TodayPanel"

const today = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

export default function CtrlRoomPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  // Only I get in. Everyone else goes home once sign-in has settled.
  useEffect(() => {
    if (!loading && !isAdmin) router.push("/")
  }, [loading, isAdmin, router])

  // My own browsers shouldn't count as new visitors.
  useEffect(() => {
    if (isAdmin) markVisitCounted()
  }, [isAdmin])

  const getToken = useCallback(async () => {
    if (!user) throw new Error("Not signed in")
    return user.getIdToken()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Prevents a flash of the room before the redirect.
  if (!isAdmin) return null

  return (
    <div className="mx-auto w-full max-w-4xl animate-fade-in pb-8 pt-16 sm:px-4">
      <header className="mb-8">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">CTRL Room</h1>
        <div className="flex flex-col font-mono text-xs text-muted-foreground">
          <div>Today: {today()}</div>
          <div>Signed in as: {user?.email}</div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">What needs you today.</p>
      </header>

      <TodayPanel getToken={getToken} />
    </div>
  )
}
