import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase-config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Define MicroBlog interface
interface MicroBlog {
  id: string;
  title: string;
  content: string;
  date: string;
  likeCount: number;
}

export async function GET() {
  try {
    // Fetch micro-blog entries from Firestore
    const q = query(collection(db, 'micro-blog'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const microBlog = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        content: data.content,
        date: data.date,
        likeCount: data.likeCount || 0
      };
    });

    return NextResponse.json(microBlog);
  } catch (error) {
    console.error("Error reading micro-blog entries:", error);
    return NextResponse.json({ error: 'Failed to load micro-blog data' }, { status: 500 });
  }
}

// POST handler to update like counts for a specific thread
export async function POST(request: Request) {
  try {
    const { id, action, title, content } = await request.json();
    
    // Handle new micro-blog post
    if (title && content) {
      const docData = {
        title,
        content,
        date: new Date().toISOString(),
        likeCount: 0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'micro-blog'), docData);
      return NextResponse.json({ success: true, id: docRef.id });
    }
    
    // Handle like/unlike action
    if (!id || !action || (action !== 'like' && action !== 'unlike')) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // This would need to be implemented with Firestore transactions for atomic updates
    // For now, returning success - you'd need to implement the like/unlike logic with Firestore
    return NextResponse.json({ success: true, message: 'Like functionality needs Firestore implementation' });
  } catch (error) {
    console.error("Error updating micro-blog:", error);
    return NextResponse.json({ error: 'Failed to update micro-blog' }, { status: 500 });
  }
}
