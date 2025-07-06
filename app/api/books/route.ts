import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Define the Book type matching the user's provided interface
interface Book {
  id: string;
  title: string;
  status: 'current-reads' | 'read' | 'will-read';
  rating?: number;
  genre?: string;
  date?: number; // Added date field
  content: string; // Add field for full markdown content
  url?: string; // URL to essay or note review
}

// Set the directory path to bookshelf
const booksDirectory = join(process.cwd(), 'Content', 'bookshelf');

async function getBooksFromStatusDirectory(status: 'current-reads' | 'read' | 'will-read'): Promise<Book[]> {
  const statusDirectory = join(booksDirectory, status);
  let fileNames: string[];
  try {
    // Filter for .md files only
    fileNames = fs.readdirSync(statusDirectory).filter(file => file.endsWith('.md'));
  } catch (error) {
    // Directory might not exist if there are no books in that status yet
    console.warn(`Directory not found or error reading: ${statusDirectory}`, error);
    return [];
  }

  const books: Book[] = [];

  for (const fileName of fileNames) {
    const filePath = join(statusDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Basic validation for required fields
    if (!data.title) {
        console.warn(`Skipping ${fileName} in ${status} due to missing title.`);
        continue;
    }

    // Generate a unique ID (e.g., read-001)
    const baseSlug = fileName.replace(/\.md$/, '');
    const uniqueId = `${status}-${baseSlug}`;

    const bookData: Book = {
      id: uniqueId,
      title: data.title,
      status: status,
      rating: data.rating ? Number(data.rating) : undefined,
      genre: data.genre || undefined, // Use genre from frontmatter, or undefined if not present
      date: data.date ? Number(data.date) : undefined, // Add date, ensure it's a number
      content: content, // Add the full markdown content
      url: data.url || undefined, // Add URL to essay or note review
    };
    books.push(bookData);
  }
  return books;
}

export async function GET() {
  try {
    const currentReads = await getBooksFromStatusDirectory('current-reads');
    const read = await getBooksFromStatusDirectory('read');
    const willRead = await getBooksFromStatusDirectory('will-read');

    const allBooks = [...currentReads, ...read, ...willRead];

    // Sort books by date descending, putting books without date last
    allBooks.sort((a, b) => {
        const dateA = a.date || 0; // Use 0 if date is undefined/null
        const dateB = b.date || 0; // Use 0 if date is undefined/null
        return dateB - dateA; // Descending order
    });

    return NextResponse.json(allBooks);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: 'Failed to load book data' }, { status: 500 });
  }
} 