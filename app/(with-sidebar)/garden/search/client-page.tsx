"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
  const query = searchParams?.get('q') || '';
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
        // Fetch content from API endpoints
        const [notesResponse, writingsResponse] = await Promise.all([
          fetch('/api/notes'),
          fetch('/api/writings')
        ]);
        
        if (!notesResponse.ok || !writingsResponse.ok) {
          throw new Error('Failed to fetch content');
        }
        
        const notesData = await notesResponse.json();
        const writingsData = await writingsResponse.json();
        
        const notes = notesData.map((note: any) => ({
          title: note.title,
          slug: note.id,
          type: 'note' as const,
          content: note.content,
        }));

        const writings = writingsData.map((writing: any) => ({
          title: writing.title,
          slug: writing.slug,
          type: 'writing' as const,
          content: writing.content,
        }));

        // Combine all content
        const allContent = [...notes, ...writings];
        
        // Filter content based on query
        const lowerQuery = query.toLowerCase();
        const filtered = allContent.filter((item) => {
          const titleMatch = item.title.toLowerCase().includes(lowerQuery);
          const contentMatch = item.content && item.content.toLowerCase().includes(lowerQuery);
          return titleMatch || contentMatch;
        });
        
        setResults(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    }
    
    fetchContent();
  }, [query]);
  
  // Function to highlight query in text
  function highlightText(text: string, query: string) {
    if (!query || !text) return text;
    
    try {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } catch (e) {
      return text; // If regex fails, just return the original text
    }
  }
  
  // Display a preview of content with the matched query
  function getContentPreview(content: string, query: string) {
    if (!content) return '';
    
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    const index = lowerContent.indexOf(lowerQuery);
    if (index === -1) return content.substring(0, 100) + '...';
    
    // Show text around the matched query
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 100);
    
    let preview = content.substring(start, end);
    if (start > 0) preview = '...' + preview;
    if (end < content.length) preview = preview + '...';
    
    return highlightText(preview, query);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
          </p>
          
          {results.length > 0 ? (
            <div className="space-y-8">
              {results.map((item) => (
                <div key={`${item.type}-${item.slug}`} className="border-b pb-6">
                  <Link
                    href={`/garden/${item.type === 'note' ? 'notes' : 'writings'}/${item.slug}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                  {item.content && (
                    <div 
                      className="text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: getContentPreview(item.content, query)
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg p-8">
              <h2 className="text-lg font-medium mb-2">No results found</h2>
              <p className="text-muted-foreground">
                Try searching with different keywords or browse our content.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
