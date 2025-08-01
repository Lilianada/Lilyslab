"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Helper functions for backlink handling
const normalizeText = (text: string): string => {
  return (text || "").toLowerCase().trim();
};

const slugify = (text: string): string => {
  return normalizeText(text)
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Global cache mechanism to avoid repeated API calls
let notesCache: any[] | null = null;
let writingsCache: any[] | null = null;

export const MarkdownSkeleton = () => (
  <div className="animate-pulse space-y-4 mt-4">
    <div className="h-4 bg-muted rounded w-full"></div>
    <div className="h-4 bg-muted rounded w-full"></div>
    <div className="h-4 bg-muted rounded w-full"></div>
    <div className="h-4 bg-muted rounded w-5/6"></div>
    <div className="h-4 bg-muted rounded w-5/6"></div>
    <div className="h-4 bg-muted rounded w-4/6"></div>
  </div>
);

// Define the interfaces for custom components and markdown content
interface CustomComponents {
  [key: string]: React.ComponentType<any>;
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  customComponents?: CustomComponents;
  allowHtml?: boolean; // Whether to allow HTML in markdown
}

// Define the MarkdownRenderer component
const MarkdownRenderer = ({
  content,
  className,
  customComponents = {},
  allowHtml = true,
}: MarkdownRendererProps) => {
  const router = useRouter();

  // Create the components object that relies on the CSS classes defined in markdown.css
  const components = {
    h1: ({ node, className, ...props }: any) => (
      <h1 className={cn(className)} {...props} />
    ),
    h2: ({ node, className, ...props }: any) => (
      <h2 className={cn(className)} {...props} />
    ),
    h3: ({ node, className, ...props }: any) => (
      <h3 className={cn(className)} {...props} />
    ),
    h4: ({ node, className, ...props }: any) => (
      <h4 className={cn(className)} {...props} />
    ),
    p: ({ node, className, ...props }: any) => (
      <p className={cn(className)} {...props} />
    ),
    a: ({ node, className, ...props }: any) => (
      <a
        className={cn(className)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    ul: ({ node, className, ...props }: any) => (
      <ul className={cn(className)} {...props} />
    ),
    ol: ({ node, className, ...props }: any) => (
      <ol className={cn(className)} {...props} />
    ),
    li: ({ node, className, ...props }: any) => (
      <li className={cn(className)} {...props} />
    ),
    blockquote: ({ node, className, ...props }: any) => (
      <blockquote className={cn(className)} {...props} />
    ),
    hr: ({ node, className, ...props }: any) => (
      <hr className={cn(className)} {...props} />
    ),
    img: ({ node, className, alt, ...props }: any) => (
      <img
        className={cn(className)}
        alt={alt || ""}
        loading="lazy"
        {...props}
      />
    ),
    code: ({ node, className, inline, ...props }: any) => (
      <code className={cn(className)} {...props} />
    ),
    pre: ({ node, className, ...props }: any) => (
      <pre className={cn(className)} {...props} />
    ),
    table: ({ node, className, ...props }: any) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn(className)} {...props} />
      </div>
    ),
    thead: ({ node, className, ...props }: any) => (
      <thead className={cn(className)} {...props} />
    ),
    tbody: ({ node, className, ...props }: any) => (
      <tbody className={cn(className)} {...props} />
    ),
    tr: ({ node, className, ...props }: any) => (
      <tr className={cn(className)} {...props} />
    ),
    th: ({ node, className, ...props }: any) => (
      <th className={cn(className)} {...props} />
    ),
    td: ({ node, className, ...props }: any) => (
      <td className={cn(className)} {...props} />
    ),
    ...customComponents,
  };

  // Prepare rehype plugins
  const rehypePlugins = [
    rehypeHighlight as any, // Type assertion to avoid TS issues
  ];

  if (allowHtml) {
    rehypePlugins.unshift(rehypeRaw as any);
  }

  // Function to safely fetch content with error handling
  const fetchContent = async () => {
    // Use cache if available to avoid repeated API calls
    if (notesCache !== null && writingsCache !== null) {
      return { notes: notesCache, writings: writingsCache };
    }

    try {
      // Fetch both resources in parallel with safe error handling
      const [notesRes, writingsRes] = await Promise.allSettled([
        fetch("/api/notes", {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/essays", {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      // Process response for notes
      let notes = [];
      if (notesRes.status === "fulfilled" && notesRes.value.ok) {
        try {
          notes = await notesRes.value.json();
        } catch {}
      }

      // Process response for writings
      let writings = [];
      if (writingsRes.status === "fulfilled" && writingsRes.value.ok) {
        try {
          writings = await writingsRes.value.json();
        } catch {}
      }

      // Update cache
      notesCache = notes;
      writingsCache = writings;

      return { notes, writings };
    } catch (error) {
      // Return empty arrays on error
      return { notes: [], writings: [] };
    }
  };

  // Helper function to find the best content match
  const findBestMatch = (linkText: string, items: any[]): any | null => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;

    const normalized = normalizeText(linkText);
    const slugified = slugify(linkText);

    // Try multiple matching strategies in decreasing order of strictness
    return (
      items.find((item) => item.title === linkText) || // Exact title match
      items.find((item) => normalizeText(item.title) === normalized) || // Case-insensitive title
      items.find((item) => item.slug === slugified) || // Exact slug match
      items.find((item) => item.slug === normalized) || // Normalized as slug
      items.find((item) => normalizeText(item.slug) === normalized) || // Case-insensitive slug
      items.find((item) => slugify(item.title) === slugified) || // Slugified title match
      items.find((item) => normalizeText(item.title).includes(normalized)) || // Title contains link
      items.find((item) => normalized.includes(normalizeText(item.title))) || // Link contains title
      null
    );
  };

  // Handle backlink navigation with full error protection
  const handleBacklinkClick = (linkText: string) => {
    // Use a promise without await to avoid blocking
    fetchContent()
      .then(({ notes, writings }) => {
        // Find best match
        const noteMatch = findBestMatch(linkText, notes);
        const writingMatch = findBestMatch(linkText, writings);

        if (noteMatch) {
          router.push(`/garden/notes/${encodeURIComponent(noteMatch.title)}`);
        } else if (writingMatch) {
          router.push(
            `/garden/essays/${encodeURIComponent(writingMatch.slug)}`
          );
        } else {
          // Best-effort navigation - create a URL based on what's more likely
          // This prevents errors by making an assumption about where it should go
          router.push(`/garden/notes/${encodeURIComponent(linkText)}`);
        }
      })
      .catch(() => {
        // If anything goes wrong, take a best guess
        router.push(`/garden/notes/${encodeURIComponent(linkText)}`);
      });
  };

  // Process backlinks in the content
  const processBacklinks = (content: string) => {
    // Regex to match [[text]] patterns
    const backlinkRegex = /\[\[(.*?)\]\]/g;

    // Replace all instances of [[text]] with custom link components
    return content.replace(backlinkRegex, (match, linkText) => {
      return `[${linkText}](/__backlink/${encodeURIComponent(linkText)})`;
    });
  };

  // Processed content with backlinks
  const processedContent = processBacklinks(content);

  return (
    <article className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={rehypePlugins}
        components={{
          ...components,
          // Override the 'a' component to handle backlinks and footnotes
          a: ({ node, href, className, ...props }: any) => {
            // Check if this is a backlink (starts with /__backlink/)
            if (href && href.startsWith("/__backlink/")) {
              const linkText = decodeURIComponent(
                href.replace("/__backlink/", "")
              );

              return (
                <span
                  className="backlink"
                  data-backlink={linkText}
                  onClick={() => handleBacklinkClick(linkText)}
                  title={`Go to: ${linkText}`}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleBacklinkClick(linkText);
                    }
                  }}
                  {...props}
                >
                  {props.children}
                </span>
              );
            }

            // Check if this is a footnote link (starts with # and contains footnote patterns)
            if (href && href.startsWith("#")) {
              const handleFootnoteClick = (e: React.MouseEvent) => {
                e.preventDefault();
                const targetId = href.slice(1); // Remove the # prefix
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                  targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });

                  // Add a temporary highlight effect to the target element
                  targetElement.classList.add("footnote-highlight");
                  setTimeout(() => {
                    targetElement.classList.remove("footnote-highlight");
                  }, 2000);

                  // Update URL without triggering page refresh
                  const url = new URL(window.location.href);
                  url.hash = href;
                  window.history.pushState({}, "", url);
                }
              };

              return (
                <a
                  className="footnote-ref"
                  href={href}
                  onClick={handleFootnoteClick}
                  {...props}
                />
              );
            }

            // Default link behavior for external links
            return (
              <a
                className={cn(className)}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
