import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Home } from "lucide-react"
import { notFound } from "next/navigation"
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/notion"
import ArticleInteractions from "@/components/article-interactions"
import { NotionAPI } from "notion-client"
import ClientNotionRenderer from "./client-notion-renderer"

// Import the client-side renderer
// We'll create this file next
// import ClientNotionRenderer from "@/writing/client-notion-renderer"

// Initialize the unofficial Notion client
const notionApi = new NotionAPI()

export const revalidate = 3600 // Revalidate every hour

// Generate static paths for all articles
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function QuickNotePage({ params }: { params: { slug: string } }) {
  // Asynchronously access the slug
  const { slug } = (await params) as { slug: string };

  if (!slug) {
    notFound()
  }

  try {
    console.log("Fetching quick note with slug:", slug)
    const note = await getArticleBySlug(slug)

    if (!note) {
      console.log("Quick note not found for slug:", slug)
      notFound()
    }

    console.log("Fetching blocks for note ID:", note.id)

    const formattedPageId = note.id.replace(/-/g, "")

    const recordMap = await notionApi.getPage(formattedPageId)

    const hasContent = recordMap && Object.keys(recordMap.block || {}).length > 0

    if (!hasContent) {
      console.error("Failed to fetch content blocks for note:", note.id)
    } else {
      console.log(`Successfully fetched blocks for note`)
    }

    return (
      <div className="max-w-3xl mx-auto animate-fade-in px-4 md:px-0">

        <div className="mb-8 flex items-center">
          <Link
            href="/playground/digital-garden/quick-notes"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to all notes</span>
          </Link>
        </div>

        <article>
          <header className="mb-8">
            {note.coverImage && (
              <div className="mb-6 rounded-lg overflow-hidden w-full">
                <Image
                  src={note.coverImage || "/placeholder.svg"}
                  alt={note.title || "Note cover"}
                  width={1200}
                  height={630}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            )}

            <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <time className="text-xs">{note.date ? formatDate(note.date) : "No date"}</time>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-[10px] bg-muted/50 border border-border rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className="notion-content prose dark:prose-invert max-w-none">
            {hasContent ? (
              <ClientNotionRenderer recordMap={recordMap} />
            ) : (
              <div className="notion-empty p-4 border rounded-md bg-muted/20">
                <p>Failed to load note content.</p>
                <p className="text-xs text-muted-foreground mt-2">
                  This could be due to permission issues or the page might not be publicly accessible.
                </p>
                <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
                  <p className="font-mono">Note ID: {note.id}</p>
                  <p className="font-mono mt-2">Debug info: Check server logs for more details</p>
                </div>
              </div>
            )}
          </div>

          <ArticleInteractions slug={slug} initialLikes={note.likes || 0} />
        </article>
      </div>
    )
  } catch (error: any) {
    console.error(`Error rendering note ${slug}:`, error)
    return (
      <div className="max-w-xl mx-auto text-center py-10">
        <h1 className="text-xl font-medium mb-4">Error Loading Note</h1>
        <p className="text-muted-foreground mb-6">There was a problem loading this note.</p>
        <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
          <p className="font-mono">Error: {error.message}</p>
          {error.stack && <p className="font-mono mt-2">{error.stack.split("\n")[0]}</p>}
        </div>
        <div className="mt-6">
          <Link href="/playground/digital-garden/quick-notes" className="text-primary hover:underline">
            Return to all notes
          </Link>
        </div>
      </div>
    )
  }
}
