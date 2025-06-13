"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MarkdownRenderer, MarkdownSkeleton } from "@/components/markdown";
import { ArrowLeft } from "lucide-react";

interface ThenEntryData {
  frontmatter: {
    title?: string;
    createdAt?: string;
    inspiredBy?: string;
    [key: string]: any;
  };
  content: string;
}

export default function ThenEntryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [entryData, setEntryData] = useState<ThenEntryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    async function loadEntryContent() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/then/${slug}`);
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to load entry data" }));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const data: ThenEntryData = await response.json();
        setEntryData(data);
      } catch (err) {
        console.error(`Failed to load entry content for ${slug}:`, err);
        const message =
          err instanceof Error ? err.message : "Failed to load entry data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadEntryContent();
  }, [slug]);

  const renderLoading = () => (
    <div className="w-full">
      <MarkdownSkeleton />
    </div>
  );

  const renderError = () => (
    <div className="text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4">
      {error}
    </div>
  );

  return (
    <>
      <ScrollProgress color="bg-primary" height={3} glow={true} />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <button 
          onClick={() => router.push('/then')}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all entries
        </button>
        
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-7 bg-muted-foreground/20 rounded w-2/3"></div>
              <div className="h-5 bg-muted-foreground/20 rounded w-1/3"></div>
            </div>
          ) : entryData ? (
            <>
              <h1 className="text-xl font-medium mb-2">{entryData.frontmatter.title || "Untitled Entry"}</h1>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Created: {entryData.frontmatter.createdAt ? formatDate(entryData.frontmatter.createdAt) : "Unknown date"}</div>
                {entryData.frontmatter.inspiredBy && (
                  <div>Inspired by: {entryData.frontmatter.inspiredBy}</div>
                )}
              </div>
            </>
          ) : null}
        </header>

        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : entryData ? (
          <>
            <div className="max-w-none">
              <MarkdownRenderer
                content={entryData.content}
                className="[&_p]:my-0 [&_p]:mb-2 [&_p]:text-[14px] [&_p]:leading-normal [&_li]:text-[14px] [&_li]:leading-normal [&_h4]:text-[16px] [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:mb-2 [&_h4]:text-foreground [&_a]:text-primary [&_a]:hover:underline"
                allowHtml={true}
              />
            </div>
            <Footer />
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No content available.
          </div>
        )}
      </div>
    </>
  );
}
