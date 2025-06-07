"use client"

import { Crown } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import Sidebar from "./sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { ThemeToggle } from "../theme/theme-toggle"
import { UserProfileSection } from "../auth/user-profile-section"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const { isAdmin } = useAuth()

  return (
    <div className="flex items-center justify-between border-b  p-4 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-sm font-medium">Lily's Lab</h1>
      </Link>
      <div className="flex items-center gap-2">

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md p-0">
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="sidebar flex flex-col p-0 bg-muted gap-0" aria-describedby="mobile-navigation-description">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center">
                <h2 className="text-sm leading-0 font-medium">Menu</h2>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar mobile onNavClick={() => setOpen(false)} />
            </div>
            
              <div className="border-t p-4 flex justify-between">
                
                <ThemeToggle />
                {isAdmin ? (
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full px-2 py-0.5 flex items-center text-xs">
                    <Crown size={12} className="mr-1" /> Admin
                  </span>
                ) : (
                  <UserProfileSection />
                )}
              </div>
            
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
