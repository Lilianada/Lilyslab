import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Allowed categories and platforms (adjust if needed)
const ALLOWED_CATEGORIES = ['Development', 'Design', 'Productivity', 'AI & ML', 'Other'] as const;
const PLATFORMS = ['iOS', 'Web', 'Android', 'macOS', 'Windows', 'Linux'] as const;

type ToolSubmission = z.infer<typeof ToolSubmissionSchema>;
const ToolSubmissionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  logo: z.string().url().optional(),
  url: z.string().url(),
  category: z.enum(ALLOWED_CATEGORIES),
  platforms: z.array(z.enum(PLATFORMS)).min(1).max(4)
    .refine(arr => new Set(arr).size === arr.length, 'Duplicate platforms not allowed'),
  published: z.boolean().optional(),
});

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
  }
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  let submission: ToolSubmission;
  try {
    submission = ToolSubmissionSchema.parse(payload);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    throw err;
  }

  // Save submission to Firestore
  try {
    const docData = {
      ...submission,
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString(),
      published: submission.published || false
    };

    const docRef = await addDoc(collection(db, 'tool-submissions'), docData);
    
    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving tool submission:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
