import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Define types for clarity
interface UsesItem {
  name: string;
  description: string;
  url: string;
  publish?: boolean;
}

interface Category {
  name: string;
  items: UsesItem[];
}

// Main function to handle GET requests
export async function GET() {
  // Try to load from Content/uses directory, if it exists
  const contentDir = path.join(process.cwd(), 'Content', 'uses');
  // Define the desired display order for categories
  const desiredOrder = ["Hardware", "Development", "Design", "Tech Stack", "Productivity"];
  let categoriesData: Category[] = [];

  try {
    // Read all entries (files and directories) in the content directory
    const categoryDirs = await fs.readdir(contentDir, { withFileTypes: true });

    // Process each directory asynchronously
    const categoryPromises = categoryDirs
      .filter(dirent => dirent.isDirectory()) // Only process directories
      .map(async (dirent) => {
        const categoryName = dirent.name;
        const categoryPath = path.join(contentDir, categoryName);
        const items: UsesItem[] = [];

        try {
          // Read all files within the category directory
          const files = await fs.readdir(categoryPath);
          // Filter for markdown files only
          const mdFiles = files.filter((file) => file.endsWith('.md'));

          // Sort files numerically based on their names (e.g., 001.md, 002.md)
          mdFiles.sort((a, b) => {
            const numA = parseInt(a.match(/^(\\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/^(\\d+)/)?.[1] || '0');
            return numA - numB;
          });

          // Process each markdown file
          for (const file of mdFiles) {
            const filePath = path.join(categoryPath, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            // Parse front matter
            const { data } = matter(fileContent);

            // Validate required fields and publish status
            if (data.publish === true && data.name && data.description && data.url) {
              items.push({
                name: data.name,
                description: data.description,
                url: data.url,
                publish: data.publish,
              });
            }
          }
        } catch (readError) {
          console.error(`Error reading files in category ${categoryName}:`, readError);
          // Allow processing to continue even if one category fails
        }

        // Format the category name (e.g., 'tech-Uses' -> 'Tech Uses')
        const formattedCategoryName = categoryName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Return category data if it has items
        return items.length > 0 ? { name: formattedCategoryName, items } : null;
      });

    // Wait for all directory processing promises to resolve
    const results = await Promise.all(categoryPromises);

    // Filter out any null results (categories that failed or had no published items)
    const validCategories = results.filter((category): category is Category => category !== null);

    // Sort the valid categories based on the desired order
    validCategories.sort((a, b) => {
      const indexA = desiredOrder.indexOf(a.name);
      const indexB = desiredOrder.indexOf(b.name);
      // Handle categories not in the desired order (append alphabetically)
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1; // Put unknowns at the end
      if (indexB === -1) return -1;
      return indexA - indexB; // Sort based on predefined order
    });

    categoriesData = validCategories;

  } catch (error) {
    console.error("Error fetching Uses data:", error);
    // Return an error response if the top-level directory read fails
    return NextResponse.json({ error: 'Failed to load Uses categories' }, { status: 500 });
  }

  // Return the structured category data
  return NextResponse.json(categoriesData);
} 