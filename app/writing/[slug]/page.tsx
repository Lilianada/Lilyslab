import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/notion"
import ArticleInteractions from "@/components/article-interactions"
import { NotionAPI } from "notion-client"
import ClientNotionRenderer from "./client-notion-renderer"

// Initialize the unofficial Notion client
const notionApi = new NotionAPI()

export const revalidate = 3600 // Revalidate every hour

// Generate static paths for all articles
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs()
    console.log('slug', slugs)
    return slugs.map((slug) => ({ slug }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Asynchronously access the slug
  const { slug } = (await params) as { slug: string };
  console.log('render slug', slug)

  if (!slug) {
    notFound()
  }

  try {
    console.log("Fetching article with slug:", slug)
    const article = await getArticleBySlug(slug)


    if (!article) {
      console.log("Article not found for slug:", slug)
      notFound()
    }

    console.log("Fetching blocks for article ID:", article.id)

    const formattedPageId = article.id.replace(/-/g, "")
    console.log('formatted page:', formattedPageId)
    const recordMap = await notionApi.getPage(formattedPageId)
    console.log('record map', recordMap)
    const hasContent = recordMap && Object.keys(recordMap.block || {}).length > 0
    console.log('hasContent', hasContent, 'record map', recordMap)

    if (!hasContent) {
      console.error("Failed to fetch content blocks for article:", article.id)
    } else {
      console.log(`Successfully fetched blocks for article`)
    }

    return (
      <div className="max-w-3xl mx-auto animate-fade-in px-4 md:px-0">
        <div className="mb-8 flex items-center">
          <Link
            href="/writing"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to all posts</span>
          </Link>
        </div>

        <article>
          <header className="mb-8">
            {article.coverImage && (
              <div className="mb-6 rounded-lg overflow-hidden w-full">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title || "Article cover"}
                  width={1200}
                  height={630}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            )}

            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <time className="text-xs">{article.date ? formatDate(article.date) : "No date"}</time>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
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
                <p>Failed to load article content.</p>
                <p className="text-xs text-muted-foreground mt-2">
                  This could be due to permission issues or the page might not be publicly accessible.
                </p>
                <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
                  <p className="font-mono">Article ID: {article.id}</p>
                  <p className="font-mono mt-2">Debug info: Check server logs for more details</p>
                </div>
              </div>
            )}
          </div>

          <ArticleInteractions slug={slug} initialLikes={article.likes || 0} />
        </article>
      </div>
    )
  } catch (error) {
    console.error(`Error rendering article ${slug}:`, error)
    return (
      <div className="max-w-xl mx-auto text-center py-10">
        <h1 className="text-xl font-medium mb-4">Error Loading Article</h1>
        <p className="text-muted-foreground mb-6">There was a problem loading this article.</p>
        <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
          <p className="font-mono">Error: {error.message}</p>
          {error.stack && <p className="font-mono mt-2">{error.stack.split("\n")[0]}</p>}
        </div>
        <div className="mt-6">
          <Link href="/writing" className="text-primary hover:underline">
            Return to all articles
          </Link>
        </div>
      </div>
    )
  }
}
