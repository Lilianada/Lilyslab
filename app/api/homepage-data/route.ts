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
    
    // Fetch projects data
    const projectItems = await getProjectsData();
    
    // Return combined data
    return NextResponse.json({
      work: workItems,
      projects: projectItems
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

async function getProjectsData(): Promise<ProjectItem[]> {
  try {
    const projectsDir = path.join(process.cwd(), "Content/projects");
    const files = await fs.promises.readdir(projectsDir);
    
    const projectItems = await Promise.all(
      files
        .filter((filename) => filename.endsWith('.md'))
        .map(async (filename) => {
          const filePath = path.join(projectsDir, filename);
          const fileContent = await fs.promises.readFile(filePath, 'utf-8');
          const { data } = matter(fileContent);
          
          // Check if the project is published
          const published = data.publish === true || data.published === true ||
            (typeof data.publish === 'string' && data.publish.toLowerCase() === 'true') ||
            (typeof data.published === 'string' && data.published.toLowerCase() === 'true');
            
          if (!published) {
            return null;
          }
          
          // For the homepage, we just need the id and img
          // If img is not provided, use a default placeholder
          return {
            id: filename.replace(/\.md$/, ''),
            img: data.img || `/project-images/${filename.replace(/\.md$/, '')}.png`,
          };
        })
    );
    
    // Filter out null values (unpublished projects)
    return projectItems.filter(Boolean) as ProjectItem[];
  } catch (error) {
    console.error('Error fetching projects data:', error);
    return [];
  }
}
