"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, BookMarked } from "lucide-react";

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
    coverUrl: "https://m.media-amazon.com/images/I/51-nXsSRfZL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg",
    rating: 4.5,
    status: "read",
    reviewUrl: "/blog/atomic-habits-review",
    genre: ["Self-Help", "Productivity"]
  },
  {
    id: "2",
    title: "Educated",
    author: "Tara Westover",
    coverUrl: "https://m.media-amazon.com/images/I/41+aN7ZbS9L._SY344_BO1,204,203,200_.jpg",
    rating: 5,
    status: "read",
    genre: ["Memoir", "Biography"]
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "https://m.media-amazon.com/images/I/81zD9kaVW9L._SY522_.jpg",
    rating: 4,
    status: "reading",
    genre: ["Science Fiction", "Adventure"]
  },
  // Add more books as needed
];

export default function BookshelfPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const genres = Array.from(
    new Set(booksData.flatMap((book) => book.genre || []))
  );

  const filteredBooks = booksData.filter((book) => {
    // Search filter
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Genre filter
    const matchesGenre = !activeFilter || 
      (book.genre && book.genre.includes(activeFilter));
    
    return matchesSearch && matchesGenre;
  });

  // Group books by status
  const readingBooks = filteredBooks.filter(book => book.status === "reading");
  const readBooks = filteredBooks.filter(book => book.status === "read");
  const toReadBooks = filteredBooks.filter(book => book.status === "to-read");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookshelf</h1>
          <p className="text-muted-foreground">
            A collection of books I've read, am reading, or plan to read
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books or authors..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeFilter === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(null)}
            >
              All
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={activeFilter === genre ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        {/* Currently Reading Section */}
        {readingBooks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Currently Reading</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {readingBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Read Books Section */}
        {readBooks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Books I've Read</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {readBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}
        
        {/* To Read Books Section (if you have any in this category) */}
        {toReadBooks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Want to Read</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {toReadBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}
        
        {/* No results message */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No books found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  // Format the rating to show only one decimal place if needed
  const formattedRating = book.rating % 1 === 0 
    ? book.rating.toString() 
    : book.rating.toFixed(1);

  return (
    <div className="flex flex-col h-full">
      {/* Book Cover with Aspect Ratio */}
      <div className="relative aspect-[2/3] w-full mb-3 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
          {book.reviewUrl ? (
            <Link href={book.reviewUrl} className="text-white text-sm font-medium hover:underline">
              Read Review
            </Link>
          ) : (
            <span className="text-white text-sm font-medium">No Review Yet</span>
          )}
        </div>
        <Image
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          fill
          className="object-cover rounded-md shadow-md"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
        />
        
        {/* Status Badge */}
        {book.status === "reading" && (
          <Badge className="absolute top-2 right-2 bg-primary">Reading</Badge>
        )}
      </div>
      
      {/* Book Details */}
      <div className="flex-1">
        <h3 className="font-medium text-sm leading-tight mb-1" title={book.title}>
          {book.title.length > 25 ? `${book.title.substring(0, 22)}...` : book.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-1">
          {book.author}
        </p>
        <div className="flex items-center mt-auto">
          <div className="text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary px-2 py-0.5 rounded">
            {formattedRating}/5
          </div>
        </div>
      </div>
    </div>
  );
}