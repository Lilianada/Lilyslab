"use client";
import React from "react";

const suggestions = [
  "Reflect on a small win",
  "Write a two-line journal entry",
  "Practice gratitude",
  "Read a page from a book",
  "Go for a walk",
  "Draw a doodle",
  "Meditate for 5 minutes",
  "Try a new recipe",
  "Compliment someone",
  "Write one line of code",
  "Take a deep breath",
  "Listen to a song you love",
  "Learn a new word",
  "Share a smile",
  "Declutter a spot",
  "Drink water",
  "Sketch your surroundings",
  "Plan tomorrow",
  "Try a new app",
  "Make a wish",
  // ...repeat or shuffle, or generate new ideas as needed
];

// Helper to get a suggestion for each day (repeat if < 365)
function getSuggestion(day: number) {
  return suggestions[day % suggestions.length];
}

export default function Days365Page() {
  // 365 days
  const days = Array.from({ length: 365 }, (_, i) => i + 1);

  return (
    <div className="w-screen h-screen bg-neutral-100 flex flex-col items-center justify-center">
      <h1 className="mb-4 font-bold text-2xl text-neutral-600">365 Days Challenge</h1>
      <div className="w-full h-full flex-1 flex items-center justify-center">
        <div
          className="grid w-full h-full"
          style={{
            // 365 = 19 x 20 grid (380, a few extra blank boxes)
            gridTemplateColumns: "repeat(19, 1fr)",
            gridTemplateRows: "repeat(20, 1fr)",
            gap: "2px",
            maxWidth: "98vw",
            maxHeight: "80vh",
          }}
        >
          {days.map((day, idx) => (
            <div
              key={day}
              className="bg-white rounded shadow-sm border border-neutral-200 flex items-center justify-center text-xs font-mono cursor-pointer hover:bg-siteYellow-100 hover:border-siteYellow-400 transition group"
              title={`Day ${day}: ${getSuggestion(day - 1)}`}
            >
              <span className="text-neutral-400 group-hover:text-siteYellow-700 select-none">{day}</span>
            </div>
          ))}
          {/* Fill any remaining boxes to complete the grid layout */}
          {Array.from({ length: 19 * 20 - days.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-neutral-50 rounded border border-neutral-100" />
          ))}
        </div>
      </div>
      <div className="mt-4 text-xs text-neutral-400 text-center max-w-xl">
        Each day, click a box and complete a tiny prompt: track a mood, write a memory, check a habit, or just enjoy a small daily challenge!<br />
        <span className="italic">Tip: Hover a box for a suggestion.</span>
      </div>
    </div>
  );
}