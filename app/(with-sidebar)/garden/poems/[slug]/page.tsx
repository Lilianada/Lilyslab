import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Calendar, Clock, Tag as TagIcon, Sparkles } from "lucide-react"
import { getPoemBySlug } from "@/lib/garden/poems"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import Script from 'next/script'

interface PoemPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PoemPageProps): Promise<Metadata> {
  const poem = getPoemBySlug(params.slug)
  
  if (!poem) {
    return {
      title: "Poem Not Found",
      description: "This poem could not be found"
    }
  }

  return {
    title: poem.title,
    description: poem.content.substring(0, 160),
    openGraph: {
      title: poem.title,
      description: poem.content.substring(0, 160),
      type: "article",
      authors: ["Lilian Okeke"],
      publishedTime: poem.createdAt,
      modifiedTime: poem.lastUpdated
    },
  }
}

export default function PoemPage({ params }: PoemPageProps) {
  const poem = getPoemBySlug(params.slug)
  
  if (!poem) {
    notFound()
  }
  
  // Format dates for display
  const createdDate = new Date(poem.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const lastUpdatedDate = new Date(poem.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
  
  return (
    <>
      <Script
        id="poem-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": poem.title,
            "datePublished": poem.createdAt,
            "dateModified": poem.lastUpdated,
            "author": {
              "@type": "Person",
              "name": "Lilian Okeke"
            },
            "keywords": poem.tags?.join(", ")
          })
        }}
      />
      
      <style jsx global>{`
        @font-face {
          font-family: 'Heart';
          src: url('/fonts/rainyhearts.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        .font-heart {
          font-family: 'Heart', cursive;
        }
        
        .poem-content {
          line-height: 1.8;
          white-space: pre-wrap;
        }
        
        .poem-content h1, 
        .poem-content h2,
        .poem-content h3,
        .poem-content h4 {
          font-family: 'Heart', cursive;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .poem-content strong {
          color: var(--accent);
          font-weight: 600;
        }
        
        .poem-content em {
          font-style: italic;
          color: var(--muted);
        }
        
        .poem-content blockquote {
          border-left: 2px solid var(--accent);
          padding-left: 1em;
          font-style: italic;
          margin: 1.5em 0;
        }
      `}</style>
      
      <div className="min-h-screen animate-fade-in">
        <article className="container max-w-2xl mx-auto p-0 sm:px-4 pt-16 pb-8">
          <div className="mb-8">
            <Link
              href="/garden/poems"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mb-6"
            >
              <ChevronLeft className="mr-1 h-3 w-3" />
              Back to poems
            </Link>
            
            <div className="relative">
              <Sparkles className="text-primary absolute -left-6 top-1" size={16} />
              <h1 className="text-3xl mb-3 font-heart">{poem.title}</h1>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4 font-mono">
              <div className="flex items-center">
                <Calendar className="mr-1.5" size={12} />
                <span>{createdDate}</span>
              </div>
              
              {poem.lastUpdated !== poem.createdAt && (
                <div className="flex items-center">
                  <Clock className="mr-1.5" size={12} />
                  <span>Updated: {lastUpdatedDate}</span>
                </div>
              )}
            </div>
            
            {poem.tags && poem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {poem.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs py-0">
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="prose prose-sm sm:prose max-w-none poem-content">
            {poem.content
              .split('\n')
              .map((line, i) => {
                // Process markdown but keep line breaks for poetic formatting
                if (line.trim() === '') {
                  return <br key={i} />;
                }
                return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
              })}
          </div>
          
          <div className="border-t border-border/50 pt-8 mt-12">
            <p className="text-sm text-muted-foreground italic text-center">
              "Poetry is the spontaneous overflow of powerful feelings: it takes its origin from emotion recollected in tranquility."
              <br />— William Wordsworth
            </p>
          </div>
          
          <Footer />
        </article>
      </div>
    </>
  )
}
