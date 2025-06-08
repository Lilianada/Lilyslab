import { NextRequest, NextResponse } from 'next/server';
import { addWebrollSubmission } from '@/lib/webroll';

export async function POST(request: NextRequest) {
  try {
    const { title, url, category } = await request.json();

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await addWebrollSubmission({ title, url, category });

    if (success) {
      return NextResponse.json({ message: 'Submission saved successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing webroll submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
