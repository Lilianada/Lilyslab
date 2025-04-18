import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { NotionToMarkdown } from "notion-to-md"

// Initialize the official Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Initialize the unofficial Notion client for better block fetching
const notionUnofficial = new NotionAPI()

// Initialize the Notion to Markdown converter
const n2m = new NotionToMarkdown({ notionClient: notion })

// Database IDs
const writingsDbId = process.env.NOTION_DATABASE_ID
const speakingDbId = process.env.NOTION_SPEAKING_DATABASE_ID
const projectsDbId = process.env.NOTION_PROJECTS_DATABASE_ID
const workDbId = process.env.NOTION_WORK_DATABASE_ID
const appDissectionDbId = process.env.NOTION_APP_DISSECTION_DATABASE_ID
const resourcesDbId = process.env.NOTION_RESOURCES_DATABASE_ID
const amaDbId = process.env.NOTION_AMA_DATABASE_ID
const toolsDbId = process.env.NOTION_TOOLS_DATABASE_ID

// Helper function to fetch data from a Notion database
async function getDatabaseItems(databaseId: string, filter = {}, sorts = []) {
  console.log('notion init')
  console.log('Database ID:', databaseId)
  console.log('Filter:', JSON.stringify(filter, null, 2))
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filter,
      sorts: sorts,
    })
    console.log('Response:', JSON.stringify(response, null, 2))
    return response.results
  } catch (error) {
    console.error(`Error fetching data from database ${databaseId}:`, error)
    return []
  }
}

// Function to extract properties from a Notion page
function extractProperties(page: any) {
  const properties = page.properties
  return {
    id: page.id,
    title: properties.Title?.title?.[0]?.plain_text || null,
    date: properties.Date?.date?.start || null,
    excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || null,
    slug: properties.Slug?.rich_text?.[0]?.plain_text || null,
    url: properties.URL?.url || null,
    description: properties.Description?.rich_text?.[0]?.plain_text || null,
    company: properties.Company?.title?.[0]?.plain_text || null,
    role: properties.Role?.rich_text?.[0]?.plain_text || null,
    period: properties.Period?.rich_text?.[0]?.plain_text || null,
    name: properties.Name?.title?.[0]?.plain_text || null,
    category: properties.Category?.select?.name || null,
    type: properties.Type?.select?.name || null,
    files: properties.Files?.files?.[0]?.file?.url || null,
    coverImage: properties.Cover?.files?.[0]?.file?.url || properties.Cover?.files?.[0]?.external?.url || null,
    tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
    likes: properties.Likes?.number || 0,
    question: properties.Question?.rich_text?.[0]?.plain_text || null,
    answer: properties.Answer?.rich_text?.[0]?.plain_text || null,
    status: properties.Status?.select?.name || null,
    logo: properties.Logo?.rich_text?.[0]?.plain_text || null,
    platforms: properties.Platforms?.multi_select?.map((platform) => platform.name) || []
  }
}

// Get published articles
export async function getPublishedArticles() {
  const filter = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }
  const sorts = [
    {
      property: "Date",
      direction: "descending",
    },
  ]
  if (!writingsDbId ) {
    return [];
  }
  const pages = await getDatabaseItems(writingsDbId, filter)
  return pages.map((page) => extractProperties(page))
}

// Submit a new AMA question
export async function submitAMAQuestion(name: string, question: string, email = null, photoURL = null) {
  if (!notion || !amaDbId) return null

  try {
    const properties = {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Question: {
        rich_text: [
          {
            text: {
              content: question,
            },
          },
        ],
      },
      DateSubmitted: {
        date: {
          start: new Date().toISOString(),
        },
      },
      Status: {
        select: {
          name: "Pending",
        },
      },
    }

    if (email) {
      properties.Email = {
        email: email,
      }
    }

    if (photoURL) {
      properties.PhotoURL = {
        url: photoURL,
      }
    }

    const response = await notion.pages.create({
      parent: {
        database_id: amaDbId,
      },
      properties: properties,
    })

    return response
  } catch (error) {
    console.error("Error submitting AMA question to Notion:", error)
    return null
  }
}

// Get published AMA questions
export async function getPublishedAMAQuestions() {
  const filter = {
    and: [
      {
        property: "Status",
        select: {
          does_not_equal: "Rejected",
        },
      },
    ],
  }

  const sorts = [
    {
      property: "DateSubmitted",
      direction: "descending",
    },
  ]

  const pages = await getDatabaseItems(amaDbId, filter, sorts)
  return pages.map((page) => {
    const base = extractProperties(page)
    return {
      ...base,
      dateSubmitted: base.date, // alias date to dateSubmitted
    }
  })
}

