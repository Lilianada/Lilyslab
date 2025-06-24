import { NextResponse } from "next/server";
import { db } from '@/lib/firebase/firebase-config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, adminResponse } = body;
    
    if (!questionId || !adminResponse) {
      return NextResponse.json(
        { error: "Question ID and admin response are required" },
        { status: 400 }
      );
    }

    // Update the document in Firestore
    const questionRef = doc(db, 'ama-questions', questionId);
    await updateDoc(questionRef, {
      response: adminResponse,
      responseDate: serverTimestamp()
    });

    return NextResponse.json({ success: true, questionId });
  } catch (error: unknown) {
    console.error("API: Error updating question with admin response:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to update question with admin response", details: errorMessage },
      { status: 500 }
    );
  }
}
