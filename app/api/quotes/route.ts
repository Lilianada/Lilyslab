import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: NextRequest) {
  try {
    const quotesDir = path.join(process.cwd(), 'Content/quotes');
    const files = fs.readdirSync(quotesDir).filter(file => 
      file.endsWith('.md') && file !== 'index.md'
    );

    const quotes = files.map(filename => {
      const filePath = path.join(quotesDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        id: filename.replace('.md', ''),
        author: data.author || 'Unknown',
        text: content.replace(/"/g, '').trim(),
        source: data.source,
        tags: data.tags || [],
        date: data.date || data.createdAt,
        published: data.published !== false,
      };
    }).filter(quote => quote.published);

    // Sort by date (newest first)
    quotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      quotes,
      total: quotes.length,
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
