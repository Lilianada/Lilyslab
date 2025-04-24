"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Colophon() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-3xl mx-auto py-12 px-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium">Colophon</h1>
      </header>

<div className="grid gap-6">
      <div>
        <h2 className="text-base font-medium mb-2 text-accent-foreground">About Site</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <div>
        <h2 className="text-base font-medium mb-2 text-accent-foreground">Typography</h2>
        <div className="flex flex-col items-start gap-2">
          <div className="w-72 h-40 bg-muted flex items-center justify-center rounded shadow overflow-hidden">
            <Image
              src="/Noise.png"
              alt="Font sample"
              width={300}
              height={200}
              className="object-contain max-w-full h-auto block"
              style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <figcaption className="text-xs text-muted-foreground mt-1">Font Name (placeholder)</figcaption>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-2 text-accent-foreground">Photography</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          All images were taken or created by Lilian, if not stated otherwise.
        </p>
      </div>

      <div>
        <h2 className="text-base font-medium mb-2 text-accent-foreground">Technicalities</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Built with <span className="font-medium text-foreground">Next.js</span> & <span className="font-medium text-foreground">Tailwind CSS</span>.</li>
          <li>Notion for Content: All notes and essays are written in Notion, allowing for the integration of custom components and interactive elements within markdown.</li>
          <li>Hosting & Deployment: The site is hosted on <span className="font-medium text-foreground">Vercel</span>.</li>
          <li>Animations: Primarily handled with CSS, with more complex animations implemented using <span className="font-medium text-foreground">Framer Motion</span>.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-base font-medium mb-2 text-accent-foreground">Quotes</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The collection of various quotes, randomly displayed at the bottom line of this site, stems from multiple sources which include Cosmos, Aesop, Open, and others.
        </p>
      </div>

      <div>
        <h2 className="text-base font-medium mb-2 text-accent-foreground">Inspiration</h2>
        <p className="text-sm mb-2 text-muted-foreground">Pages that influenced this site in quiet, meaningful ways—through design, content, or feeling.</p>
        <ul className="list-none pl-0 space-y-1">
          {[
            { name: "Brian Lovin", url: "https://brianlovin.com" },
            { name: "beingfemi.com", url: "https://beingfemi.com" },
            { name: "junaidanjum.com", url: "https://junaidanjum.com" },
            { name: "iamrob.in", url: "https://iamrob.in" },
            { name: "digitalminimalist.com", url: "https://digitalminimalist.com" },
            { name: "ibuildmyideas.com", url: "https://ibuildmyideas.com" },
            { name: "armond.me", url: "https://armond.me" },
            { name: "linusrogge.com", url: "https://linusrogge.com" },
            { name: "pranathiperi.com", url: "https://pranathiperi.com" },
          ].map((site) => (
            <li key={site.url} className="">
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="underline text-foreground/90 text-sm">
                {site.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}
