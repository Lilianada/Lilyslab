"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import { Globe, Code2, Paintbrush, BookOpen, ChevronLeft, TriangleAlert, Github } from "lucide-react";

export default function Colophon() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium tracking-tight">Colophon</h1>
        <p className="text-sm text-muted-foreground mb-6">The tools, technologies, and inspirations behind this website.</p>
      </header>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Code2 size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Technology</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { name: "Next.js", url: "https://nextjs.org/", desc: "React framework with App Router for server and client components" },
            { name: "TypeScript", url: "https://www.typescriptlang.org/", desc: "Strongly typed JavaScript for better developer experience" },
            { name: "Tailwind CSS", url: "https://tailwindcss.com/", desc: "Utility-first CSS framework for rapid UI development" },
            { name: "shadcn/ui", url: "https://ui.shadcn.com/", desc: "Beautifully designed components built with Radix UI and Tailwind CSS" },
            { name: "Firebase", url: "https://firebase.google.com/", desc: "User management and authentication" },
            { name: "Notion", url: "https://www.notion.so/", desc: "Flexible workspace and CMS for notes, content, and data" },
            { name: "Obsidian", url: "https://obsidian.md/", desc: "Markdown-based knowledge base and CMS for personal content" },
            { name: "Vercel AI SDK", url: "https://sdk.vercel.ai/", desc: "The AI Toolkit for building AI-powered features and applications" }
          ].map((tech) => (
            <a
              key={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border rounded bg-background p-4 relative block hover:shadow-lg transition-shadow"
            >
              <div className="font-medium flex items-center justify-between">
                <span>{tech.name}</span>
                <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-extra-peach" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12L12 4M12 4H5.6M12 4V10.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{tech.desc}</div>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Inspiration</h2>
        </div>
        <div className="text-sm mb-2 text-muted-foreground">Stole code and designs from these amazing creators:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded bg-background p-4">
          {[
            { name: "Brian Lovin", url: "https://brianlovin.com" },
            { name: "Oluwafemi Soetan", url: "https://beingfemi.com" },
            { name: "Junaid Anjum", url: "https://junaidanjum.com" },
            { name: "Robin Spielmann", url: "https://iamrob.in" },
            { name: "Digital Minimalist", url: "https://digitalminimalist.com" },
            { name: "Jordan Singer", url: "https://ibuildmyideas.com" },
            { name: "Armond", url: "https://armond.me" },
            { name: "Linus Rogge", url: "https://linusrogge.com" },
            { name: "Pranathi Peri", url: "https://pranathiperi.com" },
            { name: "Zaid Mukaddam", url: "https://zaidmukaddam.com/" },
            { name: "Mason Watson", url: "https://mw.works/" },
            { name: "Nicole van der Hoeven", url: "https://nicolevanderhoeven.com/about" },
            
          ].map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline underline-offset-2 text-sm font-normal hover:text-extra-peach transition-colors"
            >
              <svg width="8" height="8" viewBox="0 0 16 16" fill="none" className="text-extra-peach mr-1" style={{ minWidth: 8, minHeight: 8 }} xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8L6.5 12.5L14 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {site.name}
            </a>
          ))}
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Paintbrush size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Design Details</h2>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          My design philosophy is rooted in clarity, warmth, and playfulness. The interface uses a custom palette of soft neutrals and gentle accent colors, inspired by vintage books and cozy workspaces.<br /><br />
          Typography is set with Geist Sans and Geist Mono for a clean, modern yet approachable feel. Spacing is generous, and every component is hand-crafted for both accessibility and visual delight.<br /><br />
          Interactive elements feature subtle motion, tactile feedback, and playful details—like cross markers and animated underlines—without ever sacrificing usability.<br /><br />
          Every UI piece is custom-built for this site, with performance and simplicity at the core. The design is meant to invite curiosity and make every visit a little more delightful.
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Color Palette</h2>
        </div>
        <div className="flex flex-wrap gap-4 items-end mb-2">
          {/* Site palette */}
          {[
            { name: 'background', var: 'var(--background)' },
            { name: 'popover', var: 'var(--popover)' },
            { name: 'card', var: 'var(--card)' },
            { name: 'accent', var: 'var(--accent)' },
            { name: 'muted', var: 'var(--muted)' },
            { name: 'border', var: 'var(--border)' },
            { name: 'foreground', var: 'var(--foreground)' },
          ].map((color) => (
            <div key={color.name} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border" style={{ background: `hsl(${color.var})` }} />
              <span className="text-[10px] mt-1 text-muted-foreground font-mono">{color.name}</span>
            </div>
          ))}
        </div>
        {/* Bookshelf palette */}
        <div className="flex flex-wrap gap-4 items-end mb-2 mt-3">
          {[
            { name: 'Cream', var: 'var(--extra-cream)' },
            { name: 'PaleYellow', var: 'var(--extra-paleYellow)' },
            { name: 'Yellow', var: 'var(--extra-yellow)' },
            { name: 'Blue', var: 'var(--extra-Blue)' },
            { name: 'SteelBlue', var: 'var(--extra-steelBlue)' },
            { name: 'Lavender', var: 'var(--extra-lavender)' },
            { name: 'Primary', var: 'var(--primary)' },
            { name: 'Lilac', var: 'var(--extra-lilac)' },
            { name: 'Pink', var: 'var(--extra-pink)' },
            { name: 'Peach', var: 'var(--extra-peach)' },
            { name: 'Green', var: 'var(--extra-green)' },
          ].map((color) => (
            <div key={`extra-${color.name}`} className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 shadow"
                style={{ background: `hsl(${color.var})` }}
              />
              <span className="text-[10px] mt-1 font-mono">{color.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Typography</h2>
        </div>
        <div className="grid gap-3 border rounded bg-background p-4">
          <div className="">
            <div className="font-semibold">Geist Sans (Head)</div>
            <div className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>
          <div className="">
            <div className="font-semibold">Geist Sans (Body)</div>
            <div className="text-base" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>
          <div className="">
            <div className="font-semibold">Geist Mono (Code)</div>
            <div className="text-base" style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}>
              const example = "Hello World";
            </div>
          </div>
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Github size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Personal Space</h2>
        </div>
        <div className="border rounded bg-background p-4 mb-2 text-sm">
          This site is my creative lab—a place to build, tinker, and share ideas in progress. Everything here is shaped by personal curiosity and experimentation. The codebase is private, reflecting the evolving and individual nature of this space.
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <TriangleAlert size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Deployment</h2>
          <span className="ml-2 px-2 py-0.5 rounded bg-muted text-xs">Vercel</span>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Deployments are powered by <a href="https://vercel.com/" className="underline">Vercel</a>, making updates seamless and fast. Every push creates a fresh version, so improvements and fixes reach visitors quickly.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Performance</div>
            <div className="text-xs text-muted-foreground">Built for speed and reliability, with static and dynamic content served globally for a smooth user experience.</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Analytics</div>
            <div className="text-xs text-muted-foreground">Lightweight, privacy-friendly analytics provide insight into site usage—no cookies, no tracking of personal data.</div>
          </div>
        </div>
      </section>
      <section className="mb-10">
        <blockquote className="border-l-4 border-muted pl-4 italic text-sm text-muted-foreground">
          <span className="block mb-2">“Growth happens at the edge of comfort. This site is a record of my experiments, mistakes, and learning in public.”</span>
          <span className="not-italic font-mono text-xs">— Lily</span>
        </blockquote>
      </section>
    </div>
  );
}
