import { submitAMAQuestion, getPublishedAMAQuestions } from "@/lib/notion"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("API: Fetching AMA questions")
    const questions = await getPublishedAMAQuestions()
    console.log(`API: Found ${questions.length} questions`)
    return NextResponse.json({ questions })
  } catch (error) {
    console.error("API: Error fetching AMA questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions", details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, photoURL, question } = body

    console.log("API: Submitting question:", { name, email, photoURL, question })

    if (!question) {
      console.log("API: Question is required")
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const response = await submitAMAQuestion(name || "Anonymous", question, email, photoURL)

    if (!response) {
      console.log("API: Failed to submit question")
      return NextResponse.json({ error: "Failed to submit question" }, { status: 500 })
    }

    console.log("API: Question submitted successfully")
    return NextResponse.json({ success: true, message: "Question submitted successfully" })
  } catch (error) {
    console.error("API: Error submitting AMA question:", error)
    return NextResponse.json({ error: "Failed to submit question", details: error.message }, { status: 500 })
  }
}
