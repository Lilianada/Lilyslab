import { getTools } from "@/lib/notion"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    const tools = await getTools(category || undefined)
    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error in tools API route:", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
} 