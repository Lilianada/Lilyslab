import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

export type Poem = {
  slug: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  tags?: string[];
  content: string;
  published: boolean;
  type: string;
};

const poemsDir = path.join(process.cwd(), 'Content/poems');

export function getAllPoems(): Poem[] {
  const poemsPath = path.join(process.cwd(), "Content/poems")

  if (!fs.existsSync(poemsPath)) {
    console.warn("Poems folder not found:", poemsPath)
    return []
  }

  const files = fs.readdirSync(poemsPath)

  return files
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(poemsPath, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const published = data.published === true;
      
      // Handle dates safely
      const createdAtValue = data.createdAt || data.date;
      const createdAt = safeFormatDate(createdAtValue);
      const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);

      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled Poem',
        createdAt,
        lastUpdated,
        tags: (data.tags || []).slice(0, 5), // Allow up to 5 tags for poems
        published: published,
        content,
        type: data.type || 'poem',
      };
    })
    .filter(poem => poem.published === true)
    .sort((a, b) => {
      // Convert to Date objects for safe comparison
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      // Sort newest first
      return dateB.getTime() - dateA.getTime();
    });
}

export function getPoemBySlug(slug: string): Poem | null {
  const filePath = path.join(poemsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  
  // Handle dates safely
  const createdAtValue = data.createdAt || data.date;
  const createdAt = safeFormatDate(createdAtValue);
  const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);

  return {
    slug,
    title: data.title,
    createdAt,
    lastUpdated,
    tags: data.tags || [],
    content,
    published: data.published === true,
    type: data.type || 'poem',
  };
}
