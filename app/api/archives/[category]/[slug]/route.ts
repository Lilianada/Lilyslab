import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Interface for the archive item data structure
interface ArchiveItemData {
  frontmatter: {
    title?: string;
    createdAt?: string;
    date?: string;
    tags?: string[];
    categories?: string[];
    [key: string]: any;
  };
  content: string;
  category: "writings" | "notes" | "wordpress-posts";
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
    
    // Validate category is either "notes", "writings", or "wordpress-posts"
    if (category !== "notes" && category !== "writings" && category !== "wordpress-posts") {
      return NextResponse.json({ error: 'Invalid category. Must be either "notes", "writings", or "wordpress-posts"' }, { status: 400 });
    }

    let filePath: string;
    
    // Handle different file structures for different categories
    if (category === "wordpress-posts") {
      // WordPress posts are stored in directories with index.md files
      filePath = join(process.cwd(), 'Content', 'archives', category, slug, 'index.md');
    } else {
      // Notes and writings are stored as individual .md files
      filePath = join(process.cwd(), 'Content', 'archives', category, `${slug}.md`);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Archive item file not found: ${filePath}`);
      return NextResponse.json({ error: 'Archive item not found' }, { status: 404 });
    }

    // Read and parse the Markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process tags and categories (for WordPress posts, convert categories to tags)
    let tags: string[] = [];
    
    // Handle existing tags
    if (data.tags) {
      if (typeof data.tags === 'string') {
        tags = data.tags.split(',').map((tag: string) => tag.trim());
      } else if (Array.isArray(data.tags)) {
        tags = data.tags;
      }
    }
    
    // For WordPress posts, convert categories to tags
    if (category === "wordpress-posts" && data.categories) {
      const categoryTags = Array.isArray(data.categories) 
        ? data.categories 
        : [data.categories];
      tags = [...tags, ...categoryTags];
    }

    const responseData: ArchiveItemData = {
      frontmatter: {
        ...data,
        title: data.title || slug.replace(/-/g, ' '),
        createdAt: data.createdAt || data.date || '',
        tags: tags
      },
      content: content,
      category: category as "writings" | "notes" | "wordpress-posts"
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error fetching archive item content:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load archive item data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
