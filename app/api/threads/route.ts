import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';

// Define Thread interface
interface Thread {
  id: string;
  title: string;
  content: string;
  date: string;
  likeCount: number;
  tags?: string[];
}

export async function GET() {
  const threadsDir = path.join(process.cwd(), 'content', 'threads');
  const threads: Thread[] = [];

  try {
    // Check if directory exists, create it if it doesn't
    try {
      await fs.access(threadsDir);
    } catch {
      await fs.mkdir(threadsDir, { recursive: true });
    }

    const files = await fs.readdir(threadsDir);
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    for (const file of mdFiles) {
      const filePath = path.join(threadsDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // Only include valid thread entries
      if (data.date) {
        threads.push({
          id: file.replace(/\.md$/, ''),
          title: data.title || '',
          content: content,
          date: data.date,
          likeCount: data.likeCount || 0,
          tags: data.tags || []
        });
      }
    }

    // Sort threads by date, newest first
    threads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error("Error reading or parsing threads content:", error);
    return NextResponse.json({ error: 'Failed to load threads data' }, { status: 500 });
  }

  return NextResponse.json(threads);
}

// POST handler to update like counts for a specific thread
export async function POST(request: Request) {
  try {
    const { id, action } = await request.json();
    
    if (!id || !action || (action !== 'like' && action !== 'unlike')) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'content', 'threads', `${id}.md`);
    
    // Read file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Update like count
    if (action === 'like') {
      data.likeCount = (data.likeCount || 0) + 1;
    } else if (action === 'unlike' && data.likeCount > 0) {
      data.likeCount = data.likeCount - 1;
    }

    // Write back to file
    const updatedFileContent = matter.stringify(content, data);
    await fs.writeFile(filePath, updatedFileContent);

    return NextResponse.json({ success: true, likeCount: data.likeCount });
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json({ error: 'Failed to update thread' }, { status: 500 });
  }
}
