"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { MessageSquare, Heart, MoreHorizontal, MessageCircle } from "lucide-react"

interface AuthSignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthSignInModal({ isOpen, onClose, onSuccess }: AuthSignInModalProps) {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const user = await signInWithGoogle()
      if (user) {
        if (onSuccess) onSuccess()
        onClose()
      } else {
        setError("Failed to sign in. Please try again.")
      }
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 border-border bg-[#f4f4f2] dark:bg-background">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-medium">Sign In</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Sign in to access additional features like commenting and liking posts
        </DialogDescription>

        <div className="p-4">
          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-accent rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <MessageSquare size={20} className="text-muted-foreground mb-2" />
              <span className="text-xs font-medium">Ask me anything</span>
            </div>

            <div className="bg-white dark:bg-accent rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <MessageCircle size={20} className="text-muted-foreground mb-2" />
              <span className="text-xs font-medium">Comment on posts</span>
            </div>

            <div className="bg-white dark:bg-accent rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <Heart size={20} className="text-muted-foreground mb-2" />
              <span className="text-xs font-medium">Like and save links</span>
            </div>

            <div className="bg-white dark:bg-accent rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <MoreHorizontal size={20} className="text-muted-foreground mb-2" />
              <span className="text-xs font-medium">More soon...</span>
            </div>
          </div>

          {/* Sign in button */}
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
          >
            <div className="bg-white p-1 rounded-full mr-2">
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
            </div>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>

          {error && (
            <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-md animate-fade-in">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
