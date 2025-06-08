"use client";
import React from "react";
import clsx from "clsx";

// For cover color and code
const covers = [
  { color: "bg-blue-200", code: "SH" }, // Self-help
  { color: "bg-teal-200", code: "ME" }, // Memoir
  { color: "bg-purple-200", code: "FIC" }, // Fiction
  { color: "bg-pink-200", code: "NF" }, // Nonfiction
  { color: "bg-yellow-200", code: "FAN" }, // Fantasy
  { color: "bg-orange-200", code: "FIC" }, // Fiction
];

const bookshelfEntries = [
  {
    month: "January",
    title: "How to Stay Motivated",
    genre: "Self-help",
    released: 2021,
    pages: 223,
    format: "Paperback",
    status: "finished",
    cover: covers[0],
  },
  {
    month: "February",
    title: "The Quiet Programmer",
    genre: "Memoir",
    released: 2023,
    pages: 188,
    format: "Ebook",
    status: "finished",
    cover: covers[1],
  },
  {
    month: "March",
    title: "Gardens of Code",
    genre: "Fiction",
    released: 2022,
    pages: 320,
    format: "Paperback",
    status: "finished",
    cover: covers[2],
  },
  {
    month: "April",
    title: "Coffee Break Algorithms",
    genre: "Nonfiction",
    released: 2023,
    pages: 141,
    format: "Paperback",
    status: "favorite",
    cover: covers[3],
  },
  {
    month: "May",
    title: "Lamp Light Reading",
    genre: "Fantasy",
    released: 2019,
    pages: 409,
    format: "Paperback",
    status: "finished",
    cover: covers[4],
  },
  {
    month: "June",
    title: "Home is a Feeling",
    genre: "Fiction",
    released: 2024,
    pages: 251,
    format: "Ebook",
    status: "favorite",
    cover: covers[5],
  },
];

const statusColor: Record<string, string> = {
  finished: "bg-green-200 text-green-900 border-green-300",
  favorite: "bg-yellow-100 text-yellow-900 border-yellow-300",
};

export default function BookshelfPage() {
  return (
    <div className="min-h-screen bg-neutral-100 py-12 flex flex-col items-center">
      <div className="max-w-6xl w-full px-2">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-serif text-2xl font-bold text-neutral-700 tracking-tight">
            Monthly Favorites
          </h2>
          <span className="font-mono text-lg text-neutral-400">2024</span>
        </div>
        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {bookshelfEntries.map((entry, i) => (
            <div
              key={entry.month}
              className={clsx(
                "relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow px-6 pt-7 pb-5 min-h-[310px]"
              )}
            >
              {/* Status badge */}
              <div
                className={clsx(
                  "absolute top-4 right-4 px-2 py-0.5 border rounded font-mono font-semibold text-xs shadow-sm",
                  statusColor[entry.status] || "bg-gray-100 border-gray-300 text-gray-700"
                )}
              >
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </div>
              {/* "Cover" colored shape */}
              <div className="flex justify-center mb-2">
                <div
                  className={clsx(
                    entry.cover.color,
                    "w-16 h-24 rounded-lg flex items-center justify-center shadow-inner border border-neutral-200"
                  )}
                >
                  <span className="font-mono font-bold text-xl text-neutral-600 select-none">
                    {entry.cover.code}
                  </span>
                </div>
              </div>
              {/* Title */}
              <div className="font-bold text-lg text-center text-neutral-700 mb-0.5">{entry.title}</div>
              {/* Month */}
              <div className="mb-3 text-neutral-400 font-mono text-xs tracking-wide text-center">{entry.month}</div>
              {/* Metadata */}
              <div className="mt-auto flex flex-col gap-0.5 text-[0.97rem]">
                <div className="flex justify-between text-neutral-500">
                  <span className="font-mono text-neutral-400">Genre</span>
                  <span>{entry.genre}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span className="font-mono text-neutral-400">Released</span>
                  <span>{entry.released}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span className="font-mono text-neutral-400">Pages</span>
                  <span>{entry.pages}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span className="font-mono text-neutral-400">Format</span>
                  <span>{entry.format}</span>
                </div>
              </div>
            </div>
          ))}
          {/* Fill up 12 months if less entries: empty boxes */}
          {Array.from({ length: 12 - bookshelfEntries.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex flex-col items-center justify-center bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl shadow-inner min-h-[310px]"
            >
              <div className="font-mono text-xs text-neutral-200">No entry</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}