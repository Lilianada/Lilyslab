"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

// Import Prism CSS for code highlighting
// We're already importing it globally in layout.tsx

// Loading skeleton for markdown content
export const MarkdownSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-muted rounded w-full"></div>
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
          "text-3xl font-bold mt-8 mb-4 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    h2: ({ node, className, ...props }: any) => (
      <h2 
        className={cn(
          "text-2xl font-semibold mt-8 mb-3 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    h3: ({ node, className, ...props }: any) => (
      <h3 
        className={cn(
          "text-xl font-semibold mt-6 mb-3 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    h4: ({ node, className, ...props }: any) => (
      <h4 
        className={cn(
          "text-lg font-medium mt-4 mb-2 text-foreground scroll-m-20",
          className
        )} 
        {...props} 
      />
    ),
    p: ({ node, className, ...props }: any) => (
      <p 
        className={cn(
          "leading-7 mb-4 text-foreground/90",
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
          "mt-6 border-l-2 pl-6 italic text-foreground/80",
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
          "mt-6 mb-4 p-0 overflow-hidden rounded-md bg-transparent",
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

  return (
    <article className={cn(
      "prose prose-sm sm:prose-base dark:prose-invert max-w-none markdown-content", 
      "text-justify [&_img]:rounded-lg [&_blockquote]:border-l [&_blockquote]:border-muted/50 [&_blockquote]:pl-4 mt-8",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
