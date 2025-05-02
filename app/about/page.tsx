"use client"

import { Separator } from "@/components/ui/separator";
import { ScrollProgress } from "@/components/ui/scroll-progress";

// Removed dynamic MDX import for static About content

export default function AboutPage() {
  return (
    <>
      <ScrollProgress 
        color="bg-extra-green" 
        height={3} 
        glow={true}
        glowColor="rgba(var(--extra-green), 0.6)"
        glowIntensity="12px"
      />
      <div className="max-w-3xl mx-auto md:px-6 py-12 animate-fade-in">
        <header className="mb-8">
        <h1 className="mb-2 text-2xl font-medium">About me</h1>
        <p className="text-xs text-extra-green">Last updated: April 30, 2025</p>
      </header>
      <div className="space-y-4 max-w-none text-justify">
        <p className="text-sm leading-normal mb-6">Hi! I’m Lily, a digital creator, lifestyle connoisseur, design enthusiast, passionate technologist, digital gardener, and lifelong learner. I love exploring knowledge management, creative coding, frontend design, and sharing what I learn with others. This site is my digital home for projects, notes, experiments, and inspiration. <br />Welcome!</p>
        <figure className="space-y-2 mb-6">
          <img src="/about2.jpeg" alt="A beautiful arrangement of lilies" className="rounded-lg shadow-md h-[500px] object-cover" />
          <figcaption className="text-center text-sm text-muted-foreground mt-2">lilies</figcaption>
        </figure>
        <h2 className="text-lg mb-2 font-medium tracking-tight text-foreground">This site</h2>
        <p className="text-base leading-normal mb-6">Here’s what you can find here, and how it all fits together:</p>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Main</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Home: The landing page with an overview of the site.</li>
            <li>About: Learn more about me and the purpose of this site.</li>
            <li>Writing: Blog posts and articles on technology, design, and life.</li>
            <li>Now: What I’m currently working on and planning.</li>
            <li>Stack: Tools, frameworks, and technologies I use.</li>
            <li>AMA: Ask Me Anything — submit questions for public answers.</li>
          </ul>
        </div>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Digital Garden</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Bucket List: Goals, aspirations, and target companies.</li>
            <li>Bookshelf: Books I’m reading, have read, or plan to read.</li>
            <li>Bookmarks: Curated links and resources.</li>
            <li>Catalog: Visual catalog of projects and media.</li>
            <li>Notes: Collection of my notes and research.</li>
            <li>Drafts: Work-in-progress ideas and explorations.</li>
          </ul>
        </div>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Workshop</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Projects: Professional and personal projects showcase.</li>
            <li>Logs: Process logs for experiments and engineering.</li>
            <li>Tools: Custom utilities and tool demos.</li>
            <li>Resources: Guides, templates, and references.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Playground</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Calculator App: Interactive calculator demo.</li>
            <li>Note Widgets: Small interactive note-taking widgets.</li>
          </ul>
        </div>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Utility</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Colophon: Site credits and technologies used.</li>
            <li>Changelog: Recent updates and changes.</li>
          </ul>
          <p className="text-sm leading-normal mb-6">This site is built as a digital garden—always evolving, never truly finished.</p>
        </div>

        <Separator />

        <p className="text-sm text-muted-foreground/60 mt-8">Credit to <a href="https://nicolevanderhoeven.com/about" className="text-extra-green hover:underline" target="_blank" rel="noopener noreferrer">Nicole</a> for the design and inspiration behind this page. Find me elsewhere on <a href="https://twitter.com/lilian_okeke" className="text-extra-green hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a>, <a href="https://github.com/lilianokeke" className="text-extra-green hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>, and <a href="https://linkedin.com/in/lilianada" className="text-extra-green hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>. Email me at <a href="mailto:lilianokeke.ca@gmail.com" className="text-extra-green hover:underline">lilianokeke.ca@gmail.com</a>, especially about this site, vibe coding, lifestyle, design, productivity, and finding hidden talent. This site was designed in 2025. View my portfolio site <a href="https://lilianada.com" className="text-extra-green hover:underline" target="_blank" rel="noopener noreferrer">here</a>.</p>

      </div>
      </div>
    </>
  );
}
