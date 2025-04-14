import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"

// Initialize the official Notion client for database queries
const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Initialize the unofficial Notion client for block content
const notionAPI = new NotionAPI()

// Database IDs
const writingsDbId = process.env.NOTION_DATABASE_ID

// Get a specific article by slug using the official API
export async function getArticleBySlug(slug) {
  if (!slug) {
    console.error("No slug provided")
    return null
  }

  try {
    console.log(`Fetching article with slug: ${slug}`)
    const response = await notionClient.databases.query({
      database_id: writingsDbId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    })

    if (!response.results.length) {
      console.log(`No article found with slug: ${slug}`)
      return null
    }

    const page = response.results[0]
    const properties = page.properties

    return {
      id: page.id,
      slug: properties.Slug?.rich_text?.[0]?.plain_text || null,
      title: properties.Title?.title?.[0]?.plain_text || "Untitled",
      date: properties.Date?.date?.start || null,
      excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || null,
      coverImage: properties.Cover?.files?.[0]?.file?.url || properties.Cover?.files?.[0]?.external?.url || null,
      tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
      likes: properties.Likes?.number || 0,
    }
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error)
    return null
  }
}

// Get all article slugs for static generation
export async function getAllArticleSlugs() {
  try {
    const response = await notionClient.databases.query({
      database_id: writingsDbId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    })

    return response.results.map((page) => page.properties.Slug?.rich_text?.[0]?.plain_text).filter(Boolean)
  } catch (error) {
    console.error("Error fetching all article slugs:", error)
    return []
  }
}

// Get the content blocks for a specific page using the unofficial API
export async function getArticleBlocks(pageId) {
  if (!pageId) {
    console.error("Page ID is required to fetch blocks")
    return { block: {} }
  }

  try {
    console.log(`Fetching blocks for page: ${pageId}`)
    const recordMap = await notionAPI.getPage(pageId)
    return recordMap
  } catch (error) {
    console.error(`Error fetching blocks for page ${pageId}:`, error)
    return { block: {} }
  }
}

// Update likes for an article
export async function updateArticleLikes(pageId, likes) {
  if (!notionClient) {
    console.error("Notion client is not initialized")
    return null
  }

  try {
    const response = await notionClient.pages.update({
      page_id: pageId,
      properties: {
        Likes: {
          number: likes,
        },
      },
    })

    return response
  } catch (error) {
    console.error(`Error updating likes for page ${pageId}:`, error)
    throw error
  }
}
