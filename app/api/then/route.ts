import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Interface for the Then entry data structure
interface ThenEntry {
  slug: string;
  title: string;
  createdAt: string;
}

export async function GET() {
  try {
    // Path to the "then" directory
    const thenDirectory = join(process.cwd(), 'Content', 'then');

    // Check if directory exists
    if (!fs.existsSync(thenDirectory)) {
      console.warn(`Then directory not found: ${thenDirectory}`);
      return NextResponse.json({ entries: [] });
    }

    // Read all files in the then directory
    const fileNames = fs.readdirSync(thenDirectory);
    const entries: ThenEntry[] = [];

    // Process each file
    for (const fileName of fileNames) {
      // Only process markdown files
      if (!fileName.endsWith('.md')) continue;

      // Get the slug without extension
      const slug = fileName.replace(/\.md$/, '');
      
      // Read and parse the file
      const filePath = join(thenDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      // Add to entries list
      entries.push({
        slug,
        title: data.title || 'Untitled Entry',
        createdAt: data.createdAt || '', // Default to empty string if date not available
      });
    }

    // Sort entries by date (newest first)
    entries.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });

    return NextResponse.json({ entries });

  } catch (error) {
    console.error("Error fetching Then entries:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load Then entries';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
