import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Annoyed } from "lucide-react"

// Define the Writing interface directly here instead of importing from lib
export interface Writing {
  slug: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  content: string;
  published: boolean;
  type: string;
}

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

// Helper to group writings by month and year
function groupWritingsByMonth(writings: Writing[]) {
  const grouped: Record<string, Writing[]> = {}

  writings.forEach(writing => {
    if (!writing.createdAt) return
    
    const date = new Date(writing.createdAt)
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = []
    }
    
    grouped[monthYear].push(writing)
  })

  // Sort the keys (month-year) in reverse chronological order
  return Object.keys(grouped)
    .sort((a, b) => {
      const dateA = new Date(grouped[a][0].createdAt)
      const dateB = new Date(grouped[b][0].createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    .map(monthYear => ({
      monthYear,
      writings: grouped[monthYear]
    }))
}

export default async function WritingPage() {
  let posts: Writing[] = []
  let error: string | null = null

  try {
    console.log("Fetching writings...")
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/writings`, {
      next: { revalidate: 3600 } // revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch writings: ${response.status} ${response.statusText}`)
    }
    
    posts = await response.json()
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
    <div className="max-w-2xl w-full mx-auto animate-fade-in sm:px-6 py-12">
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">Writings</h1>
        <p className="text-sm text-muted-foreground">There's no limitation to what I can and will write.</p>
      </header>

      {error ? (
        <div className="text-center py-8 border rounded-lg p-8">
          <h2 className="text-base font-medium mb-2">This section is still under construction.</h2>
          <p className="text-muted-foreground mb-4 text-sm">{error}</p>
        </div>
      ) : posts.length > 0 ? (
        <>
          {/* Mobile view: Group by month */}
          <div className="sm:hidden space-y-8 mt-8">
            {groupWritingsByMonth(posts).map(group => (
              <div key={group.monthYear} className="opacity-0 animate-fade-in">
                <h3 className="text-sm font-medium text-muted-foreground border-b pb-2 mb-4">
                  {group.monthYear}
                </h3>
                <div className="space-y-5">
                  {group.writings.map(post => (
                    <article key={post.slug} className="pb-4">
                      <Link href={`/garden/writings/${post.slug}`} prefetch>
                        <h2 className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 mb-1">
                          {post.title}
                        </h2>
                        <div className="flex gap-2 items-center text-[10px] text-muted-foreground mb-1">
                          <span>{formatDate(post.createdAt)}</span>
                          <span>•</span>
                          <span>{calculateReadingTime(post.content)} min read</span>
                        </div>
                        {post.excerpt && (
                          <p className="text-xs text-muted-foreground">
                            {post.excerpt.split(" ").length > 15
                              ? post.excerpt.split(" ").slice(0, 15).join(" ") + "…"
                              : post.excerpt}
                          </p>
                        )}
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop view: Original layout */}
          <div className="hidden sm:block space-y-8 stagger-children mt-12">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="group opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link
                  href={`/garden/writings/${post.slug}`}
                  className="block transition-transform duration-300 hover:translate-x-1"
                  prefetch
                >
                  <article className=" rounded-md transition-all duration-200 group">
                      {/* First line: Title, line, date */}
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-sm font-medium whitespace-nowrap group-hover:text-primary transition-colors duration-200">
                          {post.title}
                        </h2>
                        <div className="w-full border-t-2 border-dashed border-muted-foreground opacity-50 mx-2 group-hover:border-primary" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap group-hover:text-primary ">
                          {post.createdAt ? formatDate(post.createdAt) : "No date"}
                        </span>
                      </div>
                      {/* Second line: Reading time */}
                      <div className="flex gap-2 items-center mb-1">
                        <span className="text-xs text-muted-foreground italic group-hover:text-primary">
                          {`${countWords(post.content)} words`}
                        </span>
                        -
                        <span className="text-xs text-muted-foreground italic group-hover:text-primary">
                          {`${calculateReadingTime(post.content)} min read`}
                        </span>
                      </div>
                      {/* Third line: Excerpt */}
                      <p className="text-sm text-muted-foreground group-hover:text-primary">
                        {post.excerpt
                          ? post.excerpt.split(" ").length > 10
                            ? post.excerpt.split(" ").slice(0, 10).join(" ") + "…"
                            : post.excerpt
                          : "No excerpt available"}
                      </p>
                  </article>
                </Link>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 border rounded-lg p-8 grid place-items-center">
          <Annoyed size={16} />
          <h2 className="mt-2 text-base font-medium mb-2">No Writings Found</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            There are no writings available yet.
          </p>
        </div>
      )}
    </div>
  )
}
