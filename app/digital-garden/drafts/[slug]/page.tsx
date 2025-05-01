import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from "react-markdown"
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from "next/link"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ArrowLeft } from "lucide-react"
import { DraftRouteParams, SlugParams } from "@/lib/types/route-params"

/**
 * Get draft content by slug
 * 
 * @param slug The draft slug to retrieve
 * @returns The draft content or null if not found
 */
async function getDraftContent(slug: string) {
  try {
    const draftsDir = path.join(process.cwd(), 'Content/drafts')
    const filePath = path.join(draftsDir, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    
    return {
      content,
      title: data.title || slug,
      date: data.date ? formatDate(data.date) : null,
      tags: data.tags || [],
      excerpt: data.excerpt || null
    }
  } catch (error) {
    console.error(`Error getting draft content for ${slug}:`, error)
    return null
  }
}

/**
 * Generate metadata for the draft page
 */
export async function generateMetadata({ params }: DraftRouteParams) {
  const draft = await getDraftContent(params.slug)
  
  if (!draft) {
    return {
      title: "Draft Not Found"
    }
  }
  
  return {
    title: draft.title,
    description: draft.excerpt
  }
}

/**
 * Generate static paths for all markdown files in the drafts directory
 * This follows Next.js's convention for static site generation with dynamic routes
 */
export function generateStaticParams(): SlugParams[] {
  try {
    const draftsDir = path.join(process.cwd(), 'Content/drafts')
    const files = fs.readdirSync(draftsDir)
    
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        slug: file.replace(/\.md$/, '')
      }))
  } catch (error) {
    console.error('Error generating static params for drafts:', error)
    return []
  }
}

/**
 * Draft page component
 */
export default async function DraftPage({ params }: DraftRouteParams) {
  const draft = await getDraftContent(params.slug)
  
  if (!draft) {
    notFound()
  }
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-8">
        <Link 
          href="/digital-garden/drafts" 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-3 h-3 mr-2" />
          Back to Drafts
        </Link>
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground">{draft.title}</h1>
          <div className="flex flex-col gap-2">
            {draft.date && <p className="text-xs text-muted-foreground">Last updated: {draft.date}</p>}
            
            {draft.tags && draft.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {draft.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <Separator />
        <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-justify [&_img]:rounded-lg [&_blockquote]:border-l [&_blockquote]:border-muted/50 [&_blockquote]:pl-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {draft.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
