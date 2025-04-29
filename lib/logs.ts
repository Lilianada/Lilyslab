import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const logsDirectory = path.join(process.cwd(), 'Content/logs');

export interface LogFrontmatter {
  title: string;
  date: string;
  published: boolean;
  tags: string[];
  [key: string]: any; // Allow other potential frontmatter fields
}

export interface LogData {
  slug: string;
  frontmatter: LogFrontmatter;
}

export const getAllLogsData = (): LogData[] => {
  let filenames: string[];
  try {
    filenames = fs.readdirSync(logsDirectory);
  } catch (error) {
    console.error("Error reading logs directory:", logsDirectory, error);
    return []; // Return empty array if directory doesn't exist or error reading
  }

  const allLogsData = filenames
    .filter((filename) => /\.mdx?$/.test(filename)) // Filter for .md or .mdx files
    .map((filename): LogData | null => {
      // Remove ".mdx" from file name to get slug
      const slug = filename.replace(/\.mdx?$/, '');

      // Read markdown file as string
      const fullPath = path.join(logsDirectory, filename);
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const { data } = matter(fileContents);

        // Type guard or validation for frontmatter could be added here
        const frontmatter = data as LogFrontmatter;

        // Basic validation
        if (!frontmatter.title || !frontmatter.date) {
            console.warn(`Skipping ${filename}: missing title or date in frontmatter.`);
            return null;
        }


        return {
          slug,
          frontmatter,
        };
      } catch (error) {
          console.error(`Error processing file ${filename}:`, error);
          return null; // Skip files that cause errors
      }
    })
    .filter((logData): logData is LogData => logData !== null); // Filter out null values from errors/skips

  // Sort logs by date (newest first)
  return allLogsData.sort((a, b) => {
    if (a.frontmatter.date < b.frontmatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
}; 