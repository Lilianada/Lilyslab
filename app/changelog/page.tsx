import React from "react";
import ChangelogTimeline, { ChangelogEntry } from "@/components/changelog/ChangelogTimeline";

const changelogs: ChangelogEntry[] = [
  {
    version: "3.3.0",
    title: "✍️ Blog",
    date: "2025-04-10T22:00",
    type: "feature",
    body: `Excited to finally launch my blog! I've created a dedicated space where I can share longer-form and insights about topics I'm passionate about. Unlike my Digital Garden which contains evolving notes, the blog features more polished, complete articles that I've spent time refining.`,
  },
  {
    version: "3.2.0",
    title: "📷 365 project",
    date: "2025-01-21T16:00",
    type: "feature",
    body: `Another Section! I’m capturing and sharing one photo each day for a year. And share them on a new subpage on this website.`,
  },
  {
    version: "3.1.0",
    title: "🌿 Digital Garden",
    date: "2025-01-01T10:00",
    type: "improvement",
    body: `New Section! My Digital Garden is an evolving collection of thoughts, ideas, and knowledge, dynamically synced straight from my Obsidian vault. It's a space for curiosity and exploration—a living archive of topics I’m passionate about. This seamless integration ensures the notes stay up-to-date, reflecting my ever-changing interests. Dive in and see what’s growing!`,
  },
  {
    version: "3.0.0",
    title: "🧑‍🚀 Astro and new layout",
    date: "2024-07-04T18:00",
    type: "improvement",
    body: `Rebuilt with Astro.js - and you know what? I really enjoyed the development experience! This update brings a fresh layout, new content-focused structure, and cute little interactions that make the site uniquely personal. It's now easier for me to add new content, ensuring a more dynamic and engaging experience for visitors. Explore and enjoy the revamped site!`,
  },
  {
    version: "2.2.0",
    title: "🌈 Themes",
    date: "2023-04-23T12:00",
    type: "feature",
    body: `I couldn’t decide if I prefer a blue or gray background for my personal website. The solution: a theme switcher!`,
  },
  {
    version: "2.1.0",
    title: "🔖 Bookmark page",
    date: "2023-02-24T11:00",
    type: "feature",
    body: `I have added a new page to the website, where all the articles, websites, videos, and other things I have bookmarked are listed. The data is automatically updated from my Raindrop.io account.`,
  },
  {
    version: "2.0.0",
    title: "💅 New layout",
    date: "2023-01-31T13:30",
    type: "improvement",
    body: `New layout! The navigation has moved from the top to the right side of the website and was supplemented with a collidable sidebar. There is also a dark-mode, so you don't have to wear sunglasses at night anymore.`,
  },
  {
    version: "1.2.0",
    title: "📚 Literal integration",
    date: "2022-12-19T17:30",
    type: "improvement",
    body: `The data for my reading list is now coming directly from the wonderful platform literal.club, as I was clearly too lazy to maintain my reading stats on Notion.`,
  },
  {
    version: "1.1.0",
    title: "🎸 Add music overview",
    date: "2022-06-26T17:06",
    type: "feature",
    body: `In addition to an overview of the books I've read, there is now also an overview of my favorite music under the media tab. The data comes directly from my Spotify account and updates automatically when I add a new favorite album.`,
  },
  {
    version: "1.0.0",
    title: "🚀 Hello world",
    date: "2022-06-19T19:30",
    type: "feature",
    body: `This website went live! It contains all the basic functions that I have planned for the first release: an overview of my side projects, a reading list and a gallery of my photos. The Data for the reading list and photo gallery is based on Notion. The page can be navigated via a command bar and contains a dark theme.`,
  },
  {
    version: "0.0.0",
    title: "👨🏼‍💻 Initial commit",
    date: "2022-03-17T18:30",
    type: "feature",
    body: `The idea to build a website with a larger personal reference is born and the rough project structure based on next.js, typescript and tailwind is set up.`,
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
      <h1 className="text-2xl font-medium mb-10">Changelog</h1>
      <ChangelogTimeline entries={changelogs} />
    </div>
  );
}
