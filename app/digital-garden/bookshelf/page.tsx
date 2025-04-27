"use client";
import React, { useState, useEffect } from "react";
import BookCard from "@/components/digital-garden/bookshelf/BookCardMain";
import { BookCardSkeleton } from "@/components/digital-garden/bookshelf/BookCardSkeleton";

// Define the Book type matching the API response (should match API and BookCardMain)
interface Book {
  id: string;
  slug: string;
  title: string;
  status: 'current-reads' | 'read' | 'will-read';
  rating?: number;
  summary?: string;
  date?: number;
}

export default function BookshelfPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]); // Uses the updated Book type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<'all' | 'current-reads' | 'read' | 'will-read'>('all');

  const tabLabels = [
    { key: 'all', label: 'All' },
    { key: 'current-reads', label: 'Reading' },
    { key: 'read', label: 'Read' },
    { key: 'will-read', label: 'Will Read' },
  ];

  useEffect(() => {
    async function loadBooks() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to load book data' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: Book[] = await response.json(); // Use updated Book type
        setAllBooks(data);
      } catch (err) {
        console.error("Failed to load books:", err);
        const message = err instanceof Error ? err.message : "Failed to load book data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadBooks();
  }, []);

  const filteredBooks = selectedTab === 'all'
    ? allBooks
    : allBooks.filter((book) => book.status === selectedTab);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <BookCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-3xl mx-auto p-0 sm:px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Bookshelf</h1>
            <p className="text-sm text-muted-foreground">
              A collection of books I've read, am reading, or plan to read.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabLabels.map((tab) => (
            <button
              key={tab.key}
              className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${selectedTab === tab.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted border-border text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedTab(tab.key as 'all' | 'current-reads' | 'read' | 'will-read')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          renderSkeletons()
        ) : error ? (
          <div className="text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                distorted={false}
              />
            ))}
            {filteredBooks.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10">No books found in this category.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
