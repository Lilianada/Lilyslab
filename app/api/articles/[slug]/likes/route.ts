// Error: Notion integration removed
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    throw new Error("Notion integration removed. Please implement a new data source.")

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ likes: 0 })
  } catch (error) {
    console.error("Error fetching article likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { action } = await request.json()
    throw new Error("Notion integration removed. Please implement a new data source.")

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const currentLikes = 0
    const newLikes = action === "increment" ? currentLikes + 1 : Math.max(0, currentLikes - 1)

    // Notion integration removed.

    return NextResponse.json({ likes: newLikes })
  } catch (error) {
    console.error("Error updating article likes:", error)
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 })
  }
}
