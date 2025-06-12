import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

// Directly using the Writing type
export interface Writing {
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
  const writingsPath = path.join(process.cwd(), "Content/writings");
  const writings: Writing[] = [];

  try {
    let files;
    try {
      files = await fs.readdir(writingsPath);
    } catch (error) {
      console.warn("Writings folder not found:", writingsPath);
      return NextResponse.json([]);
    }

    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

      const filePath = path.join(writingsPath, file);
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const published = data.published === true;
      
      // Skip unpublished writings
      if (!published) continue;
      
      // Handle dates safely
      const createdAtValue = data.createdAt || data.date;
      const createdAt = safeFormatDate(createdAtValue);
      const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);

      writings.push({
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        createdAt,
        lastUpdated,
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        coverImage: data.coverImage || null,
        content,
        published: true,
        type: data.type || 'evergreen',
      });
    }

    // Sort newest first
    writings.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(writings);
  } catch (error) {
    console.error("Error in writings API route:", error);
    return NextResponse.json({ error: 'Failed to load writings data' }, { status: 500 });
  }
}
