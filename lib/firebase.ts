import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Let's log the environment variables to verify they exist (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("Firebase config check:", {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓ exists" : "✗ missing",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✓ exists" : "✗ missing",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓ exists" : "✗ missing",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✓ exists" : "✗ missing",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✓ exists" : "✗ missing",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✓ exists" : "✗ missing",
  })
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only if config is valid
const isConfigValid =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

let app
if (isConfigValid) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
} else {
  console.error("Firebase configuration is incomplete. Authentication will not work.")
}

const auth = isConfigValid ? getAuth(app) : null
const db = isConfigValid ? getFirestore(app) : null
const googleProvider = new GoogleAuthProvider()

// Helper function for Google sign-in
export const signInWithGoogle = async () => {
  if (!auth) {
    console.error("Firebase auth is not initialized due to missing configuration")
    throw new Error("Firebase authentication is not properly configured")
  }

  try {
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver)
    return result.user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export { auth, googleProvider, db }
