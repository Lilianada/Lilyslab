"use server"

import { cache } from "react"
import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import type { ChangelogEntry } from "@/lib/notion"

// Debug environment variables
console.log('Environment check:')
console.log('NOTION_API_KEY exists:', !!process.env.NOTION_API_KEY)
console.log('NOTION_API_KEY exists:', !!process.env.NOTION_API_KEY)
console.log('NOTION_CHANGELOG_ID exists:', !!process.env.NOTION_CHANGELOG_ID)

// Use NOTION_API_KEY if available, fall back to NOTION_API_KEY
const notionToken = process.env.NOTION_API_KEY || process.env.NOTION_API_KEY
if (!notionToken) {
  throw new Error("Missing Notion authentication token")
}

const notion = new Client({
  auth: notionToken,
})

// Initialize NotionToMarkdown
const n2m = new NotionToMarkdown({ notionClient: notion })

async function fetchChangelogs() {
  const changelogId = process.env.NOTION_CHANGELOG_ID
  
  console.log('Fetching changelogs with ID:', changelogId)
  
  if (!changelogId) {
    throw new Error("Missing NOTION_CHANGELOG_ID environment variable")
  }

  try {
    console.log('Querying Notion database...')
    const response = await notion.databases.query({
      database_id: changelogId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    })
    
    
    if (!response.results || response.results.length === 0) {
      console.log('No results found in the database')
      return []
    }

    console.log('Processing changelog entries...')
    const processedEntries = await Promise.all(
      response.results.map(async (page: any) => {
        try {
          console.log('Processing page:', page.id)
          // Get page content as markdown
          const mdBlocks = await n2m.pageToMarkdown(page.id)
          const markdown = n2m.toMarkdownString(mdBlocks)
          
          // Extract media files from page content
          const media = page.properties.Media?.files?.map((file: any) => ({
            type: file.type === "file" ? "video" : "image",
            url: file.file?.url || file.external?.url,
          }))

          // Log the properties we're trying to access
          console.log('Page properties:', {
            title: page.properties.Title?.title?.[0]?.plain_text,
            date: page.properties.Date?.date?.start,
            type: page.properties.Type?.select?.name,
            category: page.properties.Category?.select?.name
          })

          const entry: ChangelogEntry = {
            id: page.id,
            title: page.properties.Title.title[0].plain_text,
            date: page.properties.Date.date.start,
            type: page.properties.Type.select.name.toLowerCase() as ChangelogEntry["type"],
            category: page.properties.Category.select.name,
            content: markdown.toString(),
            media: media || [],
            notificationExpiry: page.properties.NotificationExpiry?.date?.start,
          }
          console.log('Successfully processed entry:', entry.title)
          return entry
        } catch (error) {
          console.error('Error processing page:', page.id, error)
          return null
        }
      })
    )

    // Filter out any null entries from errors and cast to ChangelogEntry[]
    const validEntries = processedEntries.filter((entry): entry is ChangelogEntry => entry !== null)
    console.log('Total valid entries:', validEntries.length)
    return validEntries
  } catch (error) {
    console.error('Error in getChangelogs:', error)
    throw error
  }
}

export const getChangelogEntries = cache(async () => {
  try {
    console.log('Starting changelog fetch...')
    const changelogs = await fetchChangelogs()
    console.log('Changelogs fetched successfully:', changelogs?.length)
    return { changelogs }
  } catch (error: any) {
    console.error("Error fetching changelogs:", error)
    return { 
      error: "Failed to fetch changelogs",
      details: error.message 
    }
  }
})