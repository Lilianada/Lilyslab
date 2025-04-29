"use client";

import React from 'react';
import { CheckSquare, Square, Circle } from 'lucide-react'; // Using icons for checkboxes

// Mock Data (assuming this structure is correct)
const dailyLogData = {
  sections: [
    {
      title: "Mini App",
      items: [
        { text: "2025-02-28 MVP", link: "https://mini.lilyslab.xyz/", tag: "#web-app" },
        {
          text: "What's one thing top of mind today?",
          subItems: ["it's going to rain, get some sun early in the day"],
        },
        {
          text: "What would make today great?",
          subItems: ["Hulk theme bought by Bill Gates for 1 Billion dollars"],
        },
        {
          text: "What's the One Thing I need to get done today?",
          linkText: "One Thing",
          link: "#",
          subItems: ["snip-a-note screenshot"],
        },
      ],
    },
    {
      title: "Calculator",
      items: [
        { text: "2 hours focused time on Top Secret Project 90210" },
        { text: "Read 30 minutes", linkText: "Read", link: "#" },
      ],
    },
    {
      title: "Note Widget",
      items: [
        { text: "30 minutes outside", checked: true },
        { text: "10 minutes meditation", checked: false },
        { text: "Workout or run", checked: false },
        { text: "Read for pleasure, watch something, go for a walk", checked: true, linkText: "Read", link: "#" },
      ],
    },
    {
      title: "GetRoastedOnline",
      items: [
        { text: "The best thing that happened today", linkText: "The best thing that happened today", link: "#" },
        { text: "How could I have made today even better?", tag: "#habit" },
        { text: "List three things I'm grateful for", tag: "#gratitude" },
        { text: "What made me happy today?" },
        { text: "What made me sad?" },
        { text: "How has Resistance shown up today? The War of Art", linkText: "The War of Art", link: "#" },
        { text: "Where there any signs of my day going to shit that I could recognize?" },
        { text: "What did I read / watch ?", linkText: "read / watch", link: "#" },
        { text: "What am I looking forward to?" },
        { text: "Things to remember" },
      ],
    },
    {
      title: "VentRoom",
      items: [
        { text: "How did I help someone today?" },
        { text: "What did I learn?" },
        { text: "What did I do to help my future?" },
        { text: "How can I make tomorrow better?" },
        { text: "How is my girlfriend amazing?" },
        { text: "What am I grateful for?" },
      ],
    },
  ],
  footer: {
    tags: ["#daily", "#agenda"],
    lastUpdated: [
      { text: "2020-08-18 Monthly Log",  },
    ],
  },
};

// Helper to render list items remains largely the same but uses theme colors
const renderListItem = (item: any, index: number) => {
  const bulletColor = "text-blue-500 dark:text-blue-400"; // Adjusted for theme

  // Split text around the link if linkText is provided
  let textBeforeLink = item.text;
  let linkText = '';
  let textAfterLink = '';

  if (item.linkText && item.text.includes(item.linkText)) {
    const parts = item.text.split(item.linkText);
    textBeforeLink = parts[0];
    linkText = item.linkText;
    textAfterLink = parts[1] || '';
  }

  return (
    <li key={index} className="mb-1 flex flex-col">
      <div className="flex items-start">
        {/* Checkbox or Bullet */}
        {item.hasOwnProperty('checked') ? (
          item.checked ? (
            <CheckSquare size={16} className="mr-2 mt-[3px] text-green-600 dark:text-green-400 flex-shrink-0" aria-label="Checked" />
          ) : (
            <Square size={16} className="mr-2 mt-[3px] text-muted-foreground flex-shrink-0" aria-label="Unchecked" />
          )
        ) : (
          <span className={`mr-2 mt-[6px] text-xs  flex-shrink-0`} aria-hidden="true"> <Circle className="w-2 h-2" /> </span>
        )}

        {/* Text Content */}
        <span className="flex-1 break-words text-foreground text-sm">
          {item.link && linkText ? (
            <>
              {textBeforeLink}
              <a href={item.link} className="text-green-600 dark:text-green-400 underline" aria-label={linkText}>
                {linkText}
              </a>
              {textAfterLink}
            </>
          ) : item.link ? ( // Handle cases where the whole text might be a link (fallback)
            <a href={item.link} className="text-green-600 dark:text-green-400 underline" aria-label={item.text}>
              {item.text}
            </a>
          ) : (
            item.text // Just plain text
          )}
          {/* Tag */}
          {item.tag && <span className="ml-2 text-blue-500 dark:text-blue-400">{item.tag}</span>}
        </span>
      </div>

      {/* Sub Items */}
      {item.subItems && item.subItems.length > 0 && (
        <ul className="ml-6 mt-1 list-none"> {/* Indentation for sub-items */}
          {item.subItems.map((subItem: string, subIndex: number) => (
            <li key={subIndex} className="mb-1 flex items-start text-xs">
              <span className="mr-2 mt-[6px] text-xs text-muted-foreground flex-shrink-0" aria-hidden="true"> <Square fill='#0f0e0e' className="w-2 h-2" /> </span> {/* Square bullet */}
              <span className="break-words text-foreground">{subItem}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};


export default function DailyLogPage() {
  return (

    <div className="min-h-screen text-foreground sm:p-8 ">
      <div className="max-w-2xl mx-auto sm:p-6">
        {/* Main Heading - Using theme colors */}
        <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Project Logs</h1>
        <p className="text-sm text-zinc-500">A build log of all my new projects.</p>
      </header>

        {/* Sections */}
        {dailyLogData.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-base font-semibold text-primary mb-3 flex items-center">
              <span className="mr-2 h-3 w-3 rounded-full bg-extra-yellow"></span> {/* Bullet for section title */}
              {section.title}
            </h3>
            <ul className="ml-2  border-l border-border pl-4"> {/* Indentation for section items */}
              {section.items.map(renderListItem)}
            </ul>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border text-sm text-gray-400">
          <div className="mb-2">
            <span className="font-semibold mr-2">tags:</span>
            {dailyLogData.footer.tags.map((tag, i) => (
              <a key={i} href="#" className="text-blue-400 hover:underline mr-2">
                {tag}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">last updated:</span>
            {dailyLogData.footer.lastUpdated.map((text, i) => (
              <React.Fragment key={i}>
                <p className="text-neutral-300 hover:underline">
                  {text.text}
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 