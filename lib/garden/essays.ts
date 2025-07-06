import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

export type Essay = {
  slug: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  content: string;
  published: boolean;
  type: string;
};

const essaysDir = path.join(process.cwd(), 'Content/essays');

export function getAllEssays(): Essay[] {
  const essaysPath = path.join(process.cwd(), "Content/essays")

  if (!fs.existsSync(essaysPath)) {
    console.warn("Essays folder not found:", essaysPath)
    return []
  }

  const files = fs.readdirSync(essaysPath)

  return files
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(essaysPath, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const published = data.published === true;
      
      // Handle dates safely
      const createdAtValue = data.createdAt || data.date;
      const createdAt = safeFormatDate(createdAtValue);
      const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);

      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        createdAt,
        lastUpdated,
        excerpt: data.excerpt || '',
        tags: (data.tags || []).slice(0, 3), // Limit to 3 tags
        coverImage: data.coverImage || null,
        published: published,
        content,
        type: data.type || 'evergreen',
      };
    })
    .filter(essay => essay.published === true)
    .sort((a, b) => {
      // Convert to Date objects for safe comparison
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      // Sort newest first
      return dateB.getTime() - dateA.getTime();
    });
}

export function getEssayBySlug(slug: string): Essay | null {
  const filePath = path.join(essaysDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  
  // Handle dates safely
  const createdAtValue = data.createdAt || data.date;
  const createdAt = safeFormatDate(createdAtValue);
  const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);

  return {
    slug,
    title: data.title || 'Untitled',
    createdAt,
    lastUpdated,
    excerpt: data.excerpt || '',
    tags: (data.tags || []).slice(0, 3), // Limit to 3 tags
    coverImage: data.coverImage || null,
    content,
    published: data.published === true,
    type: data.type || 'evergreen',
  };
}
