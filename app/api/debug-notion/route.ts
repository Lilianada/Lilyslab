import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export async function GET() {
  // Only return this in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Debug endpoint only available in development" }, { status: 403 })
  }

  const notionKey = process.env.NOTION_API_KEY
  const commentsDbId = process.env.NOTION_COMMENTS_DATABASE_ID

  // Check if the Notion API key and database ID are defined
  const configStatus = {
    notionApiKey: notionKey ? "✓ defined" : "✗ missing",
    commentsDbId: commentsDbId ? "✓ defined" : "✗ missing",
  }

  // Test the Notion connection if credentials are available
  let connectionStatus = "Not tested (missing credentials)"
  let databaseStatus = "Not tested (missing credentials)"

  if (notionKey && commentsDbId) {
    try {
      const notion = new Client({ auth: notionKey })

      // Test the connection by retrieving the user's bot
      const userResponse = await notion.users.me()
      connectionStatus = userResponse ? "✓ connected" : "✗ failed"

      // Test the database access
      try {
        const dbResponse = await notion.databases.retrieve({ database_id: commentsDbId })
        databaseStatus = dbResponse ? "✓ accessible" : "✗ not accessible"

        // Get database schema
        const dbSchema = dbResponse.properties
          ? Object.keys(dbResponse.properties).map((key) => ({
              name: key,
              type: dbResponse.properties[key].type,
            }))
          : []

        return NextResponse.json({
          config: configStatus,
          connection: connectionStatus,
          database: databaseStatus,
          databaseName: dbResponse.title?.[0]?.plain_text || "Unnamed Database",
          databaseSchema: dbSchema,
          requiredProperties: [
            "Name (title)",
            "Comment (rich_text)",
            "Slug (rich_text)",
            "Date (date)",
            "Published (checkbox)",
            "Status (select)",
            "Email (email) - optional",
            "PhotoURL (url) - optional",
            "Parent Comment (relation) - optional",
          ],
        })
      } catch (dbError) {
        return NextResponse.json({
          config: configStatus,
          connection: connectionStatus,
          database: "✗ error accessing database",
          error: dbError.message,
          tip: "Check if the database ID is correct and the Notion integration has access to it",
        })
      }
    } catch (error) {
      return NextResponse.json({
        config: configStatus,
        connection: "✗ failed",
        error: error.message,
        tip: "Check if your Notion API key is correct",
      })
    }
  }

  return NextResponse.json({
    config: configStatus,
    connection: connectionStatus,
    database: databaseStatus,
    tip: "Make sure both NOTION_API_KEY and NOTION_COMMENTS_DATABASE_ID are defined in your environment variables",
  })
}
