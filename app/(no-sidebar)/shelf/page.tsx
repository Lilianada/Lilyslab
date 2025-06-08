"use client";

import React from "react";
import clsx from "clsx";

// 6 ASCII arts for demonstration (book, tree, cat, coffee, lamp, house)
const asciiArts = [
  // Book
  `
   _______
  /      //
 /      //
/______//
(______(/
  `,
  // Tree
  `
   &&& &&  & &&
  && &\\/&\\|& ()|/ @, &&
  &\\/(/&/&||/& /_/)_&/_&
&() &\\/&|()|/&\\/ '%" & ()
&_\\_&&_\\ |& |&&/&__%_/_& &&
&&   && & &| &| /& & % ()& /&&
 ()&_---()&\\&\\|&&-&&--%---()~
     &&     \\|||
             |||
             |||
             |||
       , -=-~  .-^- _`,
  // Cat
  `
 /\\_/\\  
( o.o ) 
 > ^ < 
  `,
  // Coffee
  `
   ( (
    ) )
  ........
  |      |]
  \\      /
   '----'
  `,
  // Lamp
  `
    |
   /|\\
  /_|_\\
    |
   / \\
  `,
  // House
  `
   /\\
  /  \\
 /----\\
[______]
 |    |
 |[]  |
 |    |
  `
];

// Example bookshelf data for entries
const bookshelfEntries = [
  {
    month: "January",
    title: "How to Stay Motivated",
    genre: "self-help",
    released: 2021,
    pages: 223,
    format: "paperback",
    status: "finished",
    ascii: 0,
  },
  {
    month: "February",
    title: "The Quiet Programmer",
    genre: "memoir",
    released: 2023,
    pages: 188,
    format: "ebook",
    status: "finished",
    ascii: 1,
  },
  {
    month: "March",
    title: "Gardens of Code",
    genre: "fiction",
    released: 2022,
    pages: 320,
    format: "paperback",
    status: "finished",
    ascii: 2,
  },
  {
    month: "April",
    title: "Coffee Break Algorithms",
    genre: "nonfiction",
    released: 2023,
    pages: 141,
    format: "paperback",
    status: "favorite",
    ascii: 3,
  },
  {
    month: "May",
    title: "Lamp Light Reading",
    genre: "fantasy",
    released: 2019,
    pages: 409,
    format: "paperback",
    status: "finished",
    ascii: 4,
  },
  {
    month: "June",
    title: "Home is a Feeling",
    genre: "fiction",
    released: 2024,
    pages: 251,
    format: "ebook",
    status: "favorite",
    ascii: 5,
  },
];

// Status color mapping
const statusColor: Record<string, string> = {
  finished: "bg-green-200 text-green-800 border-green-400",
  favorite: "bg-yellow-200 text-yellow-900 border-yellow-400",
};

export default function BookshelfPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-8 flex justify-center items-center">
      <div className="bg-[#f8f6f6] rounded-xl shadow-xl border-4 border-[#dccfc2] w-full max-w-5xl p-8 flex flex-col">
        <div className="flex justify-between mb-6">
          <div className="font-serif text-xl font-bold text-[#6d5d51]">Monthly favorites</div>
          <div className="font-mono text-md text-[#9e8c7a]">2024</div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {bookshelfEntries.map((entry, i) => (
            <div
              key={entry.month}
              className={clsx(
                "flex flex-col items-center bg-white border-2 border-[#e0d2c2] rounded-lg shadow-sm pb-2 pt-2 px-2 relative overflow-hidden"
              )}
              style={{ minHeight: 320 }}
            >
              {/* Month */}
              <div className="font-mono text-xs text-[#c0b0a0] mb-1">{entry.month}</div>
              {/* ASCII Art */}
              <pre className="w-full flex-1 text-xs font-mono text-[#8d7a63] bg-[#f9f7f4] rounded p-2 mb-2 text-center leading-4 overflow-x-auto" style={{ minHeight: 92 }}>
                {asciiArts[entry.ascii]}
              </pre>
              {/* Title */}
              <div className="font-semibold text-sm text-center mb-1 text-[#765d47]">{entry.title}</div>
              {/* Status banner */}
              <div
                className={clsx(
                  "absolute top-3 -right-8 px-6 py-0.5 rotate-45 border text-xs font-mono font-bold shadow",
                  statusColor[entry.status] || "bg-gray-200 text-gray-700 border-gray-400"
                )}
              >
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </div>
              {/* Details */}
              <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[0.76rem] text-[#b49c7a]">
                <div className="col-span-2">
                  <span className="font-bold text-[#b77b3e]">Genre:</span> {entry.genre}
                </div>
                <div>
                  <span className="font-bold text-[#b77b3e]">Released:</span> {entry.released}
                </div>
                <div>
                  <span className="font-bold text-[#b77b3e]">Pages:</span> {entry.pages}
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-[#b77b3e]">Format:</span> {entry.format}
                </div>
              </div>
            </div>
          ))}
          {/* Fill up 12 months if less entries: empty boxes */}
          {Array.from({ length: 12 - bookshelfEntries.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex flex-col items-center justify-center bg-[#f7f4ef] border-2 border-dashed border-[#e0d2c2] rounded-lg shadow-inner min-h-[320px]"
            >
              <div className="font-mono text-xs text-[#e0d2c2]">No entry</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}