import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const booksDirectory = path.join(process.cwd(), 'Content/bookshelf');

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'read' | 'reading' | 'to-read';
  date: string;
  rating?: number;
  genre?: string[];
  tags?: string[];
  publish: boolean;
  url?: string;
  image?: string;  // Optional URL to book cover image
}

function getFolderStatus(folder: string): Book['status'] {
  switch (folder) {
    case 'read': return 'read';
    case 'current-reads': return 'reading';
    default: throw new Error(`Unknown folder status: ${folder}`);
  }
}

export function getAllBooks(): Book[] {
  const folders = ['read', 'current-reads'];
  const books: Book[] = [];

  for (const folder of folders) {
    const folderPath = path.join(booksDirectory, folder);
    if (!fs.existsSync(folderPath)) continue;

    const files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      // Skip if explicitly marked as not published
      if (data.publish === false) continue;

      const slug = file.replace(/\.md$/, '');
      books.push({
        id: slug,
        title: data.title,
        author: data.author,
        status: getFolderStatus(folder),
        date: data.date,
        rating: data.rating,
        genre: Array.isArray(data.genre) ? data.genre : data.genre ? [data.genre] : undefined,
        tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : undefined,
        publish: true,
        url: data.url,
        image: data.image
      });
    }
  }

  // Sort by date, newest first
  return books.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
