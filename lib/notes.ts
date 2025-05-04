import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const notesDirectory = path.join(process.cwd(), 'Content/notes');

export interface NoteFrontmatter {
  title: string;
  date: string;
  publish?: boolean;
  tags: string[];
  image?: string;
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
        const frontmatter = data as NoteFrontmatter;

        // Basic validation
        if (!frontmatter.title || !frontmatter.date) {
            console.warn(`Skipping ${filename}: missing title or date in frontmatter.`);
            return null;
        }

        // Check if the note should be published
        if (frontmatter.publish === false) {
            return null;
        }

        return {
          slug,
          frontmatter,
          content
        };
      } catch (error) {
          console.error(`Error processing file ${filename}:`, error);
          return null; // Skip files that cause errors
      }
    })
    .filter((noteData): noteData is NoteData => noteData !== null); // Filter out null values from errors/skips

  // Sort notes by date (newest first)
  return allNotesData.sort((a, b) => {
    if (a.frontmatter.date < b.frontmatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
};
