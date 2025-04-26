"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RenderMarkdownWithNotionBlocks from "./notesRender";
import { colors } from "@/components/digital-garden/bookshelf/BookCard";

import { mockMarkdownArticle } from "../mockMarkdownArticle";

const books = [
  {
    slug: "atomic-habits.md",
    name: "Atomic Habits.md",
    frontmatter: {
      created: "2022-01-01",
      edited: "2022-01-10",
      description: "A practical guide to building good habits and breaking bad ones.",
    },
    body: mockMarkdownArticle,
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
    body: mockMarkdownArticle,
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
    body: mockMarkdownArticle,
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
    body: mockMarkdownArticle,
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
      <div className="container max-w-3xl mx-auto px-2 py-10">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2  hover:text-gray-300">
          <ArrowLeft className="mr-2" />
        </button>
        <div
          className="relative w-full mx-auto p-8 rounded-xl shadow-xl "
          style={{
            backgroundColor: (() => {
              const categoriesWhitelist = ["Productivity", "Focus", "Creativity", "Career"];
              const categoryIndex = categoriesWhitelist.indexOf(book.category);
              return colors[categoryIndex] || colors[0];
            })(),
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
            {/* Render markdown article using NotionBlock renderer */}
            <RenderMarkdownWithNotionBlocks markdown={book.body} />
          </div>
          {/* Footer */}
          <div className="grid grid-cols-3 gap-0 border-t-2 border-black">
            <div className="border-r-2 border-black p-3 flex flex-col">
              <span className="text-xs uppercase text-black mb-1">Created</span>
              <span className="font-mono text-sm font-bold text-black">{book.frontmatter.created}</span>
            </div>
            <div className="border-r-2 border-black p-3 flex flex-col">
              <span className="text-xs uppercase text-black mb-1">Edited</span>
              <span className="font-mono text-sm font-bold text-black">{book.frontmatter.edited}</span>
            </div>
            <div className="p-3 flex flex-col">
              <span className="text-xs uppercase text-black mb-1">Topic</span>
              <span className="font-mono text-sm font-bold italic text-black">{book.category}</span>
            </div>
          </div>
          {/* Next/Previous note button */}
          <div className="flex justify-end mt-6">
            {(() => {
              const currentIdx = books.findIndex(b => b.slug === book.slug);
              const next = books[currentIdx + 1];
              const prev = books[currentIdx - 1];
              if (next) {
                return (
                  <a
                    href={`/digital-garden/bookshelf/${next.slug}`}
                    className="px-5 py-2 text-black font-semibold transition flex items-center"
                  >
                    Next note <ArrowRight className="ml-2" />
                  </a>
                );
              } else if (prev) {
                return (
                  <a
                    href={`/digital-garden/bookshelf/${prev.slug}`}
                    className="px-5 py-2 text-black font-semibold transition flex items-center"
                  >
                    <ArrowLeft className="mr-2"/>
                    Previous note
                  </a>
                );
              } else {
                return null;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
