import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Interface for the bucket list item data
interface BucketListItem {
  id: string;
  slug: string;
  title: string;
  checked: boolean;
}

const bucketListDirectory = join(process.cwd(), 'Content', 'bucketList');

// Function to safely read directory and handle potential errors
async function readDirectorySafe(dirPath: string): Promise<string[]> {
  try {
    return fs.readdirSync(dirPath);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      console.warn(`Bucket list directory not found: ${dirPath}`);
      return []; // Return empty array if directory doesn't exist
    }
    console.error(`Error reading directory ${dirPath}:`, error);
    throw new Error(`Failed to read bucket list directory.`); // Re-throw other errors
  }
}

export async function GET() {
  try {
    const fileNames = await readDirectorySafe(bucketListDirectory);
    const mdFiles = fileNames.filter(file => file.endsWith('.md'));

    const items: BucketListItem[] = [];

    for (const fileName of mdFiles) {
      const slug = fileName.replace(/\.md$/, '');
      const filePath = join(bucketListDirectory, fileName);

      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);

        // Basic validation
        if (!data.title || typeof data.title !== 'string') {
            console.warn(`Skipping ${fileName}: Missing or invalid title.`);
            continue;
        }

        const item: BucketListItem = {
          id: slug, // Use slug as simple ID for this case
          slug: slug,
          title: data.title,
          checked: data.checked === true, // Ensure boolean, default false
        };
        items.push(item);

      } catch (readError) {
          console.error(`Error processing file ${fileName}:`, readError);
          // Optionally skip this file or handle differently
      }
    }

    // Optional: Sort items if needed, e.g., alphabetically by title
    items.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(items);

  } catch (error) {
    console.error("Error fetching bucket list items:", error);
    // Ensure error is an instance of Error before accessing message
    const errorMessage = error instanceof Error ? error.message : 'Failed to load bucket list data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 