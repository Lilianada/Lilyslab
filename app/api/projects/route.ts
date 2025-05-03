import { NextResponse } from "next/server"
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  try {
    // Get projects from the Content/projects directory
    const projectsDir = path.join(process.cwd(), "Content/projects");
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith(".md"));
    
    // Sort files numerically
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    
    const projects = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(projectsDir, file), "utf8");
      const { data } = matter(content);
      
      // Check if the project is published
      const published = data.publish === true || data.published === true ||
        (typeof data.publish === 'string' && data.publish.toLowerCase() === 'true') ||
        (typeof data.published === 'string' && data.published.toLowerCase() === 'true');
      
      if (published) {
        projects.push({
          id: file.replace(/\.md$/, ''),
          title: data.title || "Untitled",
          excerpt: data.excerpt || data.description || "No description",
          img: data.img || `/project-images/${file.replace(/\.md$/, '')}.png`,
          url: data.url || null,
          tags: data.tags || [],
          category: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags[0] : (data.category || "Project"),
        });
      }
    }
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}