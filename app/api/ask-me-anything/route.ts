import { NextResponse } from "next/server";
import { db } from '@/lib/firebase/firebase-config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export async function GET() {
  try {
    // Fetch AMA questions from Firestore
    const q = query(collection(db, 'ama-questions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const questions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Anonymous',
        email: data.email || '',
        date: data.date,
        question: data.question || '',
        response: data.response || '',
        photoURL: data.photoURL || null
      };
    });

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    console.error("API: Error fetching AMA questions:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Failed to fetch questions", details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, photoURL, question, questionId, adminResponse } = body;
    
    // Handle admin response to an existing question
    if (questionId && adminResponse) {
      console.log("Processing admin reply for question ID:", questionId);
      
      try {
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
    
    // Handle new question submission
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Save new question to Firestore
    const docData = {
      name: name || 'Anonymous',
      email: email || '',
      photoURL: photoURL || null,
      question,
      response: '', // Empty initially
      createdAt: serverTimestamp(),
      date: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'ama-questions'), docData);
    
    return NextResponse.json({ success: true, questionId: docRef.id });
  } catch (error: unknown) {
    console.error("API: Error submitting AMA question:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Failed to submit question", details: errorMessage }, { status: 500 });
  }
}
