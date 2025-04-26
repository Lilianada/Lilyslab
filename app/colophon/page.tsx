"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import { Globe, Code2, Paintbrush, BookOpen, ChevronLeft, TriangleAlert, Github } from "lucide-react";

export default function Colophon() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in">
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
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Next.js</div>
            <div className="text-xs text-muted-foreground">React framework with App Router for server and client components</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">TypeScript</div>
            <div className="text-xs text-muted-foreground">Strongly typed JavaScript for better developer experience</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Tailwind CSS</div>
            <div className="text-xs text-muted-foreground">Utility-first CSS framework for rapid UI development</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Custom Components</div>
            <div className="text-xs text-muted-foreground">Hand-crafted UI components built specifically for this site</div>
          </div>
          {/* <div className="border rounded bg-background p-4">
            <div className="font-semibold">Basehub</div>
            <div className="text-xs text-muted-foreground">Modern headless CMS for structured content management</div>
          </div> */}
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Notion</div>
            <div className="text-xs text-muted-foreground">Flexible workspace and CMS for notes, content, and data</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Obsidian</div>
            <div className="text-xs text-muted-foreground">Markdown-based knowledge base and CMS for personal content</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Vercel AI SDK</div>
            <div className="text-xs text-muted-foreground">The AI Toolkit for building AI-powered features and applications</div>
          </div>
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Inspiration</h2>
        </div>
        <div className="text-sm mb-2 text-muted-foreground">Stole code and designs from these amazing creators:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded bg-background p-4">
          <a className="underline underline-offset-2 text-xs" href="https://brianlovin.com" target="_blank" rel="noopener noreferrer">Brian Lovin</a>
          <a className="underline underline-offset-2 text-xs" href="https://beingfemi.com" target="_blank" rel="noopener noreferrer">Being Femi</a>
          <a className="underline underline-offset-2 text-xs" href="https://junaidanjum.com" target="_blank" rel="noopener noreferrer">junaidanjum.com</a>
          <a className="underline underline-offset-2 text-xs" href="https://iamrob.in" target="_blank" rel="noopener noreferrer">iamrob.in</a>
          <a className="underline underline-offset-2 text-xs" href="https://digitalminimalist.com" target="_blank" rel="noopener noreferrer">Digital Minimalist</a>
          <a className="underline underline-offset-2 text-xs" href="https://ibuildmyideas.com" target="_blank" rel="noopener noreferrer">ibuildmyideas.com</a>
          <a className="underline underline-offset-2 text-xs" href="https://armond.me" target="_blank" rel="noopener noreferrer">Armond</a>
          <a className="underline underline-offset-2 text-xs" href="https://linusrogge.com" target="_blank" rel="noopener noreferrer">Linus Rogge</a>
          <a className="underline underline-offset-2 text-xs" href="https://pranathiperi.com" target="_blank" rel="noopener noreferrer">pranathiperi.com</a>
          <a className="underline underline-offset-2 text-xs" href="https://zaidmukaddam.com/" target="_blank" rel="noopener noreferrer">Zaid Mukaddam</a>
          <a className="underline underline-offset-2 text-xs" href="https://mw.works/" target="_blank" rel="noopener noreferrer">Mason Watson</a>
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Paintbrush size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Design Details</h2>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          The design emphasizes minimalism, typography, and subtle interactions. The color palette uses muted neutral tones with careful attention to contrast and readability.<br /><br />
          Interactive elements feature subtle cross markers and underlines, providing feedback without overwhelming the clean aesthetic. The site aims to be both accessible and visually interesting.<br /><br />
          Fonts used are <a href="https://vercel.com/font/mono" className="underline">Geist Mono</a> by Vercel, selected for its clean, modern appearance and excellent readability at small sizes.<br /><br />
          All UI components are custom-built with a focus on simplicity and performance, without relying on component libraries.
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
            { name: 'Cream', var: 'var(--extra-accentCream)' },
            { name: 'PaleYellow', var: 'var(--extra-accentPaleYellow)' },
            { name: 'Yellow', var: 'var(--extra-accentYellow)' },
            { name: 'Blue', var: 'var(--extra-accentBlue)' },
            { name: 'SteelBlue', var: 'var(--extra-accentSteelBlue)' },
            { name: 'Lavender', var: 'var(--extra-accentLavender)' },
            { name: 'Primary', var: 'var(--primary)' },
            { name: 'Lilac', var: 'var(--extra-accentLilac)' },
            { name: 'Pink', var: 'var(--extra-accentPink)' },
            { name: 'Peach', var: 'var(--extra-accentPeach)' },
            { name: 'Green', var: 'var(--extra-accentGreen)' },
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

