"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Crown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AuthSignInModal from "./auth-sign-in-modal"

// Import toast for confirmation message
import { useToast } from "@/hooks/use-toast"

export function UserProfileSection() {
  const { user, isAdmin, signOut } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { toast } = useToast()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
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

  if (!user) {
    return (
      <div className="mt-auto animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setIsAuthModalOpen(true)}
        >
          <User size={18} />
        </Button>

        <AuthSignInModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="mt-auto animate-fade-in">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs">
            {isAdmin ? (
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full px-2 py-0.5 flex items-center">
                <Crown size={12} className="mr-1" /> Admin
              </span>
            ) : (
              <>
                {user.photoURL ? (
                  <div className="relative">
                    <Image
                      src={user.photoURL || "/placeholder.svg"}
                      alt={user.displayName || "User"}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground relative">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                )}
                <span className="truncate">{user.displayName || user.email}</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-background">
          <div className="flex items-center justify-start gap-2 p-2">
            {isAdmin ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Crown size={16} className="text-purple-800 dark:text-purple-200" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium">Admin</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <>
                {user.photoURL ? (
                  <Image
                    src={user.photoURL || "/placeholder.svg"}
                    alt={user.displayName || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm text-primary-foreground">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-xs font-medium">{user.displayName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
              </>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-xs cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
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
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
