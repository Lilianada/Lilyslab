// Import Firebase modules directly from the package root to avoid path issues
import { initializeApp, getApps, getApp } from "firebase/app"
// Use dynamic imports for auth to avoid the file not found error
import { GoogleAuthProvider } from "firebase/auth"
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
  
  // Initialize Auth dynamically to avoid path issues
  import('firebase/auth').then(({ getAuth }) => {
    auth = getAuth(app!);
  }).catch(err => {
    console.error('Error loading auth module:', err);
  });
}

const googleProvider = new GoogleAuthProvider()

// Helper function for Google sign-in
export const signInWithGoogle = async () => {
  if (!auth) {
    console.error("Firebase auth is not initialized due to missing configuration")
    throw new Error("Firebase authentication is not properly configured")
  }

  try {
    // Dynamically import the required functions
    const { signInWithPopup, browserPopupRedirectResolver } = await import('firebase/auth');
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver)
    return result.user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export { auth, googleProvider, db }
