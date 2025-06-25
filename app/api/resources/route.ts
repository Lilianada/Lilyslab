import { getPublishedResources } from "@/lib/notion"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const resources = await getPublishedResources()
    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
