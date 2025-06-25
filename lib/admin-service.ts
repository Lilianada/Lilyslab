import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Collection references
const ADMINS_COLLECTION = "admins"

// Check if a user is an admin
export async function checkUserIsAdmin(email: string): Promise<boolean> {
  if (!email) return false
  if (!db) {
    console.error("Firebase DB is not initialized")
    return false
  }

  try {
    console.log("Checking admin status for:", email)
    const adminDocRef = doc(db, ADMINS_COLLECTION, email.toLowerCase())
    const adminDoc = await getDoc(adminDocRef)

    const isAdmin = adminDoc.exists() && adminDoc.data()?.isAdmin === true
    console.log("Admin status:", isAdmin, "for email:", email)

    return isAdmin
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Set a user as admin (this would typically be done in a secure backend)
export async function setUserAsAdmin(email: string): Promise<boolean> {
  if (!email) return false
  if (!db) {
    console.error("Firebase DB is not initialized")
    return false
  }

  try {
    const adminDocRef = doc(db, ADMINS_COLLECTION, email.toLowerCase())
    await setDoc(adminDocRef, {
      isAdmin: true,
      createdAt: new Date().toISOString(),
      isLoggedIn: true,
    })
    return true
  } catch (error) {
    console.error("Error setting admin status:", error)
    return false
  }
}

// Update the isLoggedIn status for an admin user
export async function setUserIsLoggedIn(email: string, isLoggedIn: boolean): Promise<boolean> {
  if (!email) return false
  if (!db) {
    console.error("Firebase DB is not initialized")
    return false
  }

  try {
    const adminDocRef = doc(db, ADMINS_COLLECTION, email.toLowerCase())
    const adminDoc = await getDoc(adminDocRef)

    if (adminDoc.exists()) {
      await updateDoc(adminDocRef, {
        isLoggedIn: isLoggedIn,
        lastUpdated: new Date().toISOString(),
      })
      return true
    }

    return false
  } catch (error) {
    console.error("Error updating admin login status:", error)
    return false
  }
}
