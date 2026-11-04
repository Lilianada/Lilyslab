"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"

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

// Firebase is several hundred KB, so it is only downloaded for visitors who
// might be signed in. Everyone else never pays for it.
async function mightHaveSession(): Promise<boolean> {
  try {
    if (!indexedDB.databases) return true
    const databases = await indexedDB.databases()
    return databases.some((database) => database.name === "firebaseLocalStorageDb")
  } catch {
    return true
  }
}

const loadFirebase = () =>
  Promise.all([import("firebase/auth"), import("@/lib/garden/firebase"), import("@/lib/admin-service")])

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  const applyRoles = useCallback((adminStatus: boolean) => {
    setIsAdmin(adminStatus)
    setUserRoles(adminStatus ? ["admin", "user"] : ["user"])
  }, [])

  const subscribe = useCallback(async () => {
    if (unsubscribeRef.current) return
    const [{ onAuthStateChanged }, { auth }, { checkUserIsAdmin }] = await loadFirebase()
    if (!auth || unsubscribeRef.current) {
      setLoading(false)
      return
    }

    unsubscribeRef.current = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (nextUser?.email) {
        applyRoles(await checkUserIsAdmin(nextUser.email))
      } else {
        setIsAdmin(false)
        setUserRoles([])
      }
      setLoading(false)
    })
  }, [applyRoles])

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      if (await mightHaveSession()) {
        if (!cancelled) await subscribe()
      } else if (!cancelled) {
        setLoading(false)
      }
    }

    const hasIdleCallback = typeof window.requestIdleCallback === "function"
    const handle = hasIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : window.setTimeout(start, 500)

    return () => {
      cancelled = true
      if (hasIdleCallback) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      unsubscribeRef.current?.()
      unsubscribeRef.current = null
    }
  }, [subscribe])

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const [, { signInWithGoogle: firebaseSignInWithGoogle }, { checkUserIsAdmin, setUserIsLoggedIn }] =
        await loadFirebase()
      // Visitors who skipped Firebase on load still need live auth updates now.
      await subscribe()
      const signedInUser = await firebaseSignInWithGoogle()

      if (signedInUser?.email) {
        const adminStatus = await checkUserIsAdmin(signedInUser.email)
        if (adminStatus) await setUserIsLoggedIn(signedInUser.email, true)
        applyRoles(adminStatus)
      }

      setUser(signedInUser)
      return signedInUser
    } catch (error) {
      console.error("Error signing in with Google:", error)
      return null
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      const [{ signOut: firebaseSignOut }, { auth }, { setUserIsLoggedIn }] = await loadFirebase()
      if (user?.email && isAdmin) await setUserIsLoggedIn(user.email, false)
      if (auth) await firebaseSignOut(auth)
      setUser(null)
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
