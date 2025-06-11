'use client';

import { useState, useEffect } from 'react';
import MarkdownRenderer from '@/components/markdown';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { Footer } from '@/components/layout/footer';
import { Loader2 } from 'lucide-react';

interface WritingClientProps {
  slug: string;
}

export function WritingClient({ slug }: WritingClientProps) {
  const [content, setContent] = useState("# Loading...");
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({ 
    title: "Loading...", 
    date: new Date().toISOString() 
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch the writing data from an API route
    async function fetchWritingData() {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/articles/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch writing data');
        }
        const data = await response.json();
        setContent(data.content || "# No content found");
        setFrontmatter(data.frontmatter || { title: slug, date: new Date().toISOString() });
      } catch (error) {
        console.error("Error fetching writing:", error);
        setContent("# Error\n\nFailed to load this writing. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWritingData();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <ScrollProgress 
        color="bg-primary" 
        height={3} 
        glow={true} 
        glowColor="rgba(var(--primary), 0.6)" 
        glowIntensity="12px" 
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Loading article...</p>
        </div>
      ) : (
        <>
          <article className="prose prose-lg dark:prose-invert max-w-full">
            <h1 className="font-bold text-3xl md:text-4xl mb-2">{frontmatter.title}</h1>
            {frontmatter.date && (
              <time className="text-sm text-muted-foreground">
                {formatDate(frontmatter.date)}
              </time>
            )}
            
            <div className="mt-8">
              <MarkdownRenderer content={content} />
            </div>
          </article>
          
          <div className="mt-20">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
