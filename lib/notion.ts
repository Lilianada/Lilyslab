import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { NotionToMarkdown } from "notion-to-md"
import type {
  QueryDatabaseParameters,
  UpdatePageParameters,
  CreatePageParameters,
} from "@notionhq/client/build/src/api-endpoints"
import { ExtendedRecordMap } from "notion-types"

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
const utilitiesDbId = process.env.NOTION_UTILITIES_DATABASE_ID

// Helper function to fetch data from a Notion database
async function getDatabaseItems(databaseId: string, filter?: QueryDatabaseParameters["filter"], sorts?: QueryDatabaseParameters["sorts"]): Promise<any[]> {
  console.log('notion init')
  console.log('Database ID:', databaseId)
  console.log('Filter:', JSON.stringify(filter, null, 2))
  if (!databaseId) {
    console.error("Attempted to query Notion with an undefined database ID.")
    return []
  }
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
  if (!page || !page.properties) {
    console.warn("extractProperties received invalid page object:", page)
    return { id: page?.id ?? "unknown" }
  }
  const properties = page.properties

  return {
    id: page.id,
    title: properties.Title?.title?.[0]?.plain_text ?? null,
    date: properties.Date?.date?.start ?? null,
    excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text ?? null,
    slug: properties.Slug?.rich_text?.[0]?.plain_text ?? null,
    url: properties.URL?.url ?? null,
    description: properties.Description?.rich_text?.[0]?.plain_text ?? null,
    company: properties.Company?.title?.[0]?.plain_text ?? null,
    role: properties.Role?.rich_text?.[0]?.plain_text ?? null,
    period: properties.Period?.rich_text?.[0]?.plain_text ?? null,
    name: properties.Name?.title?.[0]?.plain_text ?? null,
    category: properties.Category?.select?.name ?? null,
    type: properties.Type?.select?.name ?? null,
    files: properties.Files?.files?.[0]?.file?.url ?? null,
    coverImage: properties.Cover?.files?.[0]?.file?.url ?? properties.Cover?.files?.[0]?.external?.url ?? null,
    tags: properties.Tags?.multi_select?.map((tag: { name: string }) => tag.name) ?? [],
    likes: properties.Likes?.number ?? 0,
    question: properties.Question?.rich_text?.[0]?.plain_text ?? null,
    answer: properties.Answer?.rich_text?.[0]?.plain_text ?? null,
    status: properties.Status?.select?.name ?? null,
    logo: properties.Logo?.rich_text?.[0]?.plain_text ?? null,
    platforms: properties.Platforms?.multi_select?.map((platform: { name: string }) => platform.name) ?? []
  }
}

// Get published articles
export async function getPublishedArticles() {
  if (!writingsDbId) {
    console.error("Missing NOTION_DATABASE_ID for writings.")
    return []
  }
  const filter: QueryDatabaseParameters["filter"] = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }
  const sorts: QueryDatabaseParameters["sorts"] = [
    {
      property: "Date",
      direction: "descending",
    },
  ]
  const pages = await getDatabaseItems(writingsDbId, filter, sorts)
  return pages.map((page) => extractProperties(page))
}

// Submit a new AMA question
export async function submitAMAQuestion(name: string, question: string, email: string | null = null, photoURL: string | null = null) {
  if (!notion || !amaDbId) {
    console.error("Missing Notion client or AMA DB ID for submitAMAQuestion.")
    return null
  }

  const properties: CreatePageParameters["properties"] = {
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
    ...(email && { Email: { email: email } }),
    ...(photoURL && { PhotoURL: { url: photoURL } }),
  }

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: amaDbId,
      },
      properties: properties,
    })
    console.log("AMA Question submitted successfully:", response.id)
    return response
  } catch (error) {
    console.error("Error submitting AMA question to Notion:", error)
    return null
  }
}

// Get published AMA questions
export async function getPublishedAMAQuestions() {
  if (!amaDbId) {
    console.error("Missing NOTION_AMA_DATABASE_ID.")
    return []
  }
  const filter: QueryDatabaseParameters["filter"] = {
    and: [
      {
        property: "Status",
        select: {
          does_not_equal: "Rejected",
        },
      },
    ],
  }

  const sorts: QueryDatabaseParameters["sorts"] = [
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
      dateSubmitted: base.date,
    }
  })
}

