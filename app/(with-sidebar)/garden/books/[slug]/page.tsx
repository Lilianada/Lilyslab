"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";
import { formatTimestampToYYMMDD } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  status: 'current-reads' | 'read' | 'to-be-read';
  rating?: number;
  genre?: string;
  date?: number;
  content: string;
}

const statusColors: Record<Book['status'], string> = {
  'read': '#A2CBAF',
  'current-reads': '#A6C2EB',
  'to-be-read': '#FAE680'
};

export default function BookshelfDetailPage() {
  const params = useParams();
  const router = useRouter();
  const currentSlug = params?.slug as string || '';

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentSlug) return;

    async function loadBook() {
      setIsLoading(true);
      setError(null);
      setBook(null);
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to load book data' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const allBooks: Book[] = await response.json();
        const foundBook = allBooks.find(b => b.id === currentSlug);

        if (foundBook) {
          setBook(foundBook);
        } else {
          setError("Book not found.");
        }
      } catch (err) {
        console.error("Failed to load book:", err);
        const message = err instanceof Error ? err.message : "Failed to load book data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadBook();
  }, [currentSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen container max-w-3xl mx-auto px-2 py-10 animate-pulse">
        <div className="h-8 w-1/4 bg-muted rounded mb-6"></div>
        <div className="p-8 rounded-xl shadow-xl bg-muted space-y-6">
          <div className="h-8 w-3/4 bg-muted-foreground/20 rounded"></div>
          <div className="h-4 w-1/2 bg-muted-foreground/20 rounded"></div>
          <div className="w-full h-1 border-t-2 border-dashed border-muted-foreground/10 my-6"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
            <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
            <div className="h-4 w-5/6 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen container max-w-3xl mx-auto px-2 py-10">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2 hover:text-gray-300 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookshelf
        </button>
        <div className="text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen container max-w-3xl mx-auto px-2 py-10">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2 hover:text-gray-300 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookshelf
        </button>
        <div className="text-center py-10 text-muted-foreground">Book not found.</div>
      </div>
    );
  }

  const backgroundColor = statusColors[book.status] || '#E0E0E0';
  const formattedDate = formatTimestampToYYMMDD(book.date);

  return (
    <div className="min-h-screen">
      <div className="container max-w-3xl mx-auto px-2 py-10">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2 text-muted-foreground hover:text-foreground flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookshelf
        </button>
        <div
          className="relative w-full mx-auto p-8 rounded-xl shadow-xl "
          style={{
            backgroundColor: backgroundColor,
            backgroundImage: 'url("/noise.svg")',
            backgroundRepeat: 'repeat',
            backgroundSize: '350px 350px',
            backgroundBlendMode: 'multiply',
            border: '3px solid #222',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
          }}
        >
          <div className="pb-4">
            <h1 className="text-2xl font-semibold tracking-tight mb-1 text-black" style={{ letterSpacing: '-1px' }}>{book.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2 font-mono text-black/80">
              <span>Status: {book.status.replace('-', ' ')}</span>
              {book.rating !== undefined && <span>Rating: {book.rating}/5</span>}
            </div>
          </div>
          <div className="w-full border-t-2 border-black border-dashed mb-6" />
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-black/90">
            <ReactMarkdown>
              {book.content}
            </ReactMarkdown>
          </div>
          <div className="w-full mt-8 border-t-2 border-black border-dashed mb-6" />
          <span className="text-sm text-black/80 flex justify-end font-mono font-medium w-full">Date added: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
