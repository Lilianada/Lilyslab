"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Tag, FileText, BookOpen } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MarkdownRenderer, MarkdownSkeleton } from "@/components/markdown";
import { formatDate } from "@/lib/utils";

interface ArchiveItemData {
  frontmatter: {
    title?: string;
    createdAt?: string;
    tags?: string[];
    [key: string]: any;
  };
  content: string;
  category: "writings" | "notes";
}

export default function ArchiveItemPage() {
  const params = useParams();
  const router = useRouter();
  const { category, slug } = params as { category: string; slug: string };
  
  const [itemData, setItemData] = useState<ArchiveItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !category) return;
    
    async function loadItemContent() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/archives/${category}/${slug}`);
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to load archive item data" }));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const data: ArchiveItemData = await response.json();
        setItemData(data);
      } catch (err) {
        console.error(`Failed to load archive item content for ${slug}:`, err);
        const message =
          err instanceof Error ? err.message : "Failed to load archive item data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadItemContent();
  }, [category, slug]);

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
  
  const getCategoryIcon = () => {
    return category === "writings" ? (
      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    ) : (
      <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
    );
  };

  return (
    <>
      <ScrollProgress color="bg-primary" height={3} glow={true} />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/garden/archives")}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return
        </button>

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-1 bg-muted rounded w-full my-6"></div>
            <MarkdownSkeleton />
          </div>
        ) : error ? (
          renderError()
        ) : itemData ? (
          <>
            <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
              <h1 className="text-xl font-medium mb-3">{itemData.frontmatter.title || "Untitled"}</h1>
              <div className="flex flex-col text-xs text-muted-foreground ">
                {itemData.frontmatter.createdAt && (
                  <span>Created: {formatDate(itemData.frontmatter.createdAt)}</span>
                )}
                <span className="capitalize">Category: {category}</span>
                {itemData.frontmatter.tags && itemData.frontmatter.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      Tags:
                      {itemData.frontmatter.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className=""
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                )}
              </div>
            </header>

            <div className="max-w-none">
              <MarkdownRenderer
                content={itemData.content}
                className="prose prose-sm dark:prose-invert max-w-none"
                allowHtml={false}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No content available.
          </div>
        )}
        
        <Footer />
      </div>
    </>
  );
}
