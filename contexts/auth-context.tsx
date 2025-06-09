"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"
import { auth, signInWithGoogle as firebaseSignInWithGoogle } from "@/lib/garden/firebase"
import { checkUserIsAdmin, setUserIsLoggedIn } from "@/lib/admin-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  userRoles: string[]
  signInWithGoogle: () => Promise<User | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  userRoles: [],
  signInWithGoogle: async () => null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Make sure auth is not null before using it
    if (!auth) {
      setLoading(false);
      return () => {};
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      // Check if user is admin
      if (user && user.email) {
        // Check if user is in admins collection
        const adminStatus = await checkUserIsAdmin(user.email)
        setIsAdmin(adminStatus)
        
        // Set user roles - in a real app, you would fetch this from Firestore
        if (adminStatus) {
          setUserRoles(['admin', 'user'])
        } else {
          setUserRoles(['user'])
        }
      } else {
        setIsAdmin(false)
        setUserRoles([])
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const user = await firebaseSignInWithGoogle()

      // Check if the new user is an admin and update isLoggedIn flag
      if (user && user.email) {
        const adminStatus = await checkUserIsAdmin(user.email)

        if (adminStatus) {
          // Update isLoggedIn flag to true for the admin
          await setUserIsLoggedIn(user.email, true)
          setUserRoles(['admin', 'user'])
        } else {
          setUserRoles(['user'])
        }

        setIsAdmin(adminStatus)
      }

      return user
    } catch (error) {
      console.error("Error signing in with Google:", error)
      return null
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      // If user is admin, update isLoggedIn flag to false
      if (user && user.email && isAdmin) {
        await setUserIsLoggedIn(user.email, false)
      }

      // Make sure auth is not null before signing out
      if (auth) {
        await firebaseSignOut(auth)
      }
      setIsAdmin(false)
      setUserRoles([])
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, userRoles, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
