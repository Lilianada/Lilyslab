"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ExternalLink, BookOpen } from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  status: "read" | "reading" | "to-read";
  reviewUrl?: string;
  genre?: string[];
};

// Sample book data - replace with your actual books
const booksData: Book[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "/images/books/atomic-habits.jpg", // Moved to local storage to avoid external domain issues
    rating: 4.5,
    status: "read",
    reviewUrl: "/blog/atomic-habits-review",
    genre: ["Self-Help", "Productivity"]
  },
  {
    id: "2",
    title: "Educated",
    author: "Tara Westover",
    coverUrl: "/images/books/educated.jpg",
    rating: 5,
    status: "read",
    genre: ["Memoir", "Biography"]
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "/images/books/project-hail-mary.jpg",
    rating: 4,
    status: "reading",
    genre: ["Science Fiction", "Adventure"]
  },
  {
    id: "4",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverUrl: "/images/books/midnight-library.jpg",
    rating: 4.2,
    status: "read",
    genre: ["Fiction", "Fantasy"]
  },
  {
    id: "5",
    title: "Four Thousand Weeks",
    author: "Oliver Burkeman",
    coverUrl: "/images/books/four-thousand-weeks.jpg",
    rating: 4.8,
    status: "read",
    reviewUrl: "/blog/four-thousand-weeks-review",
    genre: ["Productivity", "Philosophy"]
  },
  {
    id: "6",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    coverUrl: "/images/books/klara-and-the-sun.jpg",
    rating: 4.1,
    status: "to-read",
    genre: ["Science Fiction", "Literary Fiction"]
  },
  // Add more books as needed
];

export default function BookshelfPage() {
  // Group books by status
  const readingBooks = booksData.filter(book => book.status === "reading");
  const readBooks = booksData.filter(book => book.status === "read");
  const toReadBooks = booksData.filter(book => book.status === "to-read");

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-1">My Bookshelf</h1>
        <p className="text-sm text-muted-foreground">
          A collection of books I've read, am reading, or plan to read.
        </p>
      </div>

      {/* Currently Reading Section */}
      {readingBooks.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="text-base font-medium">Currently Reading</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {readingBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Read Books Section */}
      {readBooks.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="text-base font-medium">Books I've Read</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {readBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
      
      {/* To Read Books Section */}
      {toReadBooks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="text-base font-medium">Want to Read</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {toReadBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  // Format the rating to show only one decimal place if needed
  const formattedRating = book.rating % 1 === 0 
    ? book.rating.toString() 
    : book.rating.toFixed(1);

  return (
    <Card className="flex flex-col border-border bg-card h-full overflow-hidden">
      {/* Book Cover with Aspect Ratio */}
      <div className="relative aspect-[2/3] w-full mb-2">
        <Image
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 40vw, (max-width: 1200px) 25vw, 16vw"
        />
        
        {/* Reading Status Badge */}
        {book.status === "reading" && (
          <div className="absolute top-0 right-0 px-1.5 py-0.5 text-[10px] font-medium bg-primary text-white">
            Reading
          </div>
        )}
      </div>
      
      {/* Book Details */}
      <div className="p-2 flex-1 flex flex-col">
        <h3 className="text-xs font-medium leading-tight mb-1" title={book.title}>
          {book.title.length > 20 ? `${book.title.substring(0, 18)}...` : book.title}
        </h3>
        <p className="text-[10px] text-muted-foreground mb-2">
          {book.author}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="text-[10px] font-medium bg-primary/10 px-1.5 py-0.5 rounded">
            {formattedRating}/5
          </div>
          
          <div className="text-[10px] text-muted-foreground">
            {book.reviewUrl ? (
              <Link 
                href={book.reviewUrl} 
                className="flex items-center text-primary hover:underline"
              >
                <span>Review</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </Link>
            ) : (
              <span className="text-muted-foreground/70">No review</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}