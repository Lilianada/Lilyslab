import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { getPublishedArticles } from "@/lib/notion"
import { Annoyed } from "lucide-react"

export const revalidate = 3600 // Revalidate every hour

export default async function WritingPage() {
  let posts = []
  let error = null

  try {
    console.log("Fetching published articles")
    posts = await getPublishedArticles()
    console.log(`Fetched ${posts.length} posts`)
  } catch (err) {
    console.error("Error in WritingPage:", err)
    error = err.message || "An error occurred while fetching articles"
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">Writing</h1>
        <p className="text-xs text-muted-foreground">Thoughts on design, engineering, and building products.</p>
      </header>

      {error ? (
        <div className="text-center py-8 border rounded-lg p-8">
          <h2 className="text-base font-medium mb-2">Error Loading Articles</h2>
          <p className="text-muted-foreground mb-4 text-sm">{error}</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6 stagger-children">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link
                href={`/writing/${post.slug}`}
                className="block transition-transform duration-300 hover:translate-x-1"
              >
                <div className="space-y-1 border-b border-border pb-4 hover:border-primary transition-colors duration-300">
                  <time className="text-[10px] text-muted-foreground">
                    {post.date ? formatDate(post.date) : "No date"}
                  </time>
                  <h2 className="text-sm font-medium group-hover:text-primary group-hover:underline transition-colors duration-200">
                    {post.title || "Untitled"}
                  </h2>
                  <p className="text-xs text-muted-foreground">{post.excerpt || "No excerpt available"}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg p-8 grid place-items-center">
          <Annoyed size={16} />
          <h2 className="mt-2 text-base font-medium mb-2">No Articles Found</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            There are no published articles in your Notion database yet.
          </p>
        </div>
      )}
    </div>
  )
}
