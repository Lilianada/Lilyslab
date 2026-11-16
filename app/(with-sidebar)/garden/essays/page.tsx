import { Annoyed } from "lucide-react"
import { getAllEssays, getLockedEssays } from "@/lib/garden/essays"
import type { Essay } from "@/lib/garden/essays"
import TagFilterClient, { type EssayListItem } from "./TagFilterClient"

export const revalidate = 3600 // Revalidate every hour

export default async function EssayPage() {
  let posts: EssayListItem[] = []
  let error: string | null = null

  try {
    // Only what the list needs, so essay text stays out of the browser bundle.
    // Locked essays (published: false) are listed but not readable, so none of their text is sent.
    const toListItem = (essay: Essay, locked: boolean): EssayListItem => {
      const wordCount = locked ? 0 : essay.content.split(/\s+/).filter(Boolean).length
      return {
        slug: essay.slug,
        title: essay.title,
        createdAt: essay.createdAt,
        excerpt: locked ? "" : essay.excerpt || "",
        tags: essay.tags || [],
        wordCount,
        readingTime: Math.max(1, Math.ceil(wordCount / 200)),
        locked,
      }
    }
    posts = [
      ...getAllEssays().map((essay) => toListItem(essay, false)),
      ...getLockedEssays().map((essay) => toListItem(essay, true)),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (err) {
    console.error("Error in EssayPage:", err)
    error = "These essays wouldn't load. Give it a moment and try again."
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="mx-auto w-full max-w-3xl pb-8 pt-16 sm:px-4">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="text-xl font-medium mb-2">Essays</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-10</div>
            <div>Last updated: 2025-06-29</div>
            <div>Inspired by: The need to write more.</div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">There's no limitation to what I write. I write for my future self. P.s locked notes are just drafts.</p>
        </header>

        {error ? (
          <div className="text-center py-8 border rounded-lg p-8">
            <h2 className="text-base font-medium mb-2">A weed got in.</h2>
            <p className="text-muted-foreground mb-4 text-sm">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <TagFilterClient essays={posts} />
        ) : (
          <div className="text-center py-8 border rounded-lg p-8 grid place-items-center">
            <Annoyed size={16} />
            <h2 className="mt-2 text-base font-medium mb-2">No Essays Found</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              There are no essays available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
