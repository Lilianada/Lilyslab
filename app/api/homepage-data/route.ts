import { getPublishedWork, getPublishedProjects, getPublishedSpeaking } from "@/lib/notion"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Starting to fetch homepage data...")
    
    // Use Promise.allSettled to handle partial failures
    const [workResult, projectsResult, speakingResult] = await Promise.allSettled([
      getPublishedWork(),
      getPublishedProjects(),
      getPublishedSpeaking(),
    ])

    // Process results and handle errors
    const work = workResult.status === "fulfilled" ? workResult.value : []
    const projects = projectsResult.status === "fulfilled" ? projectsResult.value : []
    const speaking = speakingResult.status === "fulfilled" ? speakingResult.value : []

    console.log("Data fetched:", {
      workCount: work.length,
      projectsCount: projects.length,
      speakingCount: speaking.length
    })

    // Log any errors that occurred
    if (workResult.status === "rejected") {
      console.error("Error fetching work data:", workResult.reason)
    }
    if (projectsResult.status === "rejected") {
      console.error("Error fetching projects data:", projectsResult.reason)
    }
    if (speakingResult.status === "rejected") {
      console.error("Error fetching speaking data:", speakingResult.reason)
    }

    return NextResponse.json({ work, projects, speaking })
  } catch (error) {
    console.error("Error fetching homepage data:", error)
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 })
  }
}
