import { notFound } from "next/navigation"
import { getWritingBySlug, getAllWritings } from "@/lib/writings/writings"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from "react-markdown";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from "next/image"
import Link from "next/link"
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/ui/scroll-progress"

type PageProps = {
  params: Promise<{
    slug: string
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const writing = await getWritingBySlug(resolvedParams.slug)

  if (!writing) {
    return {
      title: "Writing Not Found",
    }
  }

  return {
    title: writing.title,
    description: writing.excerpt,
  }
}

export default async function WritingSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const writingsDir = path.join(process.cwd(), 'Content/Writings');
  const filePath = path.join(writingsDir, `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Read the markdown file
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  // Check if the post is published
  if (data.published !== true) {
    console.log(`Writing with slug '${slug}' found but not published.`); // Optional logging
    notFound(); // Return 404 if not explicitly published
  }
  
  // Get all writings for prev/next navigation
  const allWritings = getAllWritings();
  
  // Find the current post index
  const currentIndex = allWritings.findIndex(writing => writing.slug === slug);
  
  // Get previous and next posts
  const prevPost = currentIndex < allWritings.length - 1 ? allWritings[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allWritings[currentIndex - 1] : null;

  return (
    <>
    <ScrollProgress 
            color="bg-extra-steelBlue" 
            height={3} 
            glow={true}
            glowColor="rgba(var(--extra-steelBlue), 0.6)"
            glowIntensity="12px"
          />
    <div className="max-w-2xl w-full mx-auto animate-fade-in">
      <div className="my-6 flex items-center sm:my-12">
        <Link
          href="/writing"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to all posts</span>
        </Link>
      </div>

      <div>
        <header className="mb-8">
          {data.coverImage && (
            <div className="mb-6 rounded-lg overflow-hidden w-full">
              <Image
                src={data.coverImage || "/placeholder.svg"}
                alt={data.title || "Article cover"}
                width={1200}
                height={630}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <time className="text-xs">{data.date ? formatDate(data.date) : "No date"}</time>


            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 text-[10px] bg-muted/50 border border-border rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <Separator />
        <article className="mt-8 prose prose-sm sm:prose-base dark:prose-invert max-w-none text-justify [&_p]:text-[14px] [&_p]:leading-normal [&_li]:text-[14px] [&_li]:leading-normal [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mb-4 [&_h2]:text-foreground [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mb-4 [&_h3]:text-foreground [&_h4]:text-[16px] [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:mb-3 [&_h4]:text-foreground [&_a]:text-extra-steelBlue">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>

        </article>
      </div>

      <Footer 
        prevPost={prevPost ? { title: prevPost.title, slug: prevPost.slug } : undefined}
        nextPost={nextPost ? { title: nextPost.title, slug: nextPost.slug } : undefined}
        contentType="writing"
      />
    </div>
    </>
  )
}