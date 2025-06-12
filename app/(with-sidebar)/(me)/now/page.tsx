"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MarkdownRenderer, MarkdownSkeleton } from "@/components/markdown";

interface NowData {
  frontmatter: {
    lastUpdated?: string;
    createdAt?: string;
    [key: string]: any;
  };
  content: string;
}

export default function NowPage() {
  const [nowData, setNowData] = useState<NowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    setIsClientLoaded(true);

    async function loadNowContent() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/now");
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to load Now page data" }));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const data: NowData = await response.json();
        setNowData(data);
      } catch (err) {
        console.error("Failed to load Now content:", err);
        const message =
          err instanceof Error ? err.message : "Failed to load Now page data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadNowContent();
  }, []);

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
      <ScrollProgress
        color="bg-extra-lavender"
        height={3}
        glow={true}
        glowColor="rgba(var(--extra-lavender), 0.6)"
        glowIntensity="12px"
      />
      <div
        className={`max-w-2xl w-full mx-auto sm:px-6 py-12 ${
          isClientLoaded ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <header className="mb-8">
          <h1 className="mb-2 text-xl font-medium">Now</h1>
          {nowData?.frontmatter?.lastUpdated && (
            <div className="flex flex-col text-xs text-muted-foreground font-mono">
              <div> Created: {formatDate(nowData.frontmatter.createdAt)}</div>
              <div>
                {" "}
                Last updated: {formatDate(nowData.frontmatter.lastUpdated)}
              </div>
              <div>
                {" "}
                Inspired by:{" "}
                <a
                  href="https://nownownow.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-extra-lavender hover:underline"
                >
                  nownownow.com
                </a>
              </div>
            </div>
          )}
        </header>

        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : nowData ? (
          <>
            <div className="max-w-none text-justify">
              <MarkdownRenderer
                content={nowData.content}
                className="[&_p]:my-0 [&_p]:mb-2 [&_p]:text-[14px] [&_p]:leading-normal [&_li]:text-[14px] [&_li]:leading-normal [&_h4]:text-[16px] [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:mb-2 [&_h4]:text-foreground [&_a]:text-extra-lavender [&_a]:hover:underline"
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
