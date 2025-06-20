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
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted h-12"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="border-t p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ScrollProgress color="bg-extra-lavender" height={3} glow={true} />
      <div
        className={`max-w-4xl w-full mx-auto sm:px-4 pt-16 pb-8 ${
          isLoaded ? "animate-fade-in" : "opacity-0"
        }`}
      >
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
          <div className="border rounded-lg overflow-hidden bg-card">
            <div className="bg-muted/50 px-4 py-3 border-b">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Word</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-4">Meaning</div>
                <div className="col-span-3">Example</div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="col-span-2 text-sm font-mono text-muted-foreground">
                    {formatDate(word.date)}
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium text-sm">{word.word}</div>
                    {word.pronunciation && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {word.pronunciation}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/20 text-accent-foreground">
                      {word.partOfSpeech}
                    </span>
                  </div>
                  <div className="col-span-4 text-sm leading-relaxed">
                    {word.meaning}
                    {word.similar.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Similar: </span>
                        <span className="text-xs">
                          {word.similar.slice(0, 3).join(', ')}
                          {word.similar.length > 3 && '...'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground">
                    {word.example && (
                      <span className="italic">"{word.example}"</span>
                    )}
                    {word.context && !word.example && (
                      <span className="italic">"{word.context}"</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Footer 
          inspirationName="Vocabulary building"
          inspirationUrl="https://www.merriam-webster.com/word-of-the-day"
          color='text-extra-lavender'
        />
      </div>
    </>
  );
};

export default WordOfTheDayPage;
