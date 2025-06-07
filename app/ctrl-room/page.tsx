"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Settings, User, FileText } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import UploadAudio from "@/components/ctrl-room/upload-audio"

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
    <div className="sm:container max-w-6xl mx-auto py-8 animate-fade-in">
      <header className="mb-8 flex items-center gap-3">
        {/* <Shield className="h-8 w-8 text-primary" /> */}
        <div>
          <h1 className="text-2xl font-bold mb-1">CTRL Room</h1>
          <p className="text-sm text-muted-foreground">
            Admin control panel for managing site content and settings
          </p>
        </div>
      </header>

      <Tabs defaultValue="audio" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span className="hidden md:flex">Audio Library</span>
            <span className="md:hidden">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="space-y-6">
        <UploadAudio/>
        </TabsContent>

        <TabsContent value="content">
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">Content management coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">User management coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">Settings coming soon</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  )
}
