import React from "react";
import { ArrowUpRight, Lock, Badge } from "lucide-react";
import Link from "next/link";

import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Project {
  number: string;
  title: string;
  desc: string;
  category: string;
  url?: string;
  new?: boolean;
  isConfidential?: boolean;
  isArchived?: boolean;
}

function getPublishedProjects(): Project[] {
  const dir = path.join(process.cwd(), "Content/projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  // Sort files numerically (001.md, 002.md, ...)
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  let idx = 1;
  const projects: Project[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(content);
    // Accept both 'publish' and 'published' (bool or string)
    const published = data.publish === true || data.published === true ||
      (typeof data.publish === 'string' && data.publish.toLowerCase() === 'true') ||
      (typeof data.published === 'string' && data.published.toLowerCase() === 'true');
    if (published) {
      projects.push({
        number: idx.toString().padStart(3, "0"),
        title: data.title || "Untitled",
        desc: data.excerpt || data.description || "No description",
        category: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags[0] : (data.category || "Project"),
        url: data.slug ? `/projects/${data.slug}` : (data.url || undefined),
        new: !!data.new,
        isConfidential: data.isConfidential === true || (typeof data.isConfidential === 'string' && data.isConfidential.toLowerCase() === 'true'),
        isArchived: data.isArchived === true || (typeof data.isArchived === 'string' && data.isArchived.toLowerCase() === 'true'),
      });
      idx++;
    }
  }
  return projects;
}

const projects = typeof window === "undefined" ? getPublishedProjects() : [];

export default function WorkshopLogPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Project Log</h1>
        <p className="text-sm text-zinc-500">Too many ideas, not enough <span className="line-through">time </span>focus.</p>
      </header>
      <div>
        {projects.map((item, i) => {
          const isConfidential = item.isConfidential === true || item.isArchived === true;
          return (
            <React.Fragment key={item.number + item.title}>
              {/* Desktop/Tablet (md and up) */}
              <div
                className={`group grid-cols-12 items-center min-h-[44px] text-sm border-0 border-b border-border last:border-0 px-2 py-2 transition-colors duration-150 hidden lg:grid hover:bg-muted ${
                  isConfidential
                    ? "opacity-70 text-zinc-500 bg-transparent cursor-not-allowed"
                    : "cursor-pointer bg-transparent"
                }`}
              >
                {/* Number + Title */}
                <div className="col-span-4 flex items-center gap-2">
                  <span className="w-10 text-xs font-mono text-muted-foreground flex-shrink-0 text-left select-none">
                    {item.number}
                  </span>
                  <span className="font-medium flex items-center text-foreground" style={{minWidth: '120px'}}>
                   {item.title}
                    {item.new && (
                      <span className="ml-2 px-2 leading-normal bg-orange-500/10 text-extra-peach border border-orange-800 text-[8px] rounded font-semibold tracking-wider">NEW</span>
                    )}
                  </span>
                </div>

                {/* Description */}
                <div className="col-span-6 flex items-center justify-start">
                  <span className="truncate font-light text-muted-foreground text-left" style={{maxWidth: '340px', minWidth: '220px'}}>
                    {item.desc}
                  </span>
                </div>

                {/* Category + Icon */}
                <div className="col-span-2 flex items-center justify-end gap-4">
                  <span className="text-xs font-mono tracking-tight text-muted-foreground min-w-[80px] text-right">
                    {item.category}
                  </span>
                  {isConfidential ? (
                    <span
                      title="Confidential"
                      aria-label="Confidential"
                      className="transition-colors cursor-not-allowed"
                    >
                      <Lock
                        size={16}
                        strokeWidth={2}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </span>
                  ) : (
                    item.url ? (
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${item.title} externally`}
                        className="transition-colors cursor-pointer"
                      >
                        <ArrowUpRight size={16} strokeWidth={2} className="text-zinc-500 group-hover:text-primary transition-colors" />
                      </Link>
                    ) : null
                  )}
                </div>
              </div>

              {/* Mobile (below md) */}
              <div
                className={`group flex flex-col items-start gap-y-1 border-0 border-b border-border last:border-0 px-2 py-3 transition-colors duration-150 lg:hidden ${
                  isConfidential
                    ? "opacity-70 text-zinc-500 bg-transparent cursor-not-allowed hover:bg-zinc-800/80"
                    : "hover:bg-muted cursor-pointer bg-transparent"
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground select-none">{item.number}</span>
                    <span className="font-medium text-foreground text-sm">{item.title}</span>
                    {item.new && (
                      <span className="ml-2 px-2 py-0.5 bg-orange-500/10 text-extra-peach text-[10px] rounded font-bold tracking-wider">NEW</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {isConfidential ? (
                      <span title="Confidential" aria-label="Confidential" className="transition-colors cursor-not-allowed">
                        <Lock size={20} strokeWidth={2} className="text-muted-foreground group-hover:text-red-400 transition-colors" />
                      </span>
                    ) : (
                      item.url ? (
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${item.title} externally`}
                          className="transition-colors cursor-pointer"
                        >
                          <ArrowUpRight size={20} strokeWidth={2} className="text-zinc-500 group-hover:text-primary transition-colors" />
                        </Link>
                      ) : null
                    )}
                  </div>
                </div>
                <span className="truncate text-muted-foreground text-left text-base w-full">{item.desc}</span>
              </div>
            </React.Fragment>

          );
        })}
      </div>
    </main>
  );
}
