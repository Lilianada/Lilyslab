import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Updated Note interface with new metadata structure
interface Note {
  id: string;
  title: string;
  tags?: string[];
  createdAt: string;
  lastUpdated: string;
  image?: string | null;
  published?: boolean;
  type: string;
  content: string; // Field for full markdown content
}

export async function GET() {
  const notesDir = path.join(process.cwd(), 'Content', 'notes');
  const notes: Note[] = [];

  try {
    const files = await fs.readdir(notesDir);
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    for (const file of mdFiles) {
      const filePath = path.join(notesDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      // Destructure content along with data
      const { data, content } = matter(fileContent);

      // Validate required fields and published status
      if (data.published === true && data.title) {
        // Set default values for type, createdAt, and lastUpdated if not present
        const type = data.type || 'seedling';
        const createdAt = data.createdAt || data.date || new Date().toISOString();
        const lastUpdated = data.lastUpdated || new Date().toISOString();
        const tags = data.tags ? (Array.isArray(data.tags) ? data.tags : [data.tags]) : [];
        
        notes.push({
          id: file.replace(/\.md$/, ''),
          title: data.title,
          tags: tags,
          createdAt: createdAt,
          lastUpdated: lastUpdated,
          image: data.image || null,
          published: data.published,
          type: type,
          content: content, // The full markdown content
        });
      }
    }

    // Sort notes by createdAt, newest first
    notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  } catch (error) {
    console.error("Error reading or parsing notes content:", error);
    return NextResponse.json({ error: 'Failed to load notes data' }, { status: 500 });
  }

  return NextResponse.json(notes);
}