import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  try {
    const workDir = path.join(process.cwd(), "Content/work");
    const files = await fs.promises.readdir(workDir);
    const allWorkItems = await Promise.all(
      files
        .filter((filename) => filename.endsWith('.md'))
        .map(async (filename) => {
          const filePath = path.join(workDir, filename);
          const fileContent = await fs.promises.readFile(filePath, 'utf-8');
          const { data } = matter(fileContent);
          // only include published items
          console.log("data", data)
          return {
            id: filename.replace(/\.md$/, ''),
            company: data.company || '',
            role: data.role || '',
            period: data.period || '',
            description: data.description || '',
            published: data.published ?? false,
          };
        })
    );
    // filter to only published entries and strip the flag
    const workItems = allWorkItems
      .filter(item => item.published)
      .map(({ published, ...rest }) => rest);
    return NextResponse.json(workItems);
  } catch (error) {
    console.error('Error fetching work data:', error);
    return NextResponse.json({ error: 'Failed to load work data' }, { status: 500 });
  }
}
