import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Interface for the entry data structure
interface ThenEntryData {
  frontmatter: {
    title?: string;
    createdAt?: string;
    inspiredBy?: string;
    [key: string]: any; 
  };
  content: string;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Path to the specific markdown file
    const filePath = join(process.cwd(), 'Content', 'then', `${slug}.md`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Then entry file not found: ${filePath}`);
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Read and parse the Markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const responseData: ThenEntryData = {
      frontmatter: {
        ...data,
        title: data.title || 'Untitled Entry',
        createdAt: data.createdAt || '',
        inspiredBy: data.inspiredBy || data['inspired by'] || ''
      },
      content: content,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error fetching Then entry content:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load entry data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
