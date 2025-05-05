"use client"

import { Footer } from "@/components/footer"
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
        <figure className="space-y-2 mb-6">
          <img src="/about2.jpeg" alt="A beautiful arrangement of lilies" className="rounded-lg shadow-md h-[500px] object-cover" />
          <figcaption className="text-center text-sm text-muted-foreground mt-2">lilies</figcaption>
        </figure>
        <p className="text-sm leading-normal mb-6">Hi! I’m Lily, a digital creator, lifestyle connoisseur, design enthusiast, passionate technologist, digital gardener, and lifelong learner. I love exploring knowledge management, creative coding, frontend design, and sharing what I learn with others. This site is my digital home for projects, notes, experiments, and inspiration. <br />Welcome!</p>
        <h2 className="text-lg mb-2 font-medium tracking-tight text-foreground">This site</h2>
        <p className="text-base leading-normal mb-6">Here’s what you can find here, and how it all fits together:</p>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Main</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li className="text-sm">Home: The landing page with an overview of the site.</li>
            <li className="text-sm">About: Learn more about me and the purpose of this site.</li>
            <li className="text-sm">Writing: Blog posts and articles on technology, design, and life.</li>
            <li className="text-sm">Now: What I’m currently working on and planning.</li>
            <li className="text-sm">Stack: Tools, frameworks, and technologies I use.</li>
            <li className="text-sm">AMA: Ask Me Anything — submit questions for public answers.</li>
          </ul>
        </div>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Digital Garden</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li className="text-sm">Bucket List: Goals, aspirations, and target companies.</li>
            <li className="text-sm">Bookshelf: Books I’m reading, have read, or plan to read.</li>
            <li className="text-sm">Bookmarks: Curated links and resources.</li>
            <li className="text-sm">Catalog: Visual catalog of projects and media.</li>
            <li className="text-sm">Notes: Collection of my notes and research.</li>
            <li className="text-sm">Drafts: Work-in-progress ideas and explorations.</li>
          </ul>
        </div>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Workshop</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li className="text-sm">Projects: Professional and personal projects showcase.</li>
            <li className="text-sm">Logs: Process logs for experiments and engineering.</li>
            <li className="text-sm">Tools: Custom utilities and tool demos.</li>
            <li className="text-sm">Resources: Guides, templates, and references.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Playground</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li className="text-sm">Calculator App: Interactive calculator demo.</li>
            <li className="text-sm">Note Widgets: Small interactive note-taking widgets.</li>
          </ul>
        </div>

        <div>

          <h3 className="text-base mb-2 font-medium tracking-tight text-foreground">Utility</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li className="text-sm">Colophon: Site credits and technologies used.</li>
            <li className="text-sm">Changelog: Recent updates and changes.</li>
          </ul>
          <p className="text-sm leading-normal mb-6">This site is built as a digital garden—always evolving, never truly finished.</p>
        </div>

        <Footer 
          inspirationName="Nicole"
          inspirationUrl="https://nicolevanderhoeven.com/about"
          color="text-extra-green"
        />
      </div>
      </div>
    </>
  );
}
