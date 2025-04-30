// Error: Notion integration removed
import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { AppDissection } from "@/types"

const DISSECTIONS_DIR = path.join(process.cwd(), "Content", "app-dissections")

export async function GET() {
  try {
    const files = await fs.readdir(DISSECTIONS_DIR)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    
    const apps: AppDissection[] = []
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(DISSECTIONS_DIR, file)
        const content = await fs.readFile(filePath, 'utf-8')
        apps.push(JSON.parse(content))
      } catch (error) {
        console.error(`Error parsing ${file}:`, error)
      }
    }
    
    return NextResponse.json({ apps })
  } catch (error) {
    console.error("Error fetching app dissections:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    )
  }
}
