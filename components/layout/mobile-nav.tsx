"use client"

import { GripVertical } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import Sidebar from "./sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../theme/theme-toggle"
import { UserProfileSection } from "../auth/user-profile-section"
import { WanderButton } from "../fun/WanderButton"
import { Breadcrumbs } from "./breadcrumbs"
import Link from "next/link"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-between nav_bar p-4 w-full">
      <div className="flex items-center gap-2 min-w-0">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <h1 className="text-sm font-medium">Lily's Garden</h1>
        </Link>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <WanderButton />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-md p-0 m-0" aria-label="Toggle menu">
              <GripVertical size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="sidebar flex flex-col p-0 bg-muted gap-0" aria-describedby={undefined}>
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center">
                <SheetTitle className="text-sm leading-none font-medium">Menu</SheetTitle>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar onNavClick={() => setOpen(false)} />
            </div>

            <div className="border-t p-4 flex justify-between">
              <UserProfileSection />
              <ThemeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
