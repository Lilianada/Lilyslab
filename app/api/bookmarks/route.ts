import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

// Define Bookmark interface
interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  lastUpdated?: string;
  tags: string[];
  type: string;
}

export async function GET() {
  try {
    const bookmarksPath = path.join(process.cwd(), "Content/bookmarks");
    const bookmarks: Bookmark[] = [];

    // Read bookmark files
    let files;
    try {
      files = await fs.readdir(bookmarksPath);
    } catch (error) {
      console.warn("Bookmarks folder not found:", bookmarksPath);
      return NextResponse.json([]);
    }

    // Filter only markdown files and skip README.md
    const markdownFiles = files.filter(file => 
      (file.endsWith('.md') || file.endsWith('.mdx')) && 
      file !== 'README.md'
    );

    // Process each file
    for (const file of markdownFiles) {
      const filePath = path.join(bookmarksPath, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Split the file by markdown separators (---)
      const bookmarkEntries = fileContent.split('---\n').filter(entry => entry.trim().length > 0);
      
      // Process each bookmark entry in the file
      for (const entry of bookmarkEntries) {
        try {
          // Parse front matter
          const { data } = matter('---\n' + entry);
          
          // Skip if not published
          if (data.publish !== true) continue;
          
          // Create bookmark object
          bookmarks.push({
            id: data.id || `${file.replace(/\.mdx?$/, '')}-${bookmarks.length + 1}`,
            title: data.title || 'Untitled',
            url: data.url || '#',
            createdAt: safeFormatDate(data.createdAt || data.date),
            lastUpdated: data.lastUpdated ? safeFormatDate(data.lastUpdated) : undefined,
            tags: data.tags || [],
            type: data.type || 'bookmark'
          });
        } catch (err) {
          console.warn(`Error processing bookmark entry in ${file}:`, err);
          continue;
        }
      }
    }

    // Sort by date (newest first)
    bookmarks.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error reading bookmarks:", error);
    return NextResponse.json({ error: 'Failed to load bookmark data' }, { status: 500 });
  }
}
