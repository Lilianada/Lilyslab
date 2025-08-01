import { Footer } from "@/components/layout/footer"
import { getAllPoems } from "@/lib/garden/poems"
import type { Poem } from "@/lib/garden/poems"
import PoemLayoutClient from "./PoemLayoutClient"

export const revalidate = 3600 // Revalidate every hour

export default async function PoemsPage() {
  let poems: Poem[] = []
  let error: string | null = null
  let loading = true

  try {
    console.log("Fetching poems...")
    poems = getAllPoems()
    console.log(`Fetched ${poems.length} poems`)
    loading = false
  } catch (err) {
    console.error("Error in PoemsPage:", err)
    if (typeof err === "object" && err && "message" in err) {
      error = (err as { message?: string }).message || "An error occurred while fetching poems"
    } else {
      error = "An error occurred while fetching poems"
    }
    loading = false
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-4xl mx-auto p-0 sm:px-4 pt-16 pb-8">
        {/* <header className="mb-8 relative">
          <h1 className="text-xl semibold mb-2">Poetry</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-08-01</div>
            <div>Last updated: 2025-08-01</div>
          </div>
        </header> */}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column skeleton */}
            <div className="md:col-span-1 border-r border-border pr-4">
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="border border-gray-100 rounded-md p-3 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column skeleton */}
            <div className="md:col-span-2">
              <div className="border border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          </div>
        ) :  (
          <PoemLayoutClient poems={poems} />
        )}
        
        <Footer />
      </div>
    </div>
  )
}
