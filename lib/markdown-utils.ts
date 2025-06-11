import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface MarkdownFile {
  content: string;
  frontmatter?: {
    [key: string]: any;
  };
}

/**
 * Reads a markdown file and returns its content and frontmatter
 * @param filePath Relative path to the markdown file from the root of the project
 * @returns Object containing markdown content and frontmatter
 */
export function readMarkdownFile(filePath: string): MarkdownFile {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    content,
    frontmatter: data,
  };
}

/**
 * Reads all markdown files in a directory
 * @param dirPath Relative path to the directory from the root of the project
 * @param extension File extension to look for (default: .md)
 * @returns Array of objects containing filenames, content and frontmatter
 */
export function readMarkdownFiles(dirPath: string, extension = '.md'): Array<MarkdownFile & { filename: string }> {
  const fullPath = path.join(process.cwd(), dirPath);
  const files = fs.readdirSync(fullPath);
  
  const markdownFiles = files
    .filter(file => file.endsWith(extension))
    .map(filename => {
      const filePath = path.join(dirPath, filename);
      const { content, frontmatter } = readMarkdownFile(filePath);
      
      return {
        filename,
        content,
        frontmatter,
      };
    });
  
  return markdownFiles;
}

/**
 * Gets only the frontmatter from markdown files in a directory
 * Useful for building indices or lists
 * @param dirPath Relative path to the directory from the root of the project
 * @param extension File extension to look for (default: .md)
 * @returns Array of objects containing filenames and frontmatter
 */
export function getMarkdownFrontmatter(dirPath: string, extension = '.md'): Array<{ filename: string; frontmatter: any }> {
  const fullPath = path.join(process.cwd(), dirPath);
  const files = fs.readdirSync(fullPath);
  
  const markdownFrontmatter = files
    .filter(file => file.endsWith(extension))
    .map(filename => {
      const filePath = path.join(dirPath, filename);
      const fileContents = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
      const { data } = matter(fileContents);
      
      return {
        filename,
        frontmatter: data,
      };
    });
  
  return markdownFrontmatter;
}
