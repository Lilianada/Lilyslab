import { Annoyed } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { getAllWritings } from "@/lib/garden/writings"
import type { Writing } from "@/lib/garden/writings"
import TagFilterClient from "./TagFilterClient"

export const revalidate = 3600 // Revalidate every hour

export default async function WritingPage() {
  let posts: Writing[] = []
  let error: string | null = null

  try {
    console.log("Fetching writings...")
    posts = getAllWritings()
    console.log(`Fetched ${posts.length} writings`)
  } catch (err) {
    console.error("Error in WritingPage:", err)
    if (typeof err === "object" && err && "message" in err) {
      error = (err as { message?: string }).message || "An error occurred while fetching writings"
    } else {
      error = "An error occurred while fetching writings"
    }
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-2xl mx-auto p-0 sm:px-4 pt-16 pb-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="text-xl font-medium mb-2">Writings</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-10</div>
            <div>Last updated: 2025-06-29</div>
            <div>Inspired by: The need to write more.</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">There's no limitation to what I write. I write for my future self.</p>
        </header>

        {error ? (
          <div className="text-center py-8 border rounded-lg p-8">
            <h2 className="text-base font-medium mb-2">This section is still under construction.</h2>
            <p className="text-muted-foreground mb-4 text-sm">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <TagFilterClient writings={posts} />
        ) : (
          <div className="text-center py-8 border rounded-lg p-8 grid place-items-center">
            <Annoyed size={16} />
            <h2 className="mt-2 text-base font-medium mb-2">No Writings Found</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              There are no writings available yet.
            </p>
          </div>
        )}
        <Footer />
      </div>
    </div>
  )
}
