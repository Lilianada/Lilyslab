import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Bookmark {
  id: string;
  link: string;
  title: string;
  cover: string;
  tags: string[];
  type: "article" | "video" | "website" | "misc";
  created: string;
}

// Use category-based bookmark directory
const BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');
const CATEGORIES = ['article', 'website', 'video', 'misc'];

import { z } from 'zod';
import { read } from 'zod-matter';

const BookmarkMetaSchema = z.object({
  id: z.string().optional(),
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
  // Ensure directory exists
  if (!fs.existsSync(BOOKMARKS_DIR)) {
    console.warn('Bookmarks-by-category directory not found, using legacy bookmarks');
    return getLegacyBookmarks();
  }

  const categoryFiles = CATEGORIES.map(cat => `${cat}.md`).filter(
    file => fs.existsSync(path.join(BOOKMARKS_DIR, file))
  );
  
  let allBookmarks: Bookmark[] = [];
  
  // Process each category file
  for (const file of categoryFiles) {
    const category = file.replace('.md', '') as Bookmark['type'];
    const filePath = path.join(BOOKMARKS_DIR, file);
    
    try {
      // Read file content
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Split content by '---' markers which separate bookmarks
      // This regex matches triple dashes with optional whitespace
      const bookmarkSections = content
        .split(/---/)
        .filter(section => section.trim() !== '');
      
      for (const section of bookmarkSections) {
        if (!section.trim()) continue;
        
        try {
          // Add frontmatter delimiters if needed
          const processedSection = section.trim().startsWith('publish:') || 
                                   section.trim().startsWith('Publish:') || 
                                   section.trim().startsWith('title:') || 
                                   section.trim().startsWith('date:') ? 
                                   `---\n${section.trim()}\n---` : `---\n${section.trim()}`;
                                   
          const { data: meta } = matter(processedSection);
          
          // Only include if Publish/publish is true or not specified
          const published = meta.Publish === true || meta.publish === true || meta.published !== false;
          if (!published) continue;
          
          // Prefer date, fallback to Date, and always format as string
          let dateObj = meta.date || meta.Date;
          let created = '';
          if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
            created = dateObj.toISOString().split('T')[0];
          } else if (typeof dateObj === 'string') {
            created = dateObj;
          }
          
          allBookmarks.push({
            id: meta.id || `${category}-unknown`,
            link: meta.URL || meta.url || '',
            title: meta.title || '',
            cover: meta.cover || '',
            tags: meta.tags || [],
            type: (meta.type || category) as Bookmark['type'],
            created,
          });
        } catch (err) {
          console.error('Error parsing bookmark section:', err);
        }
      }
    } catch (err) {
      console.error(`Error reading category file ${file}:`, err);
    }
  }
  
  // Sort from newest to oldest by date (created)
  allBookmarks.sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return dateB - dateA;
  });
  
  return allBookmarks;
}

// Legacy function to handle the old bookmark structure if needed
export async function getLegacyBookmarks(): Promise<Bookmark[]> {
  const LEGACY_BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');
  const files = fs.readdirSync(LEGACY_BOOKMARKS_DIR).filter(f => f.endsWith('.md'));
  
  const bookmarks: Bookmark[] = files.map((filename) => {
    const filePath = path.join(LEGACY_BOOKMARKS_DIR, filename);
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
    
    const bookmarkType = (meta.type || 'website').toLowerCase() as Bookmark['type'];
    
    return {
      id: filename.replace('.md', ''),
      link: meta.URL || meta.url || '',
      title: meta.title || '',
      cover: meta.cover || '',
      tags: meta.tags || [],
      type: bookmarkType,
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

