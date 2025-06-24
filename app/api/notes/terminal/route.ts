import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const notesPath = path.join(process.cwd(), 'Content', 'notes', 'index.md');
    
    // Check if the file exists
    if (!fs.existsSync(notesPath)) {
      return NextResponse.json({ 
        content: '*Start typing anywhere...*' 
      });
    }

    // Read the file content
    const content = fs.readFileSync(notesPath, 'utf-8');
    
    return NextResponse.json({ 
      content: content.trim() 
    });
  } catch (error) {
    console.error('Error reading notes file:', error);
    return NextResponse.json({ 
      content: '*Start typing anywhere...*' 
    }, { status: 500 });
  }
}

// Only GET is supported - no server-side writing for terminal notes
export async function POST() {
  return NextResponse.json(
    { error: 'POST not supported. Terminal notes are stored locally only.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'PUT not supported. Terminal notes are stored locally only.' },
    { status: 405 }
  );
}
