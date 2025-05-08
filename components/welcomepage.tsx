"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import logoImage from '@/public/images/logo.png';
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"

interface WelcomePageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomePage({ isOpen, onClose }: WelcomePageProps) {
  const { signInWithGoogle: signIn, user } = useAuth()
  const { toast } = useToast()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const router = useRouter()
  
  // Check if this is the user's first visit
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
      
      if (!hasVisitedBefore) {
        // This is a first-time visitor
        setIsFirstVisit(true)
        // Set the flag in localStorage so we know they've visited before
        localStorage.setItem('hasVisitedBefore', 'true')
      }
    }
  }, [])

  // Handle authenticated users by redirecting to dashboard
  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard"
      onClose()
    }
  }, [user, onClose])

  // Don't render anything while redirecting
  if (user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const user = await signIn()
      if (user) {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        })
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "There was a problem signing you in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <DialogContent className="fixed inset-0 flex items-center justify-center p-4 border-none bg-transparent shadow-none max-w-none h-screen w-screen">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md rounded-lg border bg-card p-8 shadow-xl relative"
            >
              <div className="absolute right-4 top-4">
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center justify-center">
                  <Image src={logoImage} alt="Logo" width={60} height={60} className="rounded-full" />
                  <h1 className="ml-3 text-2xl font-bold">Lily's Lab</h1>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-semibold">
                    {isFirstVisit ? "Welcome to Lily's Lab!" : "Welcome back to Lily's Lab"}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {isFirstVisit 
                      ? "Thanks for visiting! Sign in to explore personalized content and features." 
                      : "Sign in to access your dashboard and personalized content."}
                  </p>
                </div>

                <Button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full"
                  size="lg"
                >
                  {isSigningIn ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      Sign in with Google
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
