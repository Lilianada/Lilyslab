import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Bookmark {
  link: string;
  title: string;
  cover: string;
  tags: string[];
  type: "article" | "video" | "website" | "misc";
  created: string;
}

const BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');

export async function getBookmarks(): Promise<Bookmark[]> {
  const files = fs.readdirSync(BOOKMARKS_DIR).filter(f => f.endsWith('.md'));
  const bookmarks: Bookmark[] = files.map((filename) => {
    const filePath = path.join(BOOKMARKS_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    // Only include if Publish/publish is true
    const published = data.Publish === true || data.publish === true || data.published;
    if (!published) return null;
    return {
      link: data.URL || data.url || '',
      title: data.title || '',
      cover: data.cover || '',
      tags: data.tags || [],
      type: (data.type || 'website') as Bookmark['type'],
      created: data.Date || data.date || '',
    };
  }).filter(Boolean) as Bookmark[];
  return bookmarks;
}
