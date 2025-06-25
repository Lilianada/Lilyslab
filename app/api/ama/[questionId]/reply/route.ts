import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { checkUserIsAdmin } from "@/lib/admin-service"

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function POST(request: Request, { params }: { params: { questionId: string } }) {
  try {
    const { answer, adminEmail } = await request.json()

    // Verify this is an admin request
    const isAdmin = await checkUserIsAdmin(adminEmail)
    if (!isAdmin) {
      console.error("Unauthorized admin answer attempt from:", adminEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!answer) {
      return NextResponse.json({ error: "Answer text is required" }, { status: 400 })
    }

    // Update the question in Notion
    try {
      const response = await notion.pages.update({
        page_id: params.questionId,
        properties: {
          Answer: {
            rich_text: [
              {
                text: {
                  content: answer,
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

      return NextResponse.json({
        success: true,
        message: "Answer submitted successfully",
      })
    } catch (notionError) {
      console.error("Error updating Notion question:", notionError)
      return NextResponse.json(
        {
          error: "Failed to update question in Notion",
          details: notionError.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing admin answer:", error)
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}
