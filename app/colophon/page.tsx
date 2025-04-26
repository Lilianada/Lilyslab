"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import { Globe, Code2, Paintbrush, BookOpen, ChevronLeft, TriangleAlert, Github } from "lucide-react";

export default function Colophon() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in">
      <div className="mb-8">
        <a href="/" className="text-sm text-muted-foreground hover:underline flex items-center gap-1 mb-2">
          <ChevronLeft size={16} /> back home
        </a>
        <h1 className="mb-1 text-2xl font-bold tracking-tight">Colophon</h1>
        <p className="text-sm text-muted-foreground mb-6">The tools, technologies, and inspirations behind this website.</p>
      </div>
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
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Basehub</div>
            <div className="text-xs text-muted-foreground">Modern headless CMS for structured content management</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">PostgreSQL</div>
            <div className="text-xs text-muted-foreground">Robust relational database for data persistence</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Drizzle ORM</div>
            <div className="text-xs text-muted-foreground">TypeScript ORM with a focus on type safety and developer experience</div>
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
          <h2 className="font-mono text-base font-semibold">Attribution</h2>
        </div>
        <div className="text-sm mb-2 text-muted-foreground">Stole code and designs from these amazing creators:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded bg-background p-4">
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Shu Ding</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Andres</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Joshua Guo</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Guillermo Rauch</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Paco Coursey</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Lee Robinson</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Florian Kiem</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Benji Taylor</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Julien Thibeaut</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Sara Du</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Shayan</a>
          <a className="underline underline-offset-2 text-xs" href="#" target="_blank" rel="noopener">Farza</a>
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
        <div className="flex gap-3 items-end mb-2">
          {[100,200,300,400,500,700,800,900].map((shade) => (
            <div key={shade} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border`} style={{ background: `hsl(0,0%,${100-(shade/10)}%)` }} />
              <span className="text-[10px] mt-1 text-muted-foreground font-mono">{shade}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Typography</h2>
        </div>
        <div className="border rounded bg-background p-4">
          <div className="font-semibold">Heading</div>
          <div className="font-mono text-lg mb-2">Geist Mono</div>
          <div className="font-semibold">Body</div>
          <div className="mb-2">The quick brown fox jumps over the lazy dog.</div>
          <div className="font-semibold">Inline Link</div>
          <div className="mb-2 underline">The quick brown fox</div>
          <div className="font-semibold">Code</div>
          <div className="text-xs border-t pt-1 font-mono">const example = "Hello World";</div>
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Github size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Personal Space</h2>
        </div>
        <div className="border rounded bg-background p-4 mb-2 text-sm">
          This website is a personal digital garden—a space for me to experiment with design, technology, and share my thoughts. It's not open source, as it represents my personal journey and identity online.
          <div className="border rounded bg-muted/30 p-4 mt-4 text-center text-xs font-mono italic">
            <div className="mb-1">A haiku:</div>
            <div>Digital canvas<br/>Code weaves personal space<br/>My thoughts, digitized</div>
          </div>
        </div>
      </section>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <TriangleAlert size={16} className="text-muted-foreground" />
          <h2 className="font-mono text-base font-semibold">Deployment</h2>
          <span className="ml-2 px-2 py-0.5 rounded bg-muted text-xs">Vercel</span>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          This site is deployed on <a href="https://vercel.com/" className="underline">Vercel</a>, taking advantage of their global edge network for optimal performance. Each commit triggers automatic deployments with preview environments for testing changes before they go live.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Performance</div>
            <div className="text-xs text-muted-foreground">Optimized for Core Web Vitals with 100+ Lighthouse score. Static generation combined with ISR for the best of both worlds.</div>
          </div>
          <div className="border rounded bg-background p-4">
            <div className="font-semibold">Analytics</div>
            <div className="text-xs text-muted-foreground">Privacy-focused analytics with Vercel Web Analytics to track performance metrics and user engagement without cookies.</div>
          </div>
        </div>
      </section>
      <section className="mb-10">
        <blockquote className="border-l-4 border-muted pl-4 italic text-sm text-muted-foreground">
          "I'm convinced that about half of what separates the successful entrepreneurs from the non-successful ones is pure perseverance."<br/>
          <span className="not-italic font-mono text-xs">from the non-successful ones is pure perseverance."</span><br/>
          <br/>
          "Do something when you are young, when you have nothing to lose, and keep that in mind."<br/>
          <br/>
          "Don't let the noise of others' opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition."
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
