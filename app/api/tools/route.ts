import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Tool } from "@/types"; // Assuming you have a Tool type defined

/**
 * API route handler to parse markdown files with front matter in Content/tools/
 * and return an array of tool objects.
 */
export async function GET() {
  const toolsDir = path.join(process.cwd(), 'Content', 'tools');
  let tools: Tool[] = [];

  try {
    const files = await fs.readdir(toolsDir);
    // Filter for markdown files only
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    for (const file of mdFiles) {
      // Skip the non-content tools.md file if it exists
      if (file.toLowerCase() === 'tools.md') continue;

      const filePath = path.join(toolsDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      // Parse front matter
      const { data } = matter(fileContent);

      // Basic validation and type assertion (adjust as needed)
      if (data.publish === true && data.name && data.description && data.url && data.category && data.platforms) {
        tools.push({
          id: file.replace(/\.md$/, ''), // Generate ID from filename
          name: data.name,
          description: data.description,
          url: data.url,
          category: data.category,
          // Ensure platforms is always an array
          platforms: Array.isArray(data.platforms) ? data.platforms : [data.platforms],
          logo: data.logo || null, // Handle optional logo
          published: data.publish === true, // Include published flag
        });
      }
    }

    // Optional: Sort tools if needed, e.g., by name
    tools.sort((a, b) => a.name.localeCompare(b.name));

  } catch (error) {
    console.error("Error reading or parsing tools content:", error);
    // Return an error response
    return NextResponse.json({ error: 'Failed to load tools data' }, { status: 500 });
  }

  // Return the structured tools data
  return NextResponse.json(tools);
} 