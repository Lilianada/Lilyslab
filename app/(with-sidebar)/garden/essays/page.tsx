import { Annoyed } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { getAllEssays } from "@/lib/garden/essays"
import type { Essay } from "@/lib/garden/essays"
import TagFilterClient from "./TagFilterClient"

export const revalidate = 3600 // Revalidate every hour

export default async function EssayPage() {
  let posts: Essay[] = []
  let error: string | null = null
  let loading = true

  try {
    console.log("Fetching essays...")
    posts = getAllEssays()
    console.log(`Fetched ${posts.length} essays`)
    loading = false
  } catch (err) {
    console.error("Error in EssayPage:", err)
    if (typeof err === "object" && err && "message" in err) {
      error = (err as { message?: string }).message || "An error occurred while fetching essays"
    } else {
      error = "An error occurred while fetching essays"
    }
    loading = false
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-2xl mx-auto p-0 sm:px-4 pt-16 pb-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="text-xl font-medium mb-2">Essays</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-10</div>
            <div>Last updated: 2025-06-29</div>
            <div>Inspired by: The need to write more.</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">There's no limitation to what I write. I write for my future self.</p>
        </header>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            {/* Skeleton for tag filter */}
            <div className="mb-8">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-7 bg-gray-200 rounded-full w-16"></div>
                ))}
              </div>
              <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
            </div>
            
            {/* Skeletons for essay cards */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-md p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="flex space-x-2 mt-3">
                  <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 border rounded-lg p-8">
            <h2 className="text-base font-medium mb-2">This section is still under construction.</h2>
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
        <Footer />
      </div>
    </div>
  )
}
