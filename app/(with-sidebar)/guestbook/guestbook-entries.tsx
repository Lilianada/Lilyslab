"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface GuestbookEntry {
  id: string;
  name: string;
  url?: string;
  date: string;
  message: string;
}

interface GuestbookEntriesProps {
  entries: GuestbookEntry[];
  isLoading: boolean;
}

export default function GuestbookEntries({ entries, isLoading }: GuestbookEntriesProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short", 
        day: "numeric",
      }).format(date);
    } catch (error) {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-muted/30 py-4">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No entries yet. Be the first to sign the guestbook!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className="overflow-hidden border border-border hover:border-primary/20 transition-all duration-300"
        >
          <CardHeader className="bg-muted/30 py-4">
            <div className="flex justify-between items-center">
              <div>
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline text-primary underline"
                  >
                    {entry.name}
                  </a>
                ) : (
                  <span className="font-medium">{entry.name}</span>
                )}
              </div>
              <time className="text-sm text-muted-foreground">
                {formatDate(entry.date)}
              </time>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize link rendering to open external links in new tab
                  a: ({ node, href, children, ...props }) => {
                    const isExternal = href?.startsWith('http') || href?.startsWith('//');
                    return (
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  // Ensure paragraphs preserve whitespace properly
                  p: ({ children }) => <p style={{ whiteSpace: "pre-wrap" }}>{children}</p>
                }}
              >
                {entry.message}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
