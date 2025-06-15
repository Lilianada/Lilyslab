"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';


export const MarkdownSkeleton = () => (
  <div className="animate-pulse space-y-4">
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
  // Create the components object with default styles and overrides
  const components = {
    h1: ({ node, className, ...props }: any) => (
      <h1 
        className={cn(
          "text-xl font-semibold mt-8 mb-4 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    h2: ({ node, className, ...props }: any) => (
      <h2 
        className={cn(
          "text-lg font-medium mt-8 mb-3 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    h3: ({ node, className, ...props }: any) => (
      <h3 
        className={cn(
          "text-base font-medium mt-6 mb-3 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    h4: ({ node, className, ...props }: any) => (
      <h4 
        className={cn(
          "text-[15px] font-medium mt-4 mb-2 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    p: ({ node, className, ...props }: any) => (
      <p 
        className={cn(
          "text-sm leading-tight mb-4 text-foreground/90",
          className
        )} 
        {...props} 
      />
    ),
    a: ({ node, className, ...props }: any) => (
      <a 
        className={cn(
          "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors",
          className
        )} 
        target="_blank" 
        rel="noopener noreferrer"
        {...props} 
      />
    ),
    ul: ({ node, className, ordered, ...props }: any) => (
      <ul 
        className={cn(
          "my-6 ml-6 list-disc text-foreground/90",
          className
        )} 
        {...props} 
      />
    ),
    ol: ({ node, className, ...props }: any) => (
      <ol 
        className={cn(
          "my-6 ml-6 list-decimal text-foreground/90",
          className
        )} 
        {...props} 
      />
    ),
    li: ({ node, className, ...props }: any) => (
      <li 
        className={cn(
          "mt-2",
          className
        )} 
        {...props} 
      />
    ),
    blockquote: ({ node, className, ...props }: any) => (
      <blockquote 
        className={cn(
          "text-sm font-normal mt-6 border-l-3 pl-6 italic text-muted-foreground",
          className
        )} 
        {...props} 
      />
    ),
    hr: ({ node, className, ...props }: any) => (
      <hr 
        className={cn(
          "my-8 border-border",
          className
        )} 
        {...props} 
      />
    ),
    img: ({ node, className, alt, ...props }: any) => (
      <img 
        className={cn(
          "rounded-md my-8 max-w-full h-auto",
          className
        )} 
        alt={alt || ""}
        loading="lazy"
        {...props} 
      />
    ),
    code: ({ node, className, inline, ...props }: any) => (
      inline ? 
        <code 
          className={cn(
            "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
            className
          )} 
          {...props} 
        />
        :
        <code
          className={cn(
            "bg-muted font-mono text-sm block p-4 my-4 rounded-md overflow-auto",
            className
          )}
          {...props}
        />
    ),
    pre: ({ node, className, ...props }: any) => (
      <pre 
        className={cn(
          "mt-6 mb-4 w-fit p-0 overflow-hidden rounded-md bg-transparent",
          className
        )} 
        {...props} 
      />
    ),
    table: ({ node, className, ...props }: any) => (
      <div className="my-6 w-full overflow-y-auto">
        <table 
          className={cn(
            "w-full border-collapse text-sm",
            className
          )} 
          {...props} 
        />
      </div>
    ),
    thead: ({ node, className, ...props }: any) => (
      <thead 
        className={cn(
          "bg-muted/50",
          className
        )} 
        {...props} 
      />
    ),
    tbody: ({ node, className, ...props }: any) => (
      <tbody 
        className={cn(
          "divide-y divide-border",
          className
        )} 
        {...props} 
      />
    ),
    tr: ({ node, className, ...props }: any) => (
      <tr 
        className={cn(
          "transition-colors",
          className
        )} 
        {...props} 
      />
    ),
    th: ({ node, className, ...props }: any) => (
      <th 
        className={cn(
          "p-4 text-left font-medium text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )} 
        {...props} 
      />
    ),
    td: ({ node, className, ...props }: any) => (
      <td 
        className={cn(
          "p-4 text-foreground/90 [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )} 
        {...props} 
      />
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
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          ...components,
          // Override the 'a' component to handle backlinks specially
          a: ({ node, href, className, ...props }: any) => {
            // Check if this is a backlink (starts with /__backlink/)
            if (href && href.startsWith('/__backlink/')) {
              const linkText = decodeURIComponent(href.replace('/__backlink/', ''));
              
              // Custom handler for backlink click - find and navigate to the matching page
              const handleBacklinkClick = async () => {
                try {
                  // Fetch notes and writings to find a matching title
                  const [notesResponse, writingsResponse] = await Promise.all([
                    fetch('/api/notes'),
                    fetch('/api/writings')
                  ]);
                  
                  if (!notesResponse.ok || !writingsResponse.ok) {
                    throw new Error('Failed to fetch content');
                  }
                  
                  const notesData = await notesResponse.json();
                  const writingsData = await writingsResponse.json();
                  
                  // Find exact match or case-insensitive match
                  const exactNote = notesData.find((note: any) => note.title === linkText);
                  const exactWriting = writingsData.find((writing: any) => writing.title === linkText);
                  
                  const caseInsensitiveNote = notesData.find((note: any) => 
                    note.title.toLowerCase() === linkText.toLowerCase()
                  );
                  const caseInsensitiveWriting = writingsData.find((writing: any) => 
                    writing.title.toLowerCase() === linkText.toLowerCase()
                  );
                  
                  // Navigate to the first match found
                  // Fix: slugify the note title for the URL
                  const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-');
                  if (exactNote) {
                    window.location.href = `/garden/notes/${slugify(exactNote.title)}`;
                  } else if (exactWriting) {
                    window.location.href = `/garden/writings/${exactWriting.slug}`;
                  } else if (caseInsensitiveNote) {
                    window.location.href = `/garden/notes/${slugify(caseInsensitiveNote.title)}`;
                  } else if (caseInsensitiveWriting) {
                    window.location.href = `/garden/writings/${caseInsensitiveWriting.slug}`;
                  } 
                } catch (error) {
                  console.error('Error handling backlink:', error);
                }
              };
              
              return (
                <span 
                  className="backlink"
                  data-backlink={linkText}
                  onClick={handleBacklinkClick}
                  {...props}
                >
                  {props.children}
                </span>
              );
            }
            
            // Default link behavior for non-backlinks
            return (
              <a 
                className={cn(
                  "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors",
                  className
                )} 
                href={href}
                target="_blank" 
                rel="noopener noreferrer"
                {...props} 
              />
            );
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
