import { getArticleBySlug, updateArticleLikes } from "@/lib/notion"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const article = await getArticleBySlug(params.slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ likes: article.likes || 0 })
  } catch (error) {
    console.error("Error fetching article likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { action } = await request.json()
    const article = await getArticleBySlug(params.slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const currentLikes = article.likes || 0
    const newLikes = action === "increment" ? currentLikes + 1 : Math.max(0, currentLikes - 1)

    await updateArticleLikes(article.id, newLikes)

    return NextResponse.json({ likes: newLikes })
  } catch (error) {
    console.error("Error updating article likes:", error)
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 })
  }
}
