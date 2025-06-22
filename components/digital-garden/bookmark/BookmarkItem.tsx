'use client';
import React from "react";
import { formatDateForDisplay } from "@/lib/utils";

export type Bookmark = {
  id?: string;
  link: string;
  title: string;
  cover: string;
  tags: string[];
  type: "article" | "video" | "website" | "misc";
  created: string;
};

interface Props {
  bookmark: Bookmark;
}

export function BookmarkItem({ bookmark }: Props) {
  // Use the central utility to format dates
  const formattedDate = formatDateForDisplay(bookmark.created);
  
  // Extract domain from link
  let domain = "";
  let websiteName = "";
  try {
    const url = new URL(bookmark.link);
    domain = url.hostname;
    
    // Extract clean website name (remove www. and get main domain)
    let cleanDomain = domain.replace(/^www\./, '');
    
    // Handle special cases for better readability
    const specialCases: Record<string, string> = {
      'paulgraham.com': 'Paul Graham',
      'maggieappleton.com': 'Maggie Appleton',
      'tracydurnell.com': 'Tracy Durnell',
      'fs.blog': 'Farnam Street',
      'justinjackson.ca': 'Justin Jackson',
      'kevquirk.com': 'Kev Quirk',
      'sive.rs': 'Derek Sivers',
      'julian.com': 'Julian',
      'guzey.com': 'Alexey Guzey',
      'benkuhn.net': 'Ben Kuhn',
      'tomcritchlow.com': 'Tom Critchlow',
      'swyx.io': 'Swyx',
      'perell.com': 'David Perell'
    };
    
    if (specialCases[cleanDomain]) {
      websiteName = specialCases[cleanDomain];
    } else {
      // For regular domains, extract the main part and capitalize
      websiteName = cleanDomain.split('.')[0];
      websiteName = websiteName.charAt(0).toUpperCase() + websiteName.slice(1);
    }
  } catch (error) {
    console.warn(`Invalid URL in bookmark: ${bookmark.link}`);
  } 

  // Color dots
  const colorMap = {
    article: "bg-lavender",
    website: "bg-peach",
    video: "bg-steelBlue",
    misc: "bg-yellow",
  } as const;

  return (
    <React.Fragment>
      {/* Desktop Version */}
      <div className="list-item-image-hover-effect group relative hidden md:block transition-all duration-300">
        <a href={bookmark.link} className="flex items-center justify-between gap-4 py-2 transition-all duration-300 hover:scale-[1.025] " target="_blank" rel="noopener noreferrer" aria-label={`Visit ${bookmark.title}`}>
          <div className="flex max-w-[80%] shrink-0 items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colorMap[bookmark.type]}`} />
            <p className="mr-2 truncate text-sm">{bookmark.title}</p>
            {websiteName && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {websiteName}
              </span>
            )}
          </div>
          <div className="hidden h-[1px] w-full grow bg-border md:block"></div>
          <p className="shrink-0 text-right font-mono text-xs text-muted-foreground group-hover:hidden transition-all duration-300 opacity-100 group-hover:opacity-0">
            {formattedDate}
          </p>
          <div className="hidden shrink-0 items-center gap-2 group-hover:flex transition-all duration-300 ease-in-out transform group-hover:translate-x-1 group-hover:opacity-100 opacity-0">
            <p className="text-sm transition-colors duration-200">{domain}</p>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-12"><path d="M7 17L17 7M17 7H7m10 0v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </a>
        {/* Simple colored accent box on hover */}
        <div className="pointer-events-none absolute left-[-20px] top-[50%] transform translate-y-[-50%] z-10 hidden md:group-hover:block">
          <div 
            className={`h-full w-2 rounded-full ${colorMap[bookmark.type]} animate-pulse shadow-md`} 
            style={{ height: '24px' }}
          />
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden group">
        <a href={bookmark.link} className="mt-5 flex flex-col gap-2 border-b border-neutral-200 pb-5" target="_blank" rel="noopener noreferrer" aria-label={`Visit ${bookmark.title}`}>
          <div className="flex items-center justify-between gap-1">
            <div className="flex shrink items-center gap-2 overflow-x-auto">
              <div className={`h-2 w-2 shrink-0 rounded-full ${colorMap[bookmark.type]}`} />
              <p className="mr-2 truncate font-mono text-xs md:text-sm">{bookmark.title}</p>
              {websiteName && (
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {websiteName}
                </span>
              )}
            </div>
            <p className="shrink-0 text-right font-mono text-xs text-neutral-500">
              {formattedDate}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex shrink-0 items-center gap-2 text-neutral-400">
              <p className="text-xs">{domain}</p>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-24 group-hover:text-steelBlue group-hover:scale-150"><path d="M7 17L17 7M17 7H7m10 0v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </a>
      </div>
    </React.Fragment>
  );
}
