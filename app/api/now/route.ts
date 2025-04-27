import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Interface for the Now page data structure
interface NowData {
  frontmatter: {
    lastUpdated?: string;
    [key: string]: any; // Allow other frontmatter fields
  };
  content: string;
}

const nowFilePath = join(process.cwd(), 'Content', 'now', 'entry.md');

export async function GET() {
  try {
    // Check if file exists
    if (!fs.existsSync(nowFilePath)) {
      console.warn(`Now content file not found: ${nowFilePath}`);
      return NextResponse.json({ error: 'Now content not found' }, { status: 404 });
    }

    // Read and parse the single Markdown file
    const fileContents = fs.readFileSync(nowFilePath, 'utf8');
    const { data, content } = matter(fileContents);

    const responseData: NowData = {
      frontmatter: data,
      content: content,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error fetching Now page content:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load Now page data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 