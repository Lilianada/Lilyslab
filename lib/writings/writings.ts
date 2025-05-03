// lib/writings.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Writing = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  content: string;
  published: boolean;
};

const writingsDir = path.join(process.cwd(), 'Content/Writings');

export function getAllWritings(): Writing[] {
  const writingsPath = path.join(process.cwd(), "Content/Writings")

  if (!fs.existsSync(writingsPath)) {
    console.warn("Writings folder not found:", writingsPath)
    return []
  }

  const files = fs.readdirSync(writingsPath)

  return files
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(writingsPath, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const published = data.published === true;

      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        date: data.date || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        coverImage: data.coverImage || null,
        published: published,
        content,
      };
    })
    .filter(writing => writing.published === true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getWritingBySlug(slug: string): Writing | null {
  const filePath = path.join(writingsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || '',
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    coverImage: data.coverImage || null,
    content,
    published: data.published === true,
  };
}