//       <div>
//         <h2 className="text-base font-medium mb-2 text-accent-foreground">About Site</h2>
//         <p className="text-sm leading-relaxed text-muted-foreground">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
//         </p>
//       </div>

//       <div>
//         <h2 className="text-base font-medium mb-2 text-accent-foreground">Typography</h2>
//         <div className="flex flex-col items-start gap-2">
//           <div className="w-72 h-40 bg-muted flex items-center justify-center rounded shadow overflow-hidden">
//             <Image
//               src="/Noise.png"
//               alt="Font sample"
//               width={300}
//               height={200}
//               className="object-contain max-w-full h-auto block"
//               style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
//             />
//           </div>
//           <figcaption className="text-xs text-muted-foreground mt-1">Font Name (placeholder)</figcaption>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-base font-medium mb-2 text-accent-foreground">Photography</h2>
//         <p className="text-sm leading-relaxed text-muted-foreground">
//           All images were taken or created by Lilian, if not stated otherwise.
//         </p>
//       </div>

//       <div>
//         <h2 className="text-base font-medium mb-2 text-accent-foreground">Technicalities</h2>
//         <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
//           <li>Built with <span className="font-medium text-foreground">Next.js</span> & <span className="font-medium text-foreground">Tailwind CSS</span>.</li>
//           <li>Notion for Content: All notes and essays are written in Notion, allowing for the integration of custom components and interactive elements within markdown.</li>
//           <li>Hosting & Deployment: The site is hosted on <span className="font-medium text-foreground">Vercel</span>.</li>
//           <li>Animations: Primarily handled with CSS, with more complex animations implemented using <span className="font-medium text-foreground">Framer Motion</span>.</li>
//         </ul>
//       </div>

//       <div>
//         <h2 className="text-base font-medium mb-2 text-accent-foreground">Quotes</h2>
//         <p className="text-sm leading-relaxed text-muted-foreground">
//           The collection of various quotes, randomly displayed at the bottom line of this site, stems from multiple sources which include Cosmos, Aesop, Open, and others.
//         </p>
//       </div>

//       <div>
//         <h2 className="text-base font-medium mb-2 text-accent-foreground">Inspiration</h2>
//         <p className="text-sm mb-2 text-muted-foreground">Pages that influenced this site in quiet, meaningful ways—through design, content, or feeling.</p>
//         <ul className="list-none pl-0 space-y-1">
//           {[
//             { name: "Brian Lovin", url: "https://brianlovin.com" },
//             { name: "beingfemi.com", url: "https://beingfemi.com" },
//             { name: "junaidanjum.com", url: "https://junaidanjum.com" },
//             { name: "iamrob.in", url: "https://iamrob.in" },
//             { name: "digitalminimalist.com", url: "https://digitalminimalist.com" },
//             { name: "ibuildmyideas.com", url: "https://ibuildmyideas.com" },
//             { name: "armond.me", url: "https://armond.me" },
//             { name: "linusrogge.com", url: "https://linusrogge.com" },
//             { name: "pranathiperi.com", url: "https://pranathiperi.com" },
//             { name: "zaidmukaddam.com", url: "https://zaidmukaddam.com/" },
//             { name: "Mason Watson", url: "https://mw.works/" },
//           ].map((site) => (
//             <li key={site.url} className="">
//               <a href={site.url} target="_blank" rel="noopener noreferrer" className="underline text-foreground/90 text-sm">
//                 {site.name}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//       </div>
//     </div>
//   );
// }
