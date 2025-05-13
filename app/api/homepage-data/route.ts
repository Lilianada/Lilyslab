import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface WorkItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

interface ProjectItem {
  id: string;
  img: string;
}

export async function GET() {
  try {
    // Fetch work data
    const workItems = await getWorkData();
    
    
    // Return combined data
    return NextResponse.json({
      work: workItems,
    });
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json({ error: 'Failed to load homepage data' }, { status: 500 });
  }
}

async function getWorkData(): Promise<WorkItem[]> {
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
    
    // Filter to only published entries and strip the published flag
    return allWorkItems
      .filter(item => item.published)
      .map(({ published, ...rest }) => rest);
  } catch (error) {
    console.error('Error fetching work data:', error);
    return [];
  }
}
