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

import { z } from 'zod';
import { read } from 'zod-matter';

const BookmarkMetaSchema = z.object({
  title: z.string().optional(),
  URL: z.string().optional(),
  url: z.string().optional(),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional(),
  type: z.string().optional(),
  publish: z.boolean().optional(),
  Publish: z.boolean().optional(),
  published: z.boolean().optional(),
  date: z.coerce.date().optional(),
  Date: z.coerce.date().optional(),
});

export async function getBookmarks(): Promise<Bookmark[]> {
  const files = fs.readdirSync(BOOKMARKS_DIR).filter(f => f.endsWith('.md'));
  const bookmarks: Bookmark[] = files.map((filename) => {
    const filePath = path.join(BOOKMARKS_DIR, filename);
    let meta;
    try {
      const result = read(filePath, BookmarkMetaSchema);
      meta = result.data;
    } catch (e) {
      return null;
    }
    // Only include if Publish/publish is true
    const published = meta.Publish === true || meta.publish === true || meta.published;
    if (!published) return null;
    // Prefer date, fallback to Date, and always format as string
    let dateObj = meta.date || meta.Date;
    let created = '';
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      created = dateObj.toISOString().split('T')[0];
    } else if (typeof dateObj === 'string') {
      created = dateObj;
    }
    return {
      link: meta.URL || meta.url || '',
      title: meta.title || '',
      cover: meta.cover || '',
      tags: meta.tags || [],
      type: (meta.type || 'website') as Bookmark['type'],
      created,
    };
  }).filter(Boolean) as Bookmark[];
  // Sort from newest to oldest by date (created)
  bookmarks.sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return dateB - dateA;
  });
  return bookmarks;
}

