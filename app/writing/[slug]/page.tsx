import { notFound } from "next/navigation"
import { getWritingBySlug } from "@/lib/writings/writings"
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

type PageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const writing = await getWritingBySlug(params.slug)

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
  const { slug } = params;

  const writingsDir = path.join(process.cwd(), 'Content/writings');
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

  return (
    <div className="max-w-3xl mx-auto animate-fade-in px-4 md:px-0">
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
           <article className="prose dark:prose-invert mt-6">
    
             <ReactMarkdown
               remarkPlugins={[remarkGfm]}
               rehypePlugins={[rehypeHighlight]}
             >
               {content}
             </ReactMarkdown>
    
           </article>
       </div>
       </div>
  )
}
