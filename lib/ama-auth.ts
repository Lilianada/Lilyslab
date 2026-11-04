import { adminAuth, adminDb } from "@/lib/firebase/admin"

// Verifies the Firebase ID token in the Authorization header and checks the admins collection.
export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization") || ""
  const idToken = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (!idToken) return false

  try {
    const { email, email_verified: emailVerified } = await adminAuth().verifyIdToken(idToken)
    if (!email || !emailVerified) return false

    const admin = await adminDb().collection("admins").doc(email.toLowerCase()).get()
    return admin.data()?.isAdmin === true
  } catch (error) {
    console.error("Error verifying admin token:", error)
    return false
  }
}
