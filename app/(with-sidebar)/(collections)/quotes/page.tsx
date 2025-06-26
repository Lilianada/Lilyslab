'use client';

import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import React, { useEffect, useState } from "react";

interface Quote {
  id: string;
  author: string;
  text: string;
  source?: string;
  tags: string[];
  date: string;
}

const QuotesPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes');
        if (response.ok) {
          const data = await response.json();
          setQuotes(data.quotes);
        }
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
    setIsLoaded(true);
  }, []);

  return (
    <>
      <ScrollProgress color="bg-primary" height={3} glow={true} />
      <div
        className={`max-w-2xl w-full mx-auto sm:px-4 pt-16 pb-8 ${
          isLoaded ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Quotes</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-20</div>
            <div>Last updated: 2025-06-21</div>
            <div>Inspired by: ✳︎✳︎✳︎</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            A collection of inspiring quotes from various thinkers, innovators, and leaders throughout history.
          </p>
        </header>

        <div className="space-y-8 mt-8">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-muted-foreground" />
            </div>
          ) : (
            quotes.map((quote) => (
              <div key={quote.id} className="flex gap-8">
                {/* Author name on the left */}
                <div className="w-32 flex-shrink-0">
                  <h3 className="text-sm font-medium">
                    {quote.author}
                  </h3>
                  {quote.source && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {quote.source}
                    </p>
                  )}
                </div>

                {/* Quote text on the right */}
                <div className="flex-1">
                  <p className="text-sm text-justify text-muted-foreground leading-relaxed">
                    "{quote.text}"
                  </p>
                  {quote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {quote.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default QuotesPage;
