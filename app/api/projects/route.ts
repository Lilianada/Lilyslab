import { NextResponse } from "next/server"

export async function GET() {
  try {
    throw new Error("Notion integration removed. Please implement a new data source.")
    return NextResponse.json({ utilities })
  } catch (error) {
    console.error("Error fetching utilities:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}