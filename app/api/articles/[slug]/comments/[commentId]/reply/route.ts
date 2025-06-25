import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { checkUserIsAdmin } from "@/lib/admin-service"

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function POST(request: Request, { params }: { params: { slug: string; commentId: string } }) {
  try {
    const { reply, adminEmail } = await request.json()

    console.log("Admin reply request received:", {
      commentId: params.commentId,
      adminEmail,
      replyLength: reply?.length || 0,
    })

    // Verify this is an admin request
    const isAdmin = await checkUserIsAdmin(adminEmail)
    if (!isAdmin) {
      console.error("Unauthorized admin reply attempt from:", adminEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!reply) {
      return NextResponse.json({ error: "Reply text is required" }, { status: 400 })
    }

    // Update the comment in Notion
    try {
      console.log("Updating Notion comment:", params.commentId)

      const response = await notion.pages.update({
        page_id: params.commentId,
        properties: {
          Reply: {
            rich_text: [
              {
                text: {
                  content: reply,
                },
              },
            ],
          },
          Status: {
            select: {
              name: "Answered",
            },
          },
        },
      })

      console.log("Notion update successful")

      return NextResponse.json({
        success: true,
        message: "Reply submitted successfully",
      })
    } catch (notionError) {
      console.error("Error updating Notion comment:", notionError)
      return NextResponse.json(
        {
          error: "Failed to update comment in Notion",
          details: notionError.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing admin reply:", error)
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}
