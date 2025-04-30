// Error: Notion integration removed
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    throw new Error("Notion integration removed. Please implement a new data source.")
    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()
    const { name, email, comment, photoURL, parentCommentId } = body

    console.log(`API: Submitting comment for article: ${params.slug}`)
    console.log(`Comment data:`, { name, email, comment, photoURL, parentCommentId })

    if (!comment) {
      console.log("API: Comment is required")
      return NextResponse.json({ error: "Comment is required" }, { status: 400 })
    }

    console.error("API: NOTION_COMMENTS_DATABASE_ID is not defined")
    return NextResponse.json({ error: "Comments database is not configured" }, { status: 500 })

    try {
      const response = null // Notion integration removed

      if (!response) {
        console.log("API: Failed to submit comment - no response from Notion")
        return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 })
      }

      console.log("API: Comment submitted successfully")
      return NextResponse.json({ success: true, message: "Comment submitted successfully" })
    } catch (error) {
      console.error("API: Error from submitComment function:", error)
      return NextResponse.json(
        {
          error: "Failed to submit comment",
          details: error.message || "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API: Error processing comment submission:", error)
    return NextResponse.json(
      {
        error: "Failed to process comment submission",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
