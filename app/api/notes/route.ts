import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Update Note interface to include content and make entry optional
interface Note {
  id: string;
  title: string;
  tags?: string[];
  date: string;
  image?: string | null;
  publish?: boolean;
  content: string; // Add field for full markdown content
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
      // Destructure content along with data
      const { data, content } = matter(fileContent);

      // Validate required fields and publish status
      if (data.publish === true && data.title && data.date && data.tags) {
        notes.push({
          id: file.replace(/\.md$/, ''),
          title: data.title,
          tags: Array.isArray(data.tags) ? data.tags : [data.tags],
          date: data.date,
          image: data.image || null,
          publish: data.publish,
          content: content, // Add the full markdown content
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