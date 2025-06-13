import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Interface for the archive item data structure
interface ArchiveItemData {
  frontmatter: {
    title?: string;
    createdAt?: string;
    tags?: string[];
    [key: string]: any;
  };
  content: string;
  category: "writings" | "notes";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  try {
    const { category, slug } = await params;
    
    if (!slug || !category) {
      return NextResponse.json({ error: 'Category and slug parameters are required' }, { status: 400 });
    }
    
    // Validate category is either "notes" or "writings"
    if (category !== "notes" && category !== "writings") {
      return NextResponse.json({ error: 'Invalid category. Must be either "notes" or "writings"' }, { status: 400 });
    }

    // Path to the specific markdown file in the archives
    const filePath = join(process.cwd(), 'Content', 'archives', category, `${slug}.md`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Archive item file not found: ${filePath}`);
      return NextResponse.json({ error: 'Archive item not found' }, { status: 404 });
    }

    // Read and parse the Markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process tags if they exist as comma-separated string
    let tags: string[] = [];
    if (data.tags) {
      if (typeof data.tags === 'string') {
        tags = data.tags.split(',').map((tag: string) => tag.trim());
      } else if (Array.isArray(data.tags)) {
        tags = data.tags;
      }
    }

    const responseData: ArchiveItemData = {
      frontmatter: {
        ...data,
        title: data.title || slug.replace(/-/g, ' '),
        createdAt: data.createdAt || data.date || '',
        tags: tags
      },
      content: content,
      category: category as "writings" | "notes"
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error fetching archive item content:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load archive item data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
