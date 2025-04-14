"use client"

import { LogOut, Crown } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import Sidebar from "./sidebar"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { UserProfileSection } from "./user-profile-section"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { toast } = useToast()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      setOpen(false)
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-4 md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Lily's Lab Logo" width={32} height={32} className="rounded-md" />
        <h1 className="text-sm font-medium">Lily's Lab</h1>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isAdmin ? (
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full px-2 py-0.5 flex items-center text-xs">
            <Crown size={12} className="mr-1" /> Admin
          </span>
        ) : (
          <UserProfileSection />
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md p-0">
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Lily's Lab" width={32} height={32} className="rounded-md hidden" />
                <h2 className="text-sm leading-0 font-medium">Menu</h2>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar mobile onNavClick={() => setOpen(false)} />
            </div>
            {user && (
              <div className="border-t p-4 flex justify-between">
                {isAdmin && (
                  <div className="flex justify-center">
                    <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full px-2 py-1 flex items-center text-xs">
                      <Crown size={12} className="mr-1" /> Admin
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                      Signing out...
                    </>
                  ) : (
                    <>
                      <LogOut size={14} className="mr-2" />
                      Sign out
                    </>
                  )}
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
