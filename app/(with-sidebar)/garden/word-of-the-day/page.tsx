"use client";

import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import React, { useEffect, useState } from "react";

interface WordMeaning {
  definition: string;
  examples?: string[];
}

interface WordOfTheDay {
  id: string;
  date: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meanings: WordMeaning[];
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
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to fetch WOTD data" }));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const data: WordOfTheDay[] = await response.json();
        setWords(data);
      } catch (error) {
        console.error("Error fetching WOTD data:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-6"></div>
        <div className="grid gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border rounded-lg p-6 bg-card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ScrollProgress color="bg-lavender" height={3} glow={true} />

      <div className="min-h-screen animate-fade-in">
        <div className="container max-w-2xl mx-auto px-0 sm:px-4 pt-16 pb-8">
          <header className="mb-8">
            <span className="text-2xl animate-spin">✳︎</span>
            <h1 className="mb-2 text-xl font-medium">Word of the Day</h1>
            <div className="flex flex-col text-xs text-muted-foreground font-mono">
              <div>Created: 2025-06-03</div>
              <div>Last updated: 2025-06-21</div>
              <div>Total words: {words.length}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              A daily collection of interesting words and their meanings,
              building vocabulary one word at a time.
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
            <div className="space-y-6">
              {words.map((word, index) => (
                <div
                  key={word.id}
                  className="border rounded-lg p-6 bg-card hover:bg-accent/5 transition-colors"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h2 className="text-base font-semibold">{word.word}</h2>
                        {word.pronunciation && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {word.pronunciation}
                          </span>
                        )}
                        {word.partOfSpeech && (
                          <span className="text-xs text-muted-foreground font-mono">
                            ({word.partOfSpeech})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span>{formatDate(word.date)}</span>
                    </div>
                  </div>

                  {/* Meanings */}
                  <div className="space-y-4">
                    {word.meanings.length > 0 ? (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground mb-2">
                          {word.meanings.length > 1 ? "Meanings" : "Meaning"}
                        </h3>
                        <div className="space-y-2">
                          {word.meanings.map((meaning, idx) => (
                            <div key={idx} className="flex gap-3">
                              {word.meanings.length > 1 && (
                                <span className="text-sm text-muted-foreground font-mono mt-0.5 flex-shrink-0">
                                  {idx + 1}.
                                </span>
                              )}
                              <p className="text-sm leading-relaxed">
                                {meaning.definition}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Example */}
                    {(word.example || word.context) && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground mb-2">
                          Example
                        </h3>
                        <p className="text-sm text-muted-foreground italic border-l-2 border-accent/20 pl-3">
                          "{word.example || word.context}"
                        </p>
                      </div>
                    )}

                    {/* Similar words */}
                    {word.similar.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Similar words
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {word.similar.map((similarWord, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted/50 text-muted-foreground"
                            >
                              {similarWord}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Footer />
        </div>
      </div>
    </>
  );
};

export default WordOfTheDayPage;
