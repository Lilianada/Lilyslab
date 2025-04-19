"use client"

import { BookCard } from "@/components/book-card"

// Sample data with summaries and reviews
const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "/Leaflets-logo.png",
    status: "read" as const,
    rating: 4.5,
    summary: "A revolutionary guide to building good habits and breaking bad ones. Clear explains how tiny changes can lead to remarkable results.",
    review: "An incredibly practical book that changed how I think about habit formation. The 1% better every day concept is powerful and actionable.",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    coverImage: "/Leaflets-logo.png",
    status: "reading" as const,
    rating: 4.2,
    summary: "Rules for focused success in a distracted world. Newport argues that the ability to perform deep work is becoming increasingly rare and valuable.",
    review: "Currently reading this and finding the strategies for maintaining focus incredibly valuable in our always-connected world.",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    coverImage: "/Leaflets-logo.png",
    status: "unread" as const,
    summary: "A guide to software development best practices. The authors share their insights on becoming a more effective programmer.",
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    coverImage: "/Leaflets-logo.png",
    status: "read" as const,
    rating: 4.8,
    summary: "A comprehensive guide to the principles and practices behind scalable, reliable, and maintainable systems.",
    review: "One of the best technical books I've read. The depth of knowledge and clear explanations make complex topics accessible.",
  },
]

export default function ReadingListPage() {
  return (
    <div className="min-h-screen">
       <div className="container max-w-7xl mx-auto px-4 py-8">
        
                <header className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                        <h1 className="mb-1 text-xl font-medium"> Movie List</h1>
                        <p className="text-sm text-muted-foreground">
                        A collection of movies and shows I've watched recently, with some thoughts.
                        </p>
                    </div>
                </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
          {books.map((book, index) => (
            <div key={index} className="h-full">
              {/* <BookCard
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                status={book.status}
                rating={book.rating}
                summary={book.summary}
                review={book.review}
              /> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}  