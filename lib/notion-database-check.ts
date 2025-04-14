import { Client } from "@notionhq/client"

export async function checkNotionCommentsDatabase() {
  const notionKey = process.env.NOTION_API_KEY
  const commentsDbId = process.env.NOTION_COMMENTS_DATABASE_ID

  if (!notionKey || !commentsDbId) {
    return {
      success: false,
      message: "Missing Notion API key or Comments Database ID",
    }
  }

  try {
    const notion = new Client({ auth: notionKey })
    const database = await notion.databases.retrieve({ database_id: commentsDbId })

    // Check required properties
    const properties = database.properties || {}
    const requiredProperties = [
      { name: "Name", type: "title" },
      { name: "Comment", type: "rich_text" },
      { name: "Slug", type: "rich_text" },
      { name: "Date", type: "date" },
      { name: "Published", type: "checkbox" },
      { name: "Status", type: "select" },
    ]

    const missingProperties = requiredProperties.filter((required) => {
      const prop = properties[required.name]
      return !prop || prop.type !== required.type
    })

    if (missingProperties.length > 0) {
      return {
        success: false,
        message: "Comments database is missing required properties",
        missingProperties: missingProperties.map((p) => `${p.name} (${p.type})`),
      }
    }

    return {
      success: true,
      message: "Comments database structure is valid",
    }
  } catch (error) {
    return {
      success: false,
      message: "Error checking Notion database",
      error: error.message,
    }
  }
}
