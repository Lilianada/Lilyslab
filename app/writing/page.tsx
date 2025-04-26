import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Annoyed } from "lucide-react"
import { getAllWritings, Writing } from "@/lib/writings/writings"

export const revalidate = 3600 // Revalidate every hour

export default async function WritingPage() {
  let posts: Writing [] = []
  let error: string | null = null

  try {
    console.log("Fetching writings...")
    posts = await getAllWritings()
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
    <div className="max-w-xl mx-auto animate-fade-in px-6 py-12">
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">Writing</h1>
        <p className="text-sm text-muted-foreground">Thoughts on design, engineering, and building products.</p>
      </header>

      {error ? (
        <div className="text-center py-8 border rounded-lg p-8">
          <h2 className="text-base font-medium mb-2">This section is still under construction.</h2>
          <p className="text-muted-foreground mb-4 text-sm">{error}</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6 stagger-children">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className="group opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link
                href={`/writing/${post.slug}`}
                className="block transition-transform duration-300 hover:translate-x-1"
                prefetch
              >
                <div className="space-y-1 border-b border-border pb-4 hover:border-primary transition-colors duration-300">
                  <time className="text-xs text-muted-foreground">
                    {post.date ? formatDate(post.date) : "No date"}
                  </time>
                  <h2 className="text-base font-medium group-hover:text-primary group-hover:underline transition-colors duration-200">
                    {post.title || "Untitled"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{post.excerpt || "No excerpt available"}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
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
