"use client";

import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";

// Simple interface for sitemap entries
interface SitemapSection {
  title: string;
  pages: Array<{
    name: string;
    url: string;
    description?: string;
  }>;
}

// Website structure organized by sidebar sections
const sitemapData: SitemapSection[] = [
  {
    title: "Home",
    pages: [
      { name: "Home", url: "/", description: "Welcome page" }
    ]
  },
  {
    title: "Me",
    pages: [
      { name: "About", url: "/about", description: "About me" },
      { name: "Now", url: "/now", description: "What I'm doing now" },
      { name: "Someday", url: "/someday", description: "Things I plan to do someday" },
      { name: "Bucket List", url: "/bucket-list", description: "My career bucket list" }
    ]
  },
  {
    title: "For You",
    pages: [
      { name: "Guestbook", url: "/guestbook", description: "Sign my guestbook" },
      { name: "Ask Me Anything", url: "/ask-me-anything", description: "Ask me a question" },
      { name: "Uses", url: "/uses", description: "Hardwares and softwares I use" },
      { name: "Resources", url: "/resources", description: "Useful resources" }
    ]
  },
  {
    title: "Garden",
    pages: [
      { name: "Essays", url: "/garden/writings", description: "My writings and essays" },
      { name: "Notes", url: "/garden/notes", description: "My notes and thoughts" },
      { name: "Bookshelf", url: "/garden/bookshelf", description: "Books I've read, am reading or plan on reading" },
      { name: "Threads", url: "/garden/micro-blog", description: "Short-form thoughts and musings" }
    ]
  },
  {
    title: "Workshop",
    pages: [
      { name: "Projects", url: "/projects", description: "My web projects" },
      { name: "Logs", url: "/logs", description: "Project logs" }, 
      { name: "Tools", url: "/tools", description: "Tools I've used or plan on using" },
      { name: "Todo", url: "/todo", description: "My messy website todo list" }
    ]
  },
  {
    title: "Playground",
    pages: [
      { name: "Digital Clock", url: "/playground/digital-clock", description: "A digital clock experiment" },
      { name: "Calculator", url: "/playground/calculator", description: "A calculator experiment" }
    ]
  },
  {
    title: "Collections",
    pages: [
      { name: "Bookmarks", url: "/bookmarks", description: "Articles I've read and bookmarked for later" },
      { name: "100Pics", url: "/100pics", description: "A collection of 100 pictures in 100 days" },
      { name: "365days", url: "/365days", description: "A collection of stuff done in 365 days" }
    ]
  },
  {
    title: "IndieWeb",
    pages: [
      { name: "Manifesto", url: "/manifesto", description: "My IndieWeb principles" },
      { name: "Webroll", url: "/webroll", description: "People who I love their website" },
      { name: "Webrings", url: "/webrings", description: "Webrings I'm part of" }
    ]
  },
  {
    title: "Footer Links",
    pages: [
      { name: "Misc", url: "/misc", description: "Random stuff" },
      { name: "Guestbook", url: "/guestbook", description: "Sign my guestbook" },
      { name: "Colophon", url: "/colophon", description: "About this site" },
      { name: "Sitemap", url: "/sitemap", description: "This page" },
      { name: "Changelog", url: "/changelog", description: "Recent changes" }
    ]
  }
];

export default function Sitemap() {
  return (
    <>
      <ScrollProgress
        color="bg-extra-steelBlue"
        height={3}
        glow={true}
        glowColor="rgba(var(--extra-steelBlue), 0.6)"
        glowIntensity="12px"
      />
      
      <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <header className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight mb-3">Sitemap</h1>
            <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <div>Created: June 10, 2025</div>
          <div>Last updated: June 12, 2025</div>
        </div>
        </header>

        <div className="space-y-8">
          <p className="text-sm">
            This is my website's sitemap, a list of all the pages I have so far and their sections. I have organised my pages this way for the sake of hireachy and ease of navigation. You can use this page to find what you're looking for, or just to explore my website.
            <br />
            <br />
            If you have any questions, feel free to <a href="/ask-me-anything" className="text-extra-steelBlue hover:underline">ask me anything</a> and in the absence of no questions, you can leave me a footprint by signing my <a href="/guestbook" className="text-extra-steelBlue hover:underline">guestbook</a> to let me know that you were here.
          </p>
          {sitemapData.map((section, index) => (
            <div key={index} className="pb-6 last:border-0">
              <h2 className="font-medium text-extra-steelBlue w-full mb-4 border border-extra-steelBlue/50  rounded-md px-4 py-2">{section.title}</h2>
              <ul className="ml-4 space-y-2.5">
                {section.pages.map((page, pageIndex) => (
                  <li key={pageIndex}>
                    <a 
                      href={page.url}
                      className="text-sm inline-flex items-center hover:underline"
                    >
                      <span className="mr-3">❃</span>
                      <span className="font-medium">{page.name}</span>
                    </a>
                    {page.description && (
                      <span className="text-sm text-muted-foreground ml-3">
                        — {page.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}
