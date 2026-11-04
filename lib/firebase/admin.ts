import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Server-only Firebase access. It ignores the Firestore rules, so those can keep
 * the public out entirely. Connects on first use, so builds don't need the key.
 */
function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const encodedKey = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!encodedKey) throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not set");

  return initializeApp({
    credential: cert(JSON.parse(Buffer.from(encodedKey, "base64").toString("utf8"))),
  });
}

export const adminDb = () => getFirestore(getAdminApp());
export const adminAuth = () => getAuth(getAdminApp());
