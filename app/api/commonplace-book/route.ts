import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: NextRequest) {
  try {
    const commonplaceItems = [];

    // Fetch micro-blog entries
    const microBlogPath = path.join(process.cwd(), 'Content/microBlog');
    if (fs.existsSync(microBlogPath)) {
      const microBlogFiles = fs.readdirSync(microBlogPath);
      
      for (const file of microBlogFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(microBlogPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          commonplaceItems.push({
            id: `micro-${file.replace('.md', '')}`,
            title: data.title || content.split('\n')[0].substring(0, 50) + '...',
            type: 'thought',
            content: content,
            tags: data.tags || ['THOUGHTS'],
            date: data.createdAt || data.date || '2024-01-01',
            source: 'micro-blog',
          });
        }
      }
    }

    // Fetch quotes
    const quotesPath = path.join(process.cwd(), 'Content/quotes');
    if (fs.existsSync(quotesPath)) {
      const quotesFiles = fs.readdirSync(quotesPath);
      
      for (const file of quotesFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(quotesPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          commonplaceItems.push({
            id: `quote-${file.replace('.md', '')}`,
            title: data.title || content.split('\n')[0].substring(0, 50) + '...',
            type: 'quote',
            author: data.author,
            content: content,
            tags: data.tags || ['QUOTES'],
            date: data.createdAt || data.date || '2024-01-01',
            source: data.source || 'quotes',
          });
        }
      }
    }

    // Sort by date (newest first)
    commonplaceItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      items: commonplaceItems,
      total: commonplaceItems.length,
    });
  } catch (error) {
    console.error('Error fetching commonplace book data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commonplace book data' },
      { status: 500 }
    );
  }
}