// Get published app dissections
export async function getPublishedAppDissections() {
  if (!appDissectionDbId) {
    console.error("Missing NOTION_APP_DISSECTION_DATABASE_ID.")
    return []
  }
  const filter: QueryDatabaseParameters["filter"] = {
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
  if (!workDbId) {
    console.error("Missing NOTION_WORK_DATABASE_ID.")
    return []
  }
  console.log("Fetching work data from database:", workDbId)
  const filter: QueryDatabaseParameters["filter"] = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const sorts: QueryDatabaseParameters["sorts"] = [
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
  if (!projectsDbId) {
    console.error("Missing NOTION_PROJECTS_DATABASE_ID.")
    return []
  }
  console.log("Fetching projects data from database:", projectsDbId)
  const filter: QueryDatabaseParameters["filter"] = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const sorts: QueryDatabaseParameters["sorts"] = [
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
  if (!speakingDbId) {
    console.error("Missing NOTION_SPEAKING_DATABASE_ID.")
    return []
  }
  const filter: QueryDatabaseParameters["filter"] = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const sorts: QueryDatabaseParameters["sorts"] = [
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
  if (!resourcesDbId) {
    console.error("Missing NOTION_RESOURCES_DATABASE_ID.")
    return []
  }
  const filter: QueryDatabaseParameters["filter"] = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const pages = await getDatabaseItems(resourcesDbId, filter)
  return pages.map((page) => extractProperties(page))
}

// Get a specific article by slug
export async function getArticleBySlug(slug: string) {
  if (!slug) return null

  if (!writingsDbId) {
    console.error("Missing NOTION_DATABASE_ID for writings.")
    return null
  }

  const filter: QueryDatabaseParameters["filter"] = {
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
export async function getAllArticleSlugs(): Promise<string[]> {
  if (!writingsDbId) {
    console.error("Missing NOTION_DATABASE_ID for writings.")
    return []
  }
  const filter: QueryDatabaseParameters["filter"] = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const pages = await getDatabaseItems(writingsDbId, filter)
  return pages.map((page) => extractProperties(page).slug).filter(Boolean) as string[]
}

// Update likes for an article
export async function updateArticleLikes(pageId: string, likes: number) {
  if (!notion) {
    console.error("Notion client not initialized for updateArticleLikes.")
    return null
  }
  try {
    const properties: UpdatePageParameters["properties"] = {
      Likes: {
        number: likes,
      },
    }
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    })

    return response
  } catch (error) {
    console.error(`Error updating likes for page ${pageId}:`, error)
    throw error
  }
}

// Get all tools
export async function getTools(category?: string) {
  if (!toolsDbId) {
    console.error("Missing NOTION_TOOLS_DATABASE_ID.")
    return []
  }
  let filter: QueryDatabaseParameters["filter"] = {
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

  const sorts: QueryDatabaseParameters["sorts"] = [
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

// export async function getChangelogs() {
//   const changelogId = process.env.NOTION_CHANGELOG_ID

//   if (!changelogId) {
//     throw new Error("Missing NOTION_CHANGELOG_ID environment variable")
//   }

//   const response = await notion.databases.query({
//     database_id: changelogId,
//     sorts: [
//       {
//         property: "Date",
//         direction: "descending",
//       },
//     ],
//   })

//   const changelogs: ChangelogEntry[] = await Promise.all(
//     response.results.map(async (page: any) => {
//       // Get page content as markdown
//       const mdBlocks = await n2m.pageToMarkdown(page.id)
//       const markdown = n2m.toMarkdownString(mdBlocks)

//       // Extract media files from page content
//       const media = page.properties.Media?.files?.map((file: any) => ({
//         type: file.type === "file" ? "video" : "image",
//         url: file.file?.url || file.external?.url,
//       }))

//       return {
//         id: page.id,
//         title: page.properties.Title.title[0].plain_text,
//         date: page.properties.Date.date.start,
//         type: page.properties.Type.select.name.toLowerCase(),
//         category: page.properties.Category.select.name,
//         content: markdown,
//         media: media || [],
//         notificationExpiry: page.properties.NotificationExpiry?.date?.start,
//       }
//     })
//   )

//   return changelogs
// }

// Get published utilities

export async function getChangelogs(): Promise<ChangelogEntry[]> {
  const changelogId = process.env.NOTION_CHANGELOG_ID

  if (!changelogId) {
    throw new Error("Missing NOTION_CHANGELOG_ID environment variable")
  }

  try {
    const response = await notion.databases.query({
      database_id: changelogId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    })

    console.log(`Found ${response.results.length} changelog entries`)

    const changelogs: ChangelogEntry[] = await Promise.all(
      response.results.map(async (page: any) => {
        try {
          // Extract basic properties first
          const id = page.id
          const title = page.properties.Title?.title?.[0]?.plain_text || "Untitled"
          
          console.log(`Processing changelog: ${title} (${id})`)
          
          // Get page content as markdown
          let markdown = ""
          try {
            // Configure notion-to-md for better output
            n2m.setCustomTransformer("table", async (block) => {
              // Custom handling for tables
              const { table } = block as any
              let tableString = "\n"
              
              // Handle table headers
              if (table?.has_column_header) {
                tableString += "| "
                table.children[0].table_row.cells.forEach((cell: any[]) => {
                  tableString += `${cell[0]?.plain_text || ""} | `
                })
                tableString += "\n| "
                table.children[0].table_row.cells.forEach(() => {
                  tableString += "--- | "
                })
                tableString += "\n"
              }
              
              // Handle table rows
              const startIdx = table?.has_column_header ? 1 : 0
              for (let i = startIdx; i < table?.children?.length; i++) {
                tableString += "| "
                table.children[i].table_row.cells.forEach((cell: any[]) => {
                  tableString += `${cell[0]?.plain_text || ""} | `
                })
                tableString += "\n"
              }
              
              return tableString
            })
            
            // Convert page to markdown blocks
            const mdBlocks = await n2m.pageToMarkdown(id)
            
            if (!mdBlocks || mdBlocks.length === 0) {
              console.warn(`No markdown blocks found for page ${id} (${title})`)
            } else {
              console.log(`Successfully converted ${mdBlocks.length} blocks to markdown for ${title}`)
            }
            
            // Convert blocks to markdown string
            const mdString = n2m.toMarkdownString(mdBlocks)
            markdown = typeof mdString === 'string' ? mdString : mdString.parent
            
            // Log the first part of the markdown to check content
            console.log(`Markdown for ${title} (preview): ${markdown.substring(0, 100)}...`)
          } catch (mdError: any) {
            console.error(`Error converting page ${id} to markdown:`, mdError)
            markdown = `*Error loading content: ${mdError.message || "Unknown error"}*`
          }

          // Extract media files from page content
          const media = page.properties.Media?.files?.map((file: any) => ({
            type: file.type === "file" ? "video" : "image",
            url: file.file?.url || file.external?.url,
          })) || []

          return {
            id,
            title,
            date: page.properties.Date?.date?.start || new Date().toISOString(),
            type: (page.properties.Type?.select?.name?.toLowerCase() || "improvement") as ChangelogEntry["type"],
            category: page.properties.Category?.select?.name || "General",
            content: markdown,
            media,
            notificationExpiry: page.properties.NotificationExpiry?.date?.start,
          }
        } catch (pageError) {
          console.error(`Error processing page ${page.id}:`, pageError)
          return {
            id: page.id,
            title: "Error loading entry",
            date: new Date().toISOString(),
            type: "improvement",
            category: "General",
            content: "*Error loading changelog entry*",
            media: [],
          }
        }
      })
    )

    return changelogs
  } catch (error) {
    console.error("Error fetching changelogs:", error)
    throw error
  }
}

// Alternative approach using blocks API directly
export async function getChangelogsWithBlocks(): Promise<ChangelogEntry[]> {
  const changelogId = process.env.NOTION_CHANGELOG_ID

  if (!changelogId) {
    throw new Error("Missing NOTION_CHANGELOG_ID environment variable")
  }

  try {
    const response = await notion.databases.query({
      database_id: changelogId,
      sorts: [{ property: "Date", direction: "descending" }],
    })

    const changelogs: ChangelogEntry[] = await Promise.all(
      response.results.map(async (page: any) => {
        const id = page.id
        const title = page.properties.Title?.title?.[0]?.plain_text || "Untitled"
        
        // Get all blocks for the page
        let content = ""
        try {
          const blocks = await notion.blocks.children.list({ block_id: id })
          
          // Process blocks to extract content
          content = await processBlocks(blocks.results)
        } catch (blocksError) {
          console.error(`Error fetching blocks for page ${id}:`, blocksError)
          content = "*Error loading content*"
        }

        return {
          id,
          title,
          date: page.properties.Date?.date?.start || new Date().toISOString(),
          type: (page.properties.Type?.select?.name?.toLowerCase() || "improvement") as ChangelogEntry["type"],
          category: page.properties.Category?.select?.name || "General",
          content,
          media: page.properties.Media?.files?.map((file: any) => ({
            type: file.type === "file" ? "video" : "image",
            url: file.file?.url || file.external?.url,
          })) || [],
          notificationExpiry: page.properties.NotificationExpiry?.date?.start,
        }
      })
    )

    return changelogs
  } catch (error) {
    console.error("Error fetching changelogs:", error)
    throw error
  }
}

// Helper function to process blocks recursively
async function processBlocks(blocks: any[]): Promise<string> {
  if (!blocks || blocks.length === 0) return ""
  
  let content = ""
  
  for (const block of blocks) {
    try {
      switch (block.type) {
        case "paragraph":
          content += processRichText(block.paragraph.rich_text) + "\n\n"
          break
        case "heading_1":
          content += `# ${processRichText(block.heading_1.rich_text)}\n\n`
          break
        case "heading_2":
          content += `## ${processRichText(block.heading_2.rich_text)}\n\n`
          break
        case "heading_3":
          content += `### ${processRichText(block.heading_3.rich_text)}\n\n`
          break
        case "bulleted_list_item":
          content += `* ${processRichText(block.bulleted_list_item.rich_text)}\n`
          break
        case "numbered_list_item":
          content += `1. ${processRichText(block.numbered_list_item.rich_text)}\n`
          break
        case "to_do":
          const checked = block.to_do.checked ? "[x]" : "[ ]"
          content += `${checked} ${processRichText(block.to_do.rich_text)}\n`
          break
        case "toggle":
          content += `<details><summary>${processRichText(block.toggle.rich_text)}</summary>\n\n`
          // Get children of toggle
          const toggleChildren = await notion.blocks.children.list({ block_id: block.id })
          content += await processBlocks(toggleChildren.results)
          content += "</details>\n\n"
          break
        case "code":
          content += "```" + (block.code.language || "") + "\n"
          content += processRichText(block.code.rich_text)
          content += "\n```\n\n"
          break
        case "quote":
          content += `> ${processRichText(block.quote.rich_text)}\n\n`
          break
        case "divider":
          content += "---\n\n"
          break
        case "table":
          // Handle table using the blocks API
          const tableRows = await notion.blocks.children.list({ block_id: block.id })
          content += await processTable(tableRows.results, block)
          break
        case "image":
          const imageUrl = block.image.file?.url || block.image.external?.url
          const imageCaption = block.image.caption?.length > 0 
            ? processRichText(block.image.caption) 
            : "Image"
          content += `![${imageCaption}](${imageUrl})\n\n`
          break
        default:
          // For unsupported block types
          if (block.has_children) {
            const children = await notion.blocks.children.list({ block_id: block.id })
            content += await processBlocks(children.results)
          }
      }
    } catch (blockError) {
      console.error(`Error processing block ${block.id}:`, blockError)
      content += "*Error processing content block*\n\n"
    }
  }
  
  return content
}

// Helper function to process rich text
function processRichText(richText: any[]): string {
  if (!richText || richText.length === 0) return ""
  
  return richText.map(text => {
    let content = text.plain_text || ""
    
    // Apply basic formatting
    if (text.annotations) {
      if (text.annotations.bold) content = `**${content}**`
      if (text.annotations.italic) content = `*${content}*`
      if (text.annotations.strikethrough) content = `~~${content}~~`
      if (text.annotations.code) content = `\`${content}\``
    }
    
    // Handle links
    if (text.href) {
      content = `[${content}](${text.href})`
    }
    
    return content
  }).join("")
}

// Helper function to process tables
async function processTable(rows: any[], tableBlock: any): Promise<string> {
  if (!rows || rows.length === 0) return ""
  
  let tableContent = "\n"
  const firstRow = rows[0]
  
  if (!firstRow || !firstRow.table_row || !firstRow.table_row.cells) {
    return "*Error processing table*\n\n"
  }
  
  const columnCount = firstRow.table_row.cells.length
  
  // Create header row
  tableContent += "| "
  for (let i = 0; i < columnCount; i++) {
    const cellContent = firstRow.table_row.cells[i]?.map((rt: any) => processRichText([rt])).join("") || ""
    tableContent += `${cellContent} | `
  }
  tableContent += "\n"
  
  // Create separator row
  tableContent += "| "
  for (let i = 0; i < columnCount; i++) {
    tableContent += "--- | "
  }
  tableContent += "\n"
  
  // Create data rows (skip first row if it's a header)
  const startIdx = tableBlock.table?.has_column_header ? 1 : 0
  for (let i = startIdx; i < rows.length; i++) {
    const row = rows[i]
    tableContent += "| "
    
    for (let j = 0; j < columnCount; j++) {
      const cellContent = row.table_row.cells[j]?.map((rt: any) => processRichText([rt])).join("") || ""
      tableContent += `${cellContent} | `
    }
    tableContent += "\n"
  }
  
  return tableContent + "\n"
}






export async function getPublishedUtilities() {
  if (!utilitiesDbId) {
    console.error("Missing NOTION_UTILITIES_DATABASE_ID.")
    return []
  }
  const filter: QueryDatabaseParameters["filter"] = {
    property: "Published",
    checkbox: {
      equals: true,
    },
  }

  const pages = await getDatabaseItems(utilitiesDbId, filter)
  return pages.map((page) => extractProperties(page))
}
