"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import NotesOverview from "@/components/digital-garden/bookshelf/NotesOverview";
import React from "react";

// For demo, use mock data. In a real app, fetch by slug.
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
    category: "Productivity"
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
    category: "Focus"
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
    category: "Creativity"
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
    category: "Career"
  },
];

export default function BookshelfDetailPage() {
  const params = useParams();
  const router = useRouter();
  const book = books.find(b => b.slug === params.slug);

  if (!book) {
    return <div className="p-8">Book not found.</div>;
  }

  // For demo, NotesOverview expects certain props; adapt as needed.
  return (
    <div className="min-h-screen bg-white/80">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Back</button>
        <h1 className="mb-4 text-2xl font-bold">{book.name.replace(/\.md$/, "")}</h1>
        <NotesOverview
          latestCreatedNotes={[book]}
          latestEditedNotes={[]}
          basePath="/digital-garden/bookshelf"
          categories={[book.category]}
        />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="mb-2">{book.frontmatter.description}</p>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p><b>Created:</b> {book.frontmatter.created}</p>
          <p><b>Edited:</b> {book.frontmatter.edited}</p>
          <p><b>Body:</b> {book.body}</p>
        </div>
      </div>
    </div>
  );
}
