import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase/firebase-config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Define schema for guestbook entry validation
const GuestbookEntrySchema = z.object({
  id: z.string().optional().or(z.string().length(0).transform(() => '')),
  name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
  email: z.string().email("Please enter a valid email address").optional().or(z.string().length(0).transform(() => undefined)),
  url: z.string().url("Please enter a valid URL").optional().or(z.string().length(0).transform(() => undefined)),
  spam_check: z.string().refine(val => val.toLowerCase() === 'guestbook', {
    message: 'Please enter "guestbook" to prove you are human'
  }),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be 2000 characters or less").trim(),
  // Date format standardized to YYYY-MM-DD to ensure consistency
  date: z.string().optional().or(z.string().length(0).transform(() => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  })),
});

type GuestbookEntry = z.infer<typeof GuestbookEntrySchema>;

export async function GET() {
  try {
    // Fetch entries from Firestore
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const entries = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Anonymous',
        url: data.url || undefined,
        date: data.date,
        email: data.email || undefined,
        message: data.message
      };
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error reading guestbook entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate entry data
    const entry = GuestbookEntrySchema.parse(body);
    
    // Remove spam_check field from saved data
    const { spam_check, ...entryData } = entry;
    
    // Save to Firestore
    const docData = {
      name: entryData.name,
      email: entryData.email || null,
      url: entryData.url || null,
      message: entryData.message,
      // Firestore timestamp
      createdAt: serverTimestamp(),
      // Date string for compatibility
      date: new Date().toISOString().split('T')[0]
    };

    const docRef = await addDoc(collection(db, 'guestbook'), docData);
    
    // Prepare response with all fields for immediate display
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for signing my guestbook!',
      entry: {
        id: docRef.id,
        name: entryData.name,
        url: entryData.url,
        date: docData.date,
        message: entryData.message,
        email: entryData.email,
        // Add created_at for compatibility with form component's onEntryAdded function
        created_at: docData.date
      }
    });
    
  } catch (error) {
    console.error('Error saving guestbook entry:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to save entry' 
    }, { status: 500 });
  }
}