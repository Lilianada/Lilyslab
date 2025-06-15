import Link from "next/link"
import { formatDate, formatDateForDisplay } from "@/lib/utils"
import { Annoyed } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { getAllWritings } from "@/lib/garden/writings"
import type { Writing } from "@/lib/garden/writings"

// Helper function to count words in a string
function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// Helper function to calculate reading time based on words
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

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
      <div className="container max-w-2xl mx-auto p-0 sm:px-4 py-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="text-xl font-medium mb-2">Writings</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-10</div>
            <div>Last updated: 2025-06-13</div>
            <div>Inspired by: Essays and blogs</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">There's no limitation to what I can and will write.</p>
        </header>

        {error ? (
          <div className="text-center py-8 border rounded-lg p-8">
            <h2 className="text-base font-medium mb-2">This section is still under construction.</h2>
            <p className="text-muted-foreground mb-4 text-sm">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <ul className="mt-6 space-y-2">
            {posts.map((post) => (
              <li key={post.slug} className="group relative">
                <Link
                  href={`/garden/writings/${post.slug}`}
                  className="flex items-center gap-4 py-2 hover:scale-[1.025] transition-all duration-300 group"
                  prefetch
                >
                  {/* Left: Dot and Title */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-extra-steelBlue" />
                    <p className="truncate text-sm">{post.title}</p>
                  </div>
                  {/* Middle: Connecting line */}
                  <div className="flex-1 h-px bg-muted-foreground/30 mx-2 hidden md:block" />
                  {/* Right: Date or Hover Details */}
                  <div className="flex items-center gap-2  justify-end">
                    <span className="hidden group-hover:inline text-xs text-muted-foreground whitespace-nowrap transition-all duration-200">
                      {countWords(post.content)} words • {calculateReadingTime(post.content)} min
                    </span>
                    <time className="group-hover:hidden font-mono text-xs text-muted-foreground whitespace-nowrap transition-all duration-200">
                      {formatDateForDisplay(post.createdAt)}
                    </time>
                  </div>
                </Link>
                {/* <div className="pointer-events-none absolute left-[-20px] top-[50%] transform translate-y-[-50%] z-10 hidden md:group-hover:block">
                  <div className="h-full w-2 rounded-full bg-extra-steelBlue animate-pulse shadow-md" style={{ height: '24px' }} />
                </div> */}
              </li>
            ))}
          </ul>
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
