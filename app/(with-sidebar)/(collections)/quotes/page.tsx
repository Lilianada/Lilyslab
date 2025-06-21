'use client';

import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import React, { useEffect, useState } from "react";

interface Quote {
  author: string;
  text: string;
}

const quotes: Quote[] = [
  {
    author: "Albert Einstein",
    text: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.",
  },
  {
    author: "Steve Jobs",
    text: "Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish, and never lose the beginner's mind that sees possibilities everywhere.",
  },
  {
    author: "Maya Angelou",
    text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
  },
  {
    author: "Nelson Mandela",
    text: "Education is the most powerful weapon which you can use to change the world. It is through education that the daughter of a peasant can become a doctor.",
  },
  {
    author: "Marie Curie",
    text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less and achieve more.",
  },
  {
    author: "Winston Churchill",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts. We make a living by what we get, but we make a life by what we give.",
  },
];

const QuotesPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
          {quotes.map((quote, index) => (
            <div key={index} className="flex gap-8">
              {/* Author name on the left */}
              <div className="w-32 flex-shrink-0">
                <h3 className="text-sm font-medium">
                  {quote.author}
                </h3>
              </div>

              {/* Quote text on the right */}
              <div className="flex-1">
                <p className="text-sm text-justify text-muted-foreground leading-relaxed">
                  "{quote.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default QuotesPage;
