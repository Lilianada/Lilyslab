import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { z } from "zod"

// Allowed categories
const ALLOWED_CATEGORIES = [
  "Development",
  "Design",
  "Productivity",
  "AI & ML",
  "Other"
] as const

// Platform options
const PLATFORMS = [
  "iOS",
  "Web",
  "Android",
  "macOS",
  "Windows",
  "Linux"
] as const

type Platform = typeof PLATFORMS[number]

// Request validation schema
const ToolSubmissionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  logo: z.string().url().optional(),
  url: z.string().url(),
  category: z.enum(ALLOWED_CATEGORIES),
  platforms: z.array(z.enum(PLATFORMS))
    .min(1)
    .max(4)
    .refine(
      (platforms) => new Set(platforms).size === platforms.length,
      "Duplicate platforms are not allowed"
    ),
  published: z.boolean().optional(),
})

type ToolSubmission = z.infer<typeof ToolSubmissionSchema>

// Rate limiting map
const REQUESTS = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT = 10 // requests
const TIME_WINDOW = 60 * 1000 // 1 minute in milliseconds

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const requestData = REQUESTS.get(ip)

  if (!requestData) {
    REQUESTS.set(ip, { count: 1, timestamp: now })
    return false
  }

  if (now - requestData.timestamp > TIME_WINDOW) {
    REQUESTS.set(ip, { count: 1, timestamp: now })
    return false
  }

  if (requestData.count >= RATE_LIMIT) {
    return true
  }

  requestData.count++
  return false
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Add CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
        ? 'https://lilyslab.xyz' 
        : 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { headers })
    }

    // Check content type
    const contentType = req.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415, headers }
      )
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers }
      )
    }

    // Validate environment variables
    if (!process.env.NOTION_API_KEY) {
      console.error('NOTION_API_KEY is not configured')
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500, headers }
      )
    }

    if (!process.env.NOTION_TOOLS_DATABASE_ID) {
      console.error('NOTION_TOOLS_DATABASE_ID is not configured')
      return NextResponse.json(
        { error: "Server configuration error: Missing database ID" },
        { status: 500, headers }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    
    try {
      const validatedData = ToolSubmissionSchema.parse(body)
      console.log('Processing submission:', validatedData)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: "Validation error",
            details: validationError.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400, headers }
        )
      }
      throw validationError
    }

    // Create new page in Notion tools database
    try {
      const response = await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_TOOLS_DATABASE_ID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: body.name,
                },
              },
            ],
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: body.description,
                },
              },
            ],
          },
          Logo: {
            rich_text: [
              {
                text: {
                  content: body.logo || "",
                },
              },
            ],
          },
          URL: {
            url: body.url,
          },
          Category: {
            select: {
              name: body.category,
            },
          },
          Platforms: {
            multi_select: body.platforms.map((platform: Platform) => ({
              name: platform
            })),
          },
          Published: {
            checkbox: body.published || false,
          },
          New: {
            checkbox: body.new || true,
          },
        },
      })

      console.log('Tool submitted successfully:', response)
      return NextResponse.json(
        { success: true, page: response },
        { headers }
      )
    } catch (notionError: any) {
      console.error('Notion API Error:', {
        error: notionError,
        message: notionError.message,
        code: notionError.code,
        status: notionError.status,
      })

      // Handle specific Notion API errors
      if (notionError.code === 'unauthorized') {
        return NextResponse.json(
          { error: "Invalid Notion API key" },
          { status: 401, headers }
        )
      }

      if (notionError.code === 'object_not_found') {
        return NextResponse.json(
          { error: "Notion database not found" },
          { status: 404, headers }
        )
      }

      if (notionError.code === 'validation_error') {
        return NextResponse.json(
          { 
            error: "Notion validation error",
            details: notionError.message
          },
          { status: 400, headers }
        )

      }

      return NextResponse.json(
        { 
          error: "Failed to submit to Notion",
          details: notionError.message,
        },
        { status: 500, headers }
      )
    }
  } catch (error: any) {
    console.error("Error processing submission:", error)
    return NextResponse.json(
      { 
        error: "Failed to process submission",
        details: error.message,
      },
      { status: 500, headers: new Headers({
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
          ? 'https://lilyslab.xyz' 
          : 'http://localhost:3000',
      }) }
    )
  }
} 