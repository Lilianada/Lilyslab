"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sprout, User } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { markVisitCounted } from "@/components/analytics/VisitorBeacon"
import { TodayPanel } from "@/components/ctrl-room/TodayPanel"

export default function CtrlRoomPage() {
  const { user, userRoles, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only update state when auth is no longer loading
    if (!loading) {
      // Check if user is admin
      if (user && userRoles) {
        setIsAdmin(userRoles.includes('admin'))
      } else {
        setIsAdmin(false)
      }
      setIsLoading(false)
    }
  }, [user, userRoles, loading])

  // Redirect non-admin users
  useEffect(() => {
    // Only redirect if auth loading is complete and we've confirmed the user is logged in but not an admin
    // Don't redirect if still loading auth state
    if (!loading && !isLoading && user && !isAdmin) {
      router.push('/')
    }
    // Only redirect if auth loading is complete and there's no user (not logged in)
    else if (!loading && !isLoading && !user) {
      router.push('/')
    }
  }, [isAdmin, isLoading, router, user, loading])

  // My own browsers shouldn't count as new visitors.
  useEffect(() => {
    if (isAdmin) markVisitCounted()
  }, [isAdmin])

  const getToken = useCallback(async () => {
    if (!user) throw new Error("Not signed in")
    return user.getIdToken()
  }, [user])

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 animate-fade-in">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect, but prevent flash of content
  }

  return (
    <div className="sm:container max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-1">CTRL Room</h1>
        <p className="text-sm text-muted-foreground">What needs you today.</p>
      </header>

      <Tabs defaultValue="today" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            <span>Today</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <TodayPanel getToken={getToken} />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="text-center p-8 border border-dashed rounded-lg">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">User Management</h3>
            <p className="text-muted-foreground">User management features coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  )
}
