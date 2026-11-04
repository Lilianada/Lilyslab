import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAdminRequest } from '@/lib/ama-auth';
import { sendReplyEmail } from '@/lib/ama-email';

// Small batches keep each request within serverless time limits and Resend's rate limit
const BATCH_SIZE = 8;
const DELAY_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dryRun = true } = await request.json().catch(() => ({}));

    const snapshot = await adminDb().collection('ama-questions').get();
    const pending = snapshot.docs.filter((d) => {
      const data = d.data();
      return (
        typeof data.response === 'string' &&
        data.response.trim() !== '' &&
        data.email &&
        !data.notifiedAt
      );
    });

    if (dryRun) {
      return NextResponse.json({ dryRun: true, remaining: pending.length });
    }

    let sent = 0;
    let failed = 0;
    for (const d of pending.slice(0, BATCH_SIZE)) {
      const data = d.data();
      try {
        await sendReplyEmail({
          to: data.email,
          name: data.name || 'there',
          question: data.question || '',
          response: data.response,
          questionId: d.id,
          late: true,
        });
        await d.ref.update({ notifiedAt: FieldValue.serverTimestamp() });
        sent++;
      } catch (error) {
        console.error("API: Backlog email failed for", d.id, error);
        failed++;
      }
      await sleep(DELAY_MS);
    }

    // Failures stay pending; stop looping on them so the client doesn't retry forever
    const remaining = pending.length - sent;
    return NextResponse.json({ sent, failed, remaining, done: failed > 0 || remaining === 0 });
  } catch (error: unknown) {
    console.error("API: Error notifying backlog:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Failed to notify backlog", details: errorMessage }, { status: 500 });
  }
}
