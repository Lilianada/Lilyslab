import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

interface Picture {
  id: string
  title: string
  dateTaken: string
  imageUrl: string
  dayNumber: number
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "Content", "100pics", "pictures.md")
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ pictures: [] })
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { data: frontmatter, content } = matter(fileContent)
    
    // Parse the markdown content to extract picture data
    const pictures: Picture[] = []
    const dayMatches = content.match(/## Day (\d+)\s*\n- \*\*Title\*\*: (.*?)\n- \*\*Date Taken\*\*: (.*?)\n- \*\*Image URL\*\*: (.*?)(?=\n|$)/g)
    
    if (dayMatches) {
      dayMatches.forEach(match => {
        const lines = match.split('\n')
        const dayNumber = parseInt(lines[0].match(/## Day (\d+)/)?.[1] || '0')
        const title = lines[1].match(/- \*\*Title\*\*: (.*)/)?.[1] || ''
        const dateTaken = lines[2].match(/- \*\*Date Taken\*\*: (.*)/)?.[1] || ''
        const imageUrl = lines[3].match(/- \*\*Image URL\*\*: (.*)/)?.[1] || ''
        
        if (dayNumber && title && dateTaken && imageUrl) {
          pictures.push({
            id: `day-${dayNumber.toString().padStart(3, '0')}`,
            title,
            dateTaken,
            imageUrl,
            dayNumber
          })
        }
      })
    }

    // Sort pictures by day number
    const sortedPictures = pictures.sort((a, b) => a.dayNumber - b.dayNumber)

    return NextResponse.json({ 
      pictures: sortedPictures,
      metadata: frontmatter 
    })
  } catch (error) {
    console.error("Error reading pictures data:", error)
    return NextResponse.json(
      { error: "Failed to load pictures" },
      { status: 500 }
    )
  }
}
