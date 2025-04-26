"use client";
import React, { useState } from "react";
import { BookCardMain as BookCard } from "@/components/digital-garden/bookshelf/BookCard";
import Link from "next/link";

// Mock data for books
const books = [
  {
    slug: "atomic-habits.md",
    name: "Atomic Habits.md",
    frontmatter: {
      created: "2022-01-01",
      edited: "2022-01-10",
      description: "A practical guide to building good habits and breaking bad ones.",
    },
    body: "Atomic Habits by James Clear provides a proven framework for improving every day.",
    category: "Productivity",
    status: "read",
  },
  {
    slug: "deep-work.md",
    name: "Deep Work.md",
    frontmatter: {
      created: "2021-11-15",
      edited: "2021-11-20",
      description: "Rules for focused success in a distracted world.",
    },
    body: "Deep Work by Cal Newport is about the benefits of intense focus and how to achieve it.",
    category: "Focus",
    status: "reading",
  },
  {
    slug: "show-your-work.md",
    name: "Show Your Work.md",
    frontmatter: {
      created: "2020-05-10",
      edited: "2020-06-01",
      description: "10 ways to share your creativity and get discovered.",
    },
    body: "Austin Kleon's book encourages creatives to share their process and connect with others.",
    category: "Creativity",
    status: "will_read",
  },
  {
    slug: "so-good-they-cant-ignore-you.md",
    name: "So Good They Can't Ignore You.md",
    frontmatter: {
      created: "2019-09-01",
      edited: "2019-09-15",
      description: "Why skills trump passion in the quest for work you love.",
    },
    body: "Cal Newport argues that skills, not passion, are the key to career satisfaction.",
    category: "Career",
    status: "read",
  },
];

export default function BookshelfPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'read' | 'reading' | 'will_read'>('all');

  const tabLabels = [
    { key: 'all', label: 'All' },
    { key: 'read', label: 'Read' },
    { key: 'reading', label: 'Reading' },
    { key: 'will_read', label: 'Will Read' },
  ];

  const filteredBooks = selectedTab === 'all' ? books : books.filter((book) => book.status === selectedTab);

  return (
    <div className="min-h-screen animate-fade-in ">
      <div className="container max-w-3xl mx-auto px-4 py-8">

        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Bookshelf</h1>
            <p className="text-sm text-muted-foreground">
              A collection of books I’ve read, am reading, or plan to read. Click on any book to see more details.
            </p>
          </div>
        </header>
        {/* Tabs for book status */}
        <div className="flex gap-2 mb-6">
          {tabLabels.map((tab) => (
            <button
              key={tab.key}
              className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${selectedTab === tab.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted border-border text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedTab(tab.key as 'read' | 'reading' | 'will_read')}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredBooks.map((book) => (
            <Link key={book.slug} href={`/digital-garden/bookshelf/${book.slug}`} className="cursor-pointer block">
              <BookCard
                data={book}
                path="/digital-garden/bookshelf"
                category={book.category}
                distorted={false}
              />
            </Link>
          ))}
          {filteredBooks.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">No books in this category.</div>
          )}
        </div>
      </div>
      
    </div>
  );
}
