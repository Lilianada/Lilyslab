// Import Firebase modules directly from the package root to avoid path issues
import { initializeApp, getApps, getApp } from "firebase/app"
import { GoogleAuthProvider, getAuth, signInWithPopup, browserPopupRedirectResolver } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


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

// Initialize auth and db with proper typing
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Initialize with proper types
let auth: Auth | null = null;
let db: Firestore | null = null;

// Only initialize if config is valid and app exists
if (isConfigValid && app) {
  // Initialize Firestore
  db = getFirestore(app);
  
  // This module is itself loaded lazily, so auth can initialise synchronously.
  auth = getAuth(app);
}

// Create Google provider and configure it to always prompt for account selection
const googleProvider = new GoogleAuthProvider()
// Add custom parameters to always force account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Helper function for Google sign-in with better error handling
export const signInWithGoogle = async () => {
  if (!auth) {
    console.error("Firebase auth is not initialized due to missing configuration")
    throw new Error("Firebase authentication is not properly configured")
  }

  try {
    // Force account selection by setting custom parameters again right before sign-in
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    })
    
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver)
    return result.user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export { auth, googleProvider, db }
