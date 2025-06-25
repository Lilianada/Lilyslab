import { NextResponse } from "next/server"

export async function GET() {
  // Only return this in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Debug endpoint only available in development" }, { status: 403 })
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    notionDatabases: {
      writings: Boolean(process.env.NOTION_DATABASE_ID),
      speaking: Boolean(process.env.NOTION_SPEAKING_DATABASE_ID),
      projects: Boolean(process.env.NOTION_PROJECTS_DATABASE_ID),
      work: Boolean(process.env.NOTION_WORK_DATABASE_ID),
      appDissection: Boolean(process.env.NOTION_APP_DISSECTION_DATABASE_ID),
      resources: Boolean(process.env.NOTION_RESOURCES_DATABASE_ID),
      ama: Boolean(process.env.NOTION_AMA_DATABASE_ID),
    },
    amaDbId: process.env.NOTION_AMA_DATABASE_ID?.substring(0, 5) + "...", // Only show first 5 chars for security
  })
}
