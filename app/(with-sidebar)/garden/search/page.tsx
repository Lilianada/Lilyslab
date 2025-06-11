"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllNotesData } from '@/lib/notes';
import { getAllWritings } from '@/lib/garden/writings';

// Define the types of content we can search through
type ContentType = {
  title: string;
  slug: string;
  type: 'note' | 'writing' | 'thread';
  content?: string;
};

export default function BacklinkSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Fetch content from different sources
        const notes = getAllNotesData().map(note => ({
          title: note.frontmatter.title,
          slug: note.slug,
          type: 'note' as const,
          content: note.content,
        }));

        const writings = (await getAllWritings()).map(writing => ({
          title: writing.title,
          slug: writing.slug,
          type: 'writing' as const,
          content: writing.content,
        }));

        // Combine all content
        const allContent = [...notes, ...writings];
        
        // Filter content based on the query
        const filtered = allContent.filter(item => {
          const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
          const contentMatch = item.content?.toLowerCase().includes(query.toLowerCase());
          return titleMatch || contentMatch;
        });

        setResults(filtered);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [query]);

  // If there's exactly one result, redirect to it
  useEffect(() => {
    if (results.length === 1) {
      const result = results[0];
      let path;
      
      if (result.type === 'note') {
        path = `/garden/notes/${result.slug}`;
      } else if (result.type === 'writing') {
        path = `/garden/writings/${result.slug}`;
      } else if (result.type === 'thread') {
        path = `/garden/threads/${result.slug}`;
      }
      
      if (path) {
        router.push(path);
      }
    }
  }, [results, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Searching for "{query}"</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-10 bg-muted rounded w-2/3"></div>
          <div className="h-10 bg-muted rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">No results found for "{query}"</h1>
        <p className="text-muted-foreground">
          Try searching with different keywords or browse all content.
        </p>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Browse</h2>
          <div className="flex space-x-4">
            <Link 
              href="/garden/notes" 
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
            >
              All Notes
            </Link>
            <Link 
              href="/garden/writings" 
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
            >
              All Writings
            </Link>
            <Link 
              href="/garden/threads" 
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
            >
              All Threads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Results for "{query}"</h1>
      
      <div className="grid gap-6">
        {results.map((item) => (
          <Link 
            href={
              item.type === 'note' 
                ? `/garden/notes/${item.slug}`
                : item.type === 'writing'
                ? `/garden/writings/${item.slug}`
                : `/garden/threads/${item.slug}`
            }
            key={`${item.type}-${item.slug}`}
            className="block p-4 border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{item.title}</h2>
              <span className="text-xs uppercase bg-primary/10 text-primary px-2 py-1 rounded">
                {item.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
