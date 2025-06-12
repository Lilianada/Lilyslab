import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

// Define note interface for API response
export interface Note {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  tags: string[];
  type: string;
  image?: string;
  publish: boolean;
  content: string;
}

export async function GET() {
  const notesDir = path.join(process.cwd(), 'Content', 'notes');
  const notes: Note[] = [];

  try {
    const files = await fs.readdir(notesDir);
    const mdFiles = files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

    for (const file of mdFiles) {
      const filePath = path.join(notesDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      // Destructure content along with data
      const { data, content } = matter(fileContent);

      // Validate required fields and publish status
      if (data.publish !== false && data.title) {
        // Set default values for type, createdAt, and lastUpdated if not present
        const type = data.type || 'seedling';
        const createdAtValue = data.createdAt || data.date;
        const createdAt = safeFormatDate(createdAtValue);
        const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);
        const tags = data.tags ? (Array.isArray(data.tags) ? data.tags : [data.tags]) : [];
        
        notes.push({
          id: file.replace(/\.mdx?$/, ''),
          title: data.title,
          tags: tags,
          createdAt: createdAt,
          lastUpdated: lastUpdated,
          image: data.image || null,
          publish: data.publish !== false,
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
