"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GuestbookEntry {
  id: string;
  name: string;
  url?: string;
  date: string;
  message: string;
}

interface GuestbookEntriesProps {
  entries: GuestbookEntry[];
  isLoading: boolean;
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  // Dates are saved in UTC. Without this, some visitors would see the day before.
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

const LIST = "rounded-xl border border-primary/40 bg-primary/5 divide-y divide-primary/30";
const ROW = "relative px-4 py-5 sm:px-6";

export default function GuestbookEntries({ entries, isLoading }: GuestbookEntriesProps) {
  if (isLoading) {
    return (
      <div className={LIST} aria-hidden="true">
        {[0, 1, 2].map((row) => (
          <div key={row} className={`${ROW} animate-pulse space-y-2`}>
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={LIST}>
        <div className={`${ROW} text-sm text-muted-foreground`}>
          No one has signed yet. You could be the very first guest!
        </div>
      </div>
    );
  }

  return (
    <ol className={LIST}>
      {entries.map((entry, index) => {
        const date = formatDate(entry.date);
        const website = entry.url && /^https?:\/\//i.test(entry.url) ? entry.url : null;
        const label = index === 0 ? "Newest" : index === entries.length - 1 ? "First" : null;

        return (
          <li
            key={entry.id}
            className={`${ROW} ${
              label ? "bg-primary/20 lg:-ml-10 lg:pl-16" : ""
            } ${index === 0 ? "rounded-tr-xl" : ""} ${index === entries.length - 1 ? "rounded-br-xl" : ""}`}
          >
            {label && (
              <>
                {/* Sticks out past the list on wide screens, and sits by the name on phones. */}
                <span className="absolute inset-y-0 left-0 hidden w-10 items-center justify-center border-r border-primary/30 font-mono text-xs uppercase tracking-wider [writing-mode:vertical-rl] rotate-180 lg:flex">
                  {label}
                </span>
                <span className="mb-1.5 inline-block rounded border border-primary/50 px-1.5 font-mono text-xs uppercase tracking-wider lg:hidden">
                  {label}
                </span>
              </>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <h3 className="min-w-0 text-sm font-semibold [overflow-wrap:anywhere]">
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
                  >
                    {entry.name}
                  </a>
                ) : (
                  entry.name
                )}
              </h3>
              {date && <div className="shrink-0 font-mono text-xs text-muted-foreground">{date}</div>}
            </div>

            <div className="mt-1 text-sm [overflow-wrap:anywhere]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // Guests can add emphasis and links, but no images or giant headings.
                allowedElements={["p", "a", "em", "strong", "del", "code", "br", "ul", "ol", "li", "blockquote"]}
                unwrapDisallowed
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">
                      {children}
                    </a>
                  ),
                  p: ({ children }) => <p className="mb-3 whitespace-pre-wrap last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-3 list-disc pl-4 last:mb-0">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-3 list-decimal pl-4 last:mb-0">{children}</ol>,
                }}
              >
                {entry.message}
              </ReactMarkdown>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
