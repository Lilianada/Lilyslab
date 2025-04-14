"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface GoogleAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      console.error("Error during sign in:", error)
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to ask a question</DialogTitle>
          <DialogDescription>
            Sign in with Google to submit your question. This helps verify your identity and allows us to notify you
            when your question is answered.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <Button onClick={handleSignIn} disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
