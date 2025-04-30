import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import ArticleInteractions from "@/components/article-interactions"





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

import type { ExtendedRecordMap } from 'notion-types';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let article: any = null;
  let recordMap: ExtendedRecordMap | null = null;
  let error: Error | null = null;

  try {
    // Fetch article metadata
    article = await getArticleBySlug(slug);
    // DEBUG: Log fetched article
    console.log("[BlogPost] Fetched article:", article);
    if (!article) {
      notFound();
    }

    // DEBUG: Log Notion page ID
    // Notion logic removed
    // Notion logic removed
    recordMap = await getNotionPageContent(article.id);
    // DEBUG: Log recordMap block keys
    console.log("[BlogPost] recordMap keys:", Object.keys(recordMap?.block || {}));

    // Validate recordMap structure
    if (!recordMap || typeof recordMap !== 'object' || !recordMap.block || typeof recordMap.block !== 'object') {
      throw new Error('Invalid recordMap structure returned from Notion API');
    }
  } catch (err: any) {
    console.error(`Error rendering article ${slug}:`, err);
    error = err instanceof Error ? err : new Error('Unknown error occurred');
  }

  const hasContent = recordMap && Object.keys(recordMap.block || {}).length > 0;

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-10">
        <h1 className="text-xl font-medium mb-4">This section is still under construction.</h1>
        <p className="text-muted-foreground mb-6">This section is still under construction.</p>
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
    );
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
                {article.tags.map((tag: string) => (
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
              <p>This section is still under construction.</p>
              <p className="text-xs text-muted-foreground mt-2">
                This could be due to permission issues or the page might not be publicly accessible.
              </p>
              <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
                <p className="font-mono">Article ID: {article.id}</p>
                <p className="font-mono">Normalized ID: {normalizeNotionId(article.id)}</p>
                <p className="font-mono mt-2">Debug info: Check server logs for more details</p>
              </div>
            </div>
          )}
        </div>

        <ArticleInteractions slug={slug} initialLikes={article.likes || 0} />
      </article>
    </div>
  );
}
