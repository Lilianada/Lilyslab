"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import NotesOverview from "@/components/digital-garden/bookshelf/BookOverview";
import React from "react";
import { BookCardMain } from "@/components/digital-garden/bookshelf/BookCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen">
      <div className="container max-w-4xl mx-auto px-2 py-10">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Back</button>
        <div
          className="relative w-full mx-auto p-8 rounded-xl shadow-xl transition-transform hover:scale-[1.012]"
          style={{
            backgroundColor: '#FFF9D6',
            backgroundImage: 'url("/Noise.png")',
            backgroundRepeat: 'repeat',
            backgroundSize: '350px 350px',
            backgroundBlendMode: 'multiply',
            border: '3px solid #222',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
          }}
        >
          {/* Header */}
          <div className="pb-4">
            <h1 className="text-2xl font-semibold tracking-tight mb-2 text-black" style={{letterSpacing: '-1px'}}>{book.name.replace(/\.md$/, "")}</h1>
          </div>
          {/* Dashed Divider */}
          <div className="w-full border-t-2 border-black border-dashed mb-6" />
          {/* Body */}
          <div className="mb-8">
            <p className="text-lg mb-4 text-black">{book.frontmatter.description}</p>
            <div className="text-base text-black whitespace-pre-line" style={{lineHeight: '1.7'}}>{book.body}</div>
          </div>
          {/* Footer */}
          <div className="grid grid-cols-3 gap-0 border-t-2 border-black">
            <div className="border-r-2 border-black p-3 flex flex-col">
              <span className="text-xs uppercase text-black mb-1">Created</span>
              <span className="font-mono text-lg font-bold text-black">{book.frontmatter.created}</span>
            </div>
            <div className="border-r-2 border-black p-3 flex flex-col">
              <span className="text-xs uppercase text-black mb-1">Edited</span>
              <span className="font-mono text-lg font-bold text-black">{book.frontmatter.edited}</span>
            </div>
            <div className="p-3 flex flex-col">
              <span className="text-xs uppercase text-black mb-1">Topic</span>
              <span className="font-mono text-lg font-bold italic text-black">{book.category}</span>
            </div>
          </div>
          {/* Next note button */}
          <div className="flex justify-end mt-6">
            <a href="#" className="px-5 py-2 text-black font-semibold  transition flex ">Next note 
              <ArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
