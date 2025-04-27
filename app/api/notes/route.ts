import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Define type for a note (adjust fields as needed)
interface Note {
  id: string; // Use filename as ID for simplicity
  title: string;
  tags?: string[]; // Changed from author
  date: string;
  entry: string; // Changed from quote
  image?: string | null; // Added optional image
  publish?: boolean;
}

export async function GET() {
  const notesDir = path.join(process.cwd(), 'Content', 'notes');
  let notes: Note[] = [];

  try {
    const files = await fs.readdir(notesDir);
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    for (const file of mdFiles) {
      const filePath = path.join(notesDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(fileContent);

      // Validate required fields and publish status
      if (data.publish === true && data.title && data.date && data.entry && data.tags) { // Check for tags
        notes.push({
          id: file.replace(/\.md$/, ''),
          title: data.title,
          // Use tags, ensuring it's an array
          tags: Array.isArray(data.tags) ? data.tags : [data.tags], 
          date: data.date,
          entry: data.entry, // Use entry
          image: data.image || null, // Add image, default to null
          publish: data.publish,
        });
      }
    }

    // Sort notes by date, newest first
    notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error("Error reading or parsing notes content:", error);
    return NextResponse.json({ error: 'Failed to load notes data' }, { status: 500 });
  }

  return NextResponse.json(notes);
} 