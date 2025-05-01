import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from "react-markdown";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from "next/link"
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ArrowLeft } from "lucide-react"
import { WritingRouteParams, SlugParams } from "@/lib/types/route-params"
import { WritingClientWrapper } from "./writing-client-wrapper"
import { ArticleStructuredData } from "@/components/structured-data"
import { ScrollProgress } from "@/components/ui/scroll-progress"

// Get writing content by slug
async function getWritingContent(slug: string) {
  try {
    const writingsDir = path.join(process.cwd(), 'Content/writings');
    const filePath = path.join(writingsDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    
    // Check if the post is published
    if (data.published !== true) {
      console.log(`Writing with slug '${slug}' found but not published.`);
      return null;
    }
    
    return {
      content,
      title: data.title || slug,
      date: data.date ? formatDate(data.date) : null,
      coverImage: data.coverImage || null,
      tags: data.tags || [],
      excerpt: data.excerpt || null
    };
  } catch (error) {
    console.error(`Error getting writing content for ${slug}:`, error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: WritingRouteParams) {
  const writing = await getWritingContent(params.slug);
  
  if (!writing) {
    return {
      title: "Writing Not Found"
    };
  }
  
  return {
    title: writing.title,
    description: writing.excerpt
  };
}

// Generate static paths for all markdown files in the writings directory
export function generateStaticParams(): SlugParams[] {
  try {
    const writingsDir = path.join(process.cwd(), 'Content/writings');
    const files = fs.readdirSync(writingsDir);
    
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        slug: file.replace(/\.md$/, '')
      }));
  } catch (error) {
    console.error('Error generating static params for writings:', error);
    return [];
  }
}

// Writing page component
export default async function WritingSlugPage({ params }: WritingRouteParams) {
  const writing = await getWritingContent(params.slug);
  
  if (!writing) {
    notFound();
  }
  
  // Format the date for structured data (ISO format)
  const isoDate = writing.date ? new Date(writing.date).toISOString() : new Date().toISOString();
  
  return (
    <WritingClientWrapper>
      <ScrollProgress 
        color="bg-extra-green" 
        height={3} 
        glow={true} 
        glowColor="rgba(var(--extra-green), 0.6)" 
        glowIntensity="12px" 
      />
      <ArticleStructuredData
        title={writing.title}
        description={writing.excerpt || `Read ${writing.title} on Lily's Lab`}
        slug={params.slug}
        date={isoDate}
        image={writing.coverImage || "/logo.png"}
      />
      <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        <div className="mb-8">
          <Link href="/writing" className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm mb-6">
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back to Writings
          </Link>
          <header className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-foreground">{writing.title}</h1>
            <div className="flex flex-col gap-2">
              {writing.date && <p className="text-xs text-muted-foreground">Published: {writing.date}</p>}
              
              {writing.tags && writing.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {writing.tags.map((tag: string) => (
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
          <article className="prose dark:prose-invert mt-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {writing.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </WritingClientWrapper>
  );
}
