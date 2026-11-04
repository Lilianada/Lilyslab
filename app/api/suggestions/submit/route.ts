import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SuggestionSchema = z.object({
  type: z.enum(['Book', 'Movie/Show', 'Article', 'Tool', 'Resource', 'Idea', 'Other']),
  title: z.string().trim().min(1).max(200),
  url: z.union([z.string().url(), z.literal('')]).optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  let suggestion: z.infer<typeof SuggestionSchema>;
  try {
    suggestion = SuggestionSchema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.some((issue) => issue.path[0] === 'url')
        ? 'That link doesn\'t look like a full URL (it should start with https://)'
        : 'Please check your suggestion and try again';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, 'suggestions'), {
      ...suggestion,
      createdAt: serverTimestamp(),
      reviewed: false,
    });
    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving suggestion:', error);
    return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 });
  }
}
