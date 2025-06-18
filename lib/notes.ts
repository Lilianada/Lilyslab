import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

const notesDirectory = path.join(process.cwd(), 'Content/notes');

export interface NoteFrontmatter {
  title: string;
  createdAt: string;
  lastUpdated: string;
  published?: boolean;
  tags: string[];
  type: string;
  image?: string;
  date?: string; // Keep for backward compatibility
  [key: string]: any; // Allow other potential frontmatter fields
}

export interface NoteData {
  slug: string;
  frontmatter: NoteFrontmatter;
  content: string;
}

export const getAllNotesData = (): NoteData[] => {
  let filenames: string[];
  try {
    filenames = fs.readdirSync(notesDirectory);
  } catch (error) {
    console.error("Error reading notes directory:", notesDirectory, error);
    return []; // Return empty array if directory doesn't exist or error reading
  }

  const allNotesData = filenames
    .filter((filename) => /\.mdx?$/.test(filename)) // Filter for .md or .mdx files
    .filter((filename) => filename !== 'README.md') // Skip README files
    .map((filename): NoteData | null => {
      // Remove ".mdx" from file name to get slug
      const slug = filename.replace(/\.mdx?$/, '');

      // Read markdown file as string
      const fullPath = path.join(notesDirectory, filename);
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const { data, content } = matter(fileContents);

        // Type guard or validation for frontmatter could be added here
        const frontmatter = data as any;

        // Basic validation
        if (!frontmatter.title) {
            console.warn(`Skipping ${filename}: missing title in frontmatter.`);
            return null;
        }
            
        // Handle date fields with proper validation
        // Prefer createdAt, fall back to date if needed
        const createdAt = frontmatter.createdAt || frontmatter.date;
        frontmatter.createdAt = safeFormatDate(createdAt);
        
        // If provided, ensure lastUpdated is valid, otherwise use createdAt
        if (frontmatter.lastUpdated) {
            frontmatter.lastUpdated = safeFormatDate(frontmatter.lastUpdated);
        } else {
            frontmatter.lastUpdated = frontmatter.createdAt;
        }
        
        // Ensure a content type is set
        if (!frontmatter.type) {
            frontmatter.type = 'seedling';
        }

        // Check if the note should be published - use 'published' field for notes
        if (frontmatter.published !== true) {
            return null;
        }

        return {
          slug,
          frontmatter: frontmatter as NoteFrontmatter,
          content
        };
      } catch (error) {
          console.error(`Error processing file ${filename}:`, error);
          return null; // Skip files that cause errors
      }
    })
    .filter((noteData): noteData is NoteData => noteData !== null); // Filter out null values from errors/skips

  // Sort notes by createdAt (newest first)
  return allNotesData.sort((a, b) => {
    // Convert to Date objects for safe comparison
    const dateA = new Date(a.frontmatter.createdAt);
    const dateB = new Date(b.frontmatter.createdAt);
    
    // Sort newest first
    return dateB.getTime() - dateA.getTime();
  });
};
