'use client';

import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import React, { useEffect, useState } from "react";

interface WordOfTheDay {
  id: string;
  date: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  similar: string[];
  context: string;
}

const WordOfTheDayPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [words, setWords] = useState<WordOfTheDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API route
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/word-of-the-day");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch WOTD data' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: WordOfTheDay[] = await response.json();
        setWords(data);
      } catch (error) {
        console.error("Error fetching WOTD data:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 w-28 border-r border-border">
                  <div className="h-4 bg-muted rounded"></div>
                </th>
                <th className="px-3 py-2 border-r border-border">
                  <div className="h-4 bg-muted rounded"></div>
                </th>
                <th className="px-3 py-2 w-20 border-r border-border">
                  <div className="h-4 bg-muted rounded"></div>
                </th>
                <th className="px-3 py-2">
                  <div className="h-4 bg-muted rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2.5 border-r border-border">
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </td>
                  <td className="px-3 py-2.5 border-r border-border">
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-20"></div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 border-r border-border">
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ScrollProgress color="bg-lavender" height={3} glow={true} />
     
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-4xl mx-auto px-0 sm:px-4 pt-16 pb-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Word of the Day</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-06-03</div>
            <div>Last updated: 2025-06-21</div>
            <div>Total words: {words.length}</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            A daily collection of interesting words and their meanings, building vocabulary one word at a time.
          </p>
        </header>

        {/* Conditional Rendering based on state */}
        {isLoading ? (
          renderLoadingSkeleton()
        ) : error ? (
          <div className="text-center py-8 border border-destructive/50 bg-destructive/10 rounded-lg">
            <p className="text-red-500 mb-2">Error loading WOTD data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground text-sm">No words found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground font-mono text-xs uppercase tracking-wide w-28 border-r border-border">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground font-mono text-xs uppercase tracking-wide border-r border-border">
                    Word
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground font-mono text-xs uppercase tracking-wide w-20 border-r border-border">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground font-mono text-xs uppercase tracking-wide">
                    Meaning & Example
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {words.map((word, index) => (
                  <tr
                    key={word.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground border-r border-border">
                      {formatDate(word.date)}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border">
                      <div className="font-medium text-sm">{word.word}</div>
                      {word.pronunciation && (
                        <div className="text-xs text-muted-foreground mt-1 font-mono">
                          {word.pronunciation}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 border-r border-border">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/20 text-accent-foreground font-mono">
                        {word.partOfSpeech}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="space-y-2">
                        <div className="text-sm leading-relaxed">
                          {word.meaning}
                        </div>
                        {(word.example || word.context) && (
                          <div className="text-sm text-muted-foreground italic">
                            "{word.example || word.context}"
                          </div>
                        )}
                        {word.similar.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Similar: </span>
                            {word.similar.slice(0, 4).join(', ')}
                            {word.similar.length > 4 && '...'}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <Footer />
      </div>
      </div>
    </>
  );
};

export default WordOfTheDayPage;
