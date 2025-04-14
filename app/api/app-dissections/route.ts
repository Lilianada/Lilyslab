import { getPublishedAppDissections } from "@/lib/notion"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apps = await getPublishedAppDissections()
    return NextResponse.json({ apps })
  } catch (error) {
    console.error("Error fetching app dissections:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
