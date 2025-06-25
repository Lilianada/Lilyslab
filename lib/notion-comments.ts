import { Client } from "@notionhq/client"

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Database IDs
const commentsDbId = process.env.NOTION_COMMENTS_DATABASE_ID

// Submit a new comment to the Comments database
export async function submitComment({ name, email, comment, slug, parentCommentId = null, photoURL = null }) {
  if (!notion) {
    console.error("Notion client is not initialized")
    return null
  }

  if (!commentsDbId) {
    console.error("NOTION_COMMENTS_DATABASE_ID is not defined")
    return null
  }

  try {
    console.log(`Submitting comment to database: ${commentsDbId}`)
    console.log(`Comment data:`, { name, email, comment, slug, parentCommentId, photoURL })

    const properties: any = {
      Name: {
        title: [
          {
            text: {
              content: name || "Anonymous",
            },
          },
        ],
      },
      Comment: {
        rich_text: [
          {
            text: {
              content: comment,
            },
          },
        ],
      },
      Slug: {
        rich_text: [
          {
            text: {
              content: slug,
            },
          },
        ],
      },
      Date: {
        date: {
          start: new Date().toISOString(),
        },
      },
      Published: {
        checkbox: true,
      },
      Status: {
        select: {
          name: "Pending", // Set default status to Pending
        },
      },
    }

    // Add email if provided
    if (email) {
      properties.Email = {
        email: email,
      }
    }

    // Add photo URL if provided
    if (photoURL) {
      properties.PhotoURL = {
        url: photoURL,
      }
    }

    // Add parent comment relation if provided
    if (parentCommentId) {
      properties["Parent Comment"] = {
        relation: [
          {
            id: parentCommentId,
          },
        ],
      }
    }

    console.log("Sending properties to Notion:", JSON.stringify(properties, null, 2))

    const response = await notion.pages.create({
      parent: {
        database_id: commentsDbId,
      },
      properties: properties,
    })

    console.log("Comment submitted successfully:", response.id)
    return response
  } catch (error) {
    console.error("Error submitting comment to Notion:", error)

    // Log more detailed error information
    if (error.response) {
      console.error("Error response from Notion API:", {
        status: error.response.status,
        data: error.response.data,
      })
    }

    throw error
  }
}

// Get comments for a specific article by slug
export async function getCommentsBySlug(slug) {
  if (!notion) {
    console.error("Notion client is not initialized")
    return []
  }

  if (!commentsDbId) {
    console.error("NOTION_COMMENTS_DATABASE_ID is not defined")
    return []
  }

  try {
    const response = await notion.databases.query({
      database_id: commentsDbId,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "ascending",
        },
      ],
    })

    if (!response || !response.results) {
      return []
    }

    // Process the comments to extract the necessary data
    const comments = response.results.map((page) => {
      const properties = page.properties

      return {
        id: page.id,
        name: properties.Name?.title?.[0]?.plain_text || "Anonymous",
        email: properties.Email?.email || null,
        comment: properties.Comment?.rich_text?.[0]?.plain_text || "",
        date: properties.Date?.date?.start || null,
        photoURL: properties.PhotoURL?.url || null,
        parentCommentId: properties["Parent Comment"]?.relation?.[0]?.id || null,
        reply: properties.Reply?.rich_text?.[0]?.plain_text || null,
        status: properties.Status?.select?.name || "Pending", // Include status
      }
    })

    // Organize comments into threads
    const threadedComments = organizeCommentsIntoThreads(comments)

    return threadedComments
  } catch (error) {
    console.error(`Error fetching comments for slug ${slug}:`, error)
    return []
  }
}

// Helper function to organize comments into threads
function organizeCommentsIntoThreads(comments) {
  const commentMap = {}
  const rootComments = []

  // First pass: create a map of all comments by ID
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] }
  })

  // Second pass: organize into parent-child relationships
  comments.forEach((comment) => {
    if (comment.parentCommentId && commentMap[comment.parentCommentId]) {
      // This is a reply, add it to its parent's replies
      commentMap[comment.parentCommentId].replies.push(commentMap[comment.id])
    } else {
      // This is a root comment
      rootComments.push(commentMap[comment.id])
    }
  })

  return rootComments
}

// Update likes for an article
export async function updateArticleLikes(pageId, likes) {
  if (!notion) {
    console.error("Notion client is not initialized")
    return null
  }

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
