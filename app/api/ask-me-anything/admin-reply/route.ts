import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAdminRequest } from '@/lib/ama-auth';
import { sendReplyEmail } from '@/lib/ama-email';

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, adminResponse } = body;
    
    if (!questionId || !adminResponse) {
      return NextResponse.json(
        { error: "Question ID and admin response are required" },
        { status: 400 }
      );
    }

    const questionRef = adminDb().collection('ama-questions').doc(questionId);
    const snapshot = await questionRef.get();
    const data = snapshot.data();
    if (!data) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    await questionRef.update({
      response: adminResponse,
      responseDate: FieldValue.serverTimestamp()
    });

    // Email only on the first reply, and never fail the reply because of email problems
    let emailSent = false;
    if (data.email && !data.notifiedAt) {
      try {
        await sendReplyEmail({
          to: data.email,
          name: data.name || 'there',
          question: data.question || '',
          response: adminResponse,
          questionId,
        });
        await questionRef.update({ notifiedAt: FieldValue.serverTimestamp() });
        emailSent = true;
      } catch (emailError) {
        console.error("API: Error sending reply notification email:", emailError);
      }
    }

    return NextResponse.json({ success: true, questionId, emailSent });
  } catch (error: unknown) {
    console.error("API: Error updating question with admin response:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to update question with admin response", details: errorMessage },
      { status: 500 }
    );
  }
}
