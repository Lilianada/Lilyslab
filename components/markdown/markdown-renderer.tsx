"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FootnoteRef } from "./footnote-ref";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const handleBacklinkClick = (linkText: string) => {
    fetch(`/api/garden/resolve?text=${encodeURIComponent(linkText)}`)
      .then((res) => (res.ok ? res.json() : { href: null }))
      .then(({ href }: { href: string | null }) => {
        // No post by that name yet: go to the garden rather than a missing page.
        router.push(href ?? "/garden");
      })
      .catch(() => router.push("/garden"));
  };

  // Process backlinks in the content
  const processBacklinks = (content: string) => {
    // Regex to match [[text]] patterns
    const backlinkRegex = /\[\[(.*?)\]\]/g;

    // Replace all instances of [[text]] with custom link components
    // [[target|label]] shows "label" and links to "target".
    return content.replace(backlinkRegex, (match, linkText: string) => {
      const [target, label] = linkText.split("|");
      return `[${(label ?? target).trim()}](/__backlink/${encodeURIComponent(target.trim())})`;
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
                <a
                  className="backlink"
                  data-backlink={linkText}
                  href={`/garden/go?to=${encodeURIComponent(linkText)}`}
                  onClick={(e) => {
                    // New-tab and similar clicks use the plain address.
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    handleBacklinkClick(linkText);
                  }}
                  {...props}
                >
                  {props.children}
                </a>
              );
            }

            // Footnote markers preview their note on hover, like Wikipedia.
            if (href && href.startsWith("#") && props["data-footnote-ref"] !== undefined) {
              return <FootnoteRef href={href} {...props} />;
            }

            // Other in-page links (like a footnote's back arrow) stay on the page.
            if (href && href.startsWith("#")) {
              return <a className={cn(className)} href={href} {...props} />;
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
