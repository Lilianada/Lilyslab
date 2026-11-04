import { checkUserIsAdmin } from "@/lib/admin-service"

// Verifies the Firebase ID token in the Authorization header and checks the admins collection.
export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization") || ""
  const idToken = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (!idToken) return false

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    )
    if (!res.ok) return false

    const data = await res.json()
    const account = data.users?.[0]
    if (!account?.email || !account.emailVerified) return false

    return await checkUserIsAdmin(account.email)
  } catch (error) {
    console.error("Error verifying admin token:", error)
    return false
  }
}
