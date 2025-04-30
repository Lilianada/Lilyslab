// Error: Notion integration removed
import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { Resource } from "@/types"

const RESOURCES_DIR = path.join(process.cwd(), "Content", "resources")

export async function GET() {
  try {
    const files = await fs.readdir(RESOURCES_DIR)
    const mdFiles = files.filter(file => file.endsWith('.md'))
    const matter = (await import('gray-matter')).default

    const resources: Resource[] = []

    for (const file of mdFiles) {
      try {
        const filePath = path.join(RESOURCES_DIR, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const { data } = matter(content)
        resources.push({
          id: file.replace('.md', ''),
          name: data.title,
          description: data.description,
          tags: data.tags || [],
          url: data.url,
          category: data.category,
          date: data.date || null,
          ...data
        })
      } catch (error) {
        console.error(`Error parsing ${file}:`, error)
      }
    }

    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    )
  }
}