// Get published app dissections
export async function getPublishedAppDissections() {
  const filter = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const pages = await getDatabaseItems(appDissectionDbId, filter)
  return pages.map((page) => extractProperties(page))
}

// Get published work experience
export async function getPublishedWork() {
  console.log("Fetching work data from database:", workDbId)
  const filter = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const sorts = [
    {
      property: "Date",
      direction: "descending",
    },
  ]

  const pages = await getDatabaseItems(workDbId, filter, sorts)
  console.log("Work data fetched:", pages.length, "items")
  return pages.map((page) => extractProperties(page))
}

// Get published projects
export async function getPublishedProjects() {
  console.log("Fetching projects data from database:", projectsDbId)
  const filter = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const sorts = [
    {
      property: "Date",
      direction: "descending",
    },
  ]

  const pages = await getDatabaseItems(projectsDbId, filter, sorts)
  console.log("Projects data fetched:", pages.length, "items")
  return pages.map((page) => extractProperties(page))
}

// Get published speaking engagements
export async function getPublishedSpeaking() {
  const filter = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const sorts = [
    {
      property: "Date",
      direction: "descending",
    },
  ]

  const pages = await getDatabaseItems(speakingDbId, filter, sorts)
  return pages.map((page) => extractProperties(page))
}

// Get published resources
export async function getPublishedResources() {
  const filter = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const pages = await getDatabaseItems(resourcesDbId, filter)
  return pages.map((page) => extractProperties(page))
}

// Get a specific article by slug
export async function getArticleBySlug(slug) {
  if (!slug) return null

  const filter = {
    property: "Slug",
    rich_text: {
      equals: slug,
    },
  }
  console.log("Filter being used:", filter)
  console.log("writingsDbId:", writingsDbId)

  try {
    const pages = await getDatabaseItems(writingsDbId, filter)
    if (pages.length === 0) return null
    return extractProperties(pages[0])
  } catch (error) {
    console.error("Error fetching article by slug:", error)
    throw error // or return null, or handle as appropriate
  }
}

// Get all article slugs
export async function getAllArticleSlugs() {
  const filter = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const pages = await getDatabaseItems(writingsDbId, filter)
  return pages.map((page) => extractProperties(page).slug).filter(Boolean)
}

// Update likes for an article
export async function updateArticleLikes(pageId, likes) {
  try {
    const response = await notion.pages.update({
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

// Get all tools
export async function getTools(category?: string) {
  let filter: any = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  if (category && category !== "All") {
    filter = {
      and: [
        filter,
        {
          property: "Category",
          select: {
            equals: category,
          },
        },
      ],
    }
  }

  const sorts = [
    {
      property: "Name",
      direction: "ascending",
    },
  ]

  const pages = await getDatabaseItems(toolsDbId, filter, sorts)
  return pages.map((page) => extractProperties(page))
}

export interface ChangelogEntry {
  id: string
  title: string
  date: string
  type: "feature" | "improvement" | "fix" | "breaking"
  category: string
  content: string
  media?: {
    type: "image" | "video"
    url: string
  }[]
  notificationExpiry?: string
}

export async function getChangelogs() {
  const changelogId = process.env.NOTION_CHANGELOG_ID

  if (!changelogId) {
    throw new Error("Missing NOTION_CHANGELOG_ID environment variable")
  }

  const response = await notion.databases.query({
    database_id: changelogId,
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  })

  const changelogs: ChangelogEntry[] = await Promise.all(
    response.results.map(async (page: any) => {
      // Get page content as markdown
      const mdBlocks = await n2m.pageToMarkdown(page.id)
      const markdown = n2m.toMarkdownString(mdBlocks)

      // Extract media files from page content
      const media = page.properties.Media?.files?.map((file: any) => ({
        type: file.type === "file" ? "video" : "image",
        url: file.file?.url || file.external?.url,
      }))

      return {
        id: page.id,
        title: page.properties.Title.title[0].plain_text,
        date: page.properties.Date.date.start,
        type: page.properties.Type.select.name.toLowerCase(),
        category: page.properties.Category.select.name,
        content: markdown,
        media: media || [],
        notificationExpiry: page.properties.NotificationExpiry?.date?.start,
      }
    })
  )

  return changelogs
}
