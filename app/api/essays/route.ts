import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

// Directly using the Essay type
export interface Essay {
  slug: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  content: string;
  published: boolean;
  type: string;
}

export async function GET() {
  const essaysPath = path.join(process.cwd(), "Content/essays");
  const essays: Essay[] = [];

  try {
    let files;
    try {
      files = await fs.readdir(essaysPath);
    } catch (error) {
      console.warn("Essays folder not found:", essaysPath);
      return NextResponse.json([]);
    }

    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

      const filePath = path.join(essaysPath, file);
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const published = data.published === true;
      
      // Skip unpublished essays
      if (!published) continue;
      
      // Handle dates safely
      const createdAtValue = data.createdAt || data.date;
      const createdAt = safeFormatDate(createdAtValue);
      const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);

      essays.push({
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        createdAt,
        lastUpdated,
        excerpt: data.excerpt || '',
        tags: (data.tags || []).slice(0, 3), // Limit to 3 tags
        coverImage: data.coverImage || null,
        content,
        published: true,
        type: data.type || 'evergreen',
      });
    }

    // Sort newest first
    essays.sort((a: Essay, b: Essay) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(essays);
  } catch (error) {
    console.error("Error in essays API route:", error);
    return NextResponse.json({ error: 'Failed to load essays data' }, { status: 500 });
  }
}
