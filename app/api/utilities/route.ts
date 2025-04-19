import { NextResponse } from "next/server"
import { getPublishedUtilities } from "@/lib/notion"

export async function GET() {
  try {
    const utilities = await getPublishedUtilities()
    return NextResponse.json({ utilities })
  } catch (error) {
    console.error("Error fetching utilities:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}