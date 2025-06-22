import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Interface for the archive item data structure
interface ArchiveItem {
  slug: string;
  title: string;
  category: "writings" | "notes" | "wordpress-posts";
  createdAt?: string;
}

export async function GET() {
  try {
    // Paths to the archives directories
    const notesArchivesDirectory = join(process.cwd(), 'Content', 'archives', 'notes');
    const writingsArchivesDirectory = join(process.cwd(), 'Content', 'archives', 'writings');
    const wordpressArchivesDirectory = join(process.cwd(), 'Content', 'archives', 'wordpress-posts');
    
    const items: ArchiveItem[] = [];

    // Process notes
    if (fs.existsSync(notesArchivesDirectory)) {
      const notesFiles = fs.readdirSync(notesArchivesDirectory);
      
      for (const fileName of notesFiles) {
        // Skip README files and non-markdown files
        if (!fileName.endsWith('.md') || fileName === 'README.md') continue;
        
        const slug = fileName.replace(/\.md$/, '');
        const filePath = join(notesArchivesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        items.push({
          slug,
          title: data.title || fileName.replace(/\.md$/, ''),
          category: "notes",
          createdAt: data.createdAt || data.date || '',
        });
      }
    }

    // Process writings
    if (fs.existsSync(writingsArchivesDirectory)) {
      const writingsFiles = fs.readdirSync(writingsArchivesDirectory);
      
      for (const fileName of writingsFiles) {
        // Skip README files and non-markdown files
        if (!fileName.endsWith('.md') || fileName === 'README.md') continue;
        
        const slug = fileName.replace(/\.md$/, '');
        const filePath = join(writingsArchivesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        items.push({
          slug,
          title: data.title || fileName.replace(/\.md$/, '').replace(/-/g, ' '),
          category: "writings",
          createdAt: data.createdAt || data.date || '',
        });
      }
    }

    // Process WordPress posts
    if (fs.existsSync(wordpressArchivesDirectory)) {
      const wordpressDirectories = fs.readdirSync(wordpressArchivesDirectory)
        .filter(item => {
          const itemPath = join(wordpressArchivesDirectory, item);
          return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
        });
      
      for (const dirName of wordpressDirectories) {
        const indexPath = join(wordpressArchivesDirectory, dirName, 'index.md');
        
        if (fs.existsSync(indexPath)) {
          const fileContents = fs.readFileSync(indexPath, 'utf8');
          const { data } = matter(fileContents);
          
          items.push({
            slug: dirName,
            title: data.title || dirName.replace(/-/g, ' '),
            category: "wordpress-posts",
            createdAt: data.date || data.createdAt || '',
          });
        }
      }
    }

    // Sort items by date (newest first) if date is available, then alphabetically by title
    items.sort((a, b) => {
      // If both have dates, sort by date
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // If only one has a date, prioritize the one with a date
      if (a.createdAt) return -1;
      if (b.createdAt) return 1;
      // If neither has a date, sort alphabetically by title
      return a.title.localeCompare(b.title);
    });

    return NextResponse.json({ items });

  } catch (error) {
    console.error("Error fetching archive items:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load archive items';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
