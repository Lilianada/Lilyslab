"use client";

import React, { useState, lazy } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DisplayLog } from "../../app/(no-sidebar)/daily-logs/page";
import { Suspense } from "react";

// Lazy load markdown rendering dependencies
const MarkdownRenderer = lazy(() =>
  Promise.all([
    import("react-markdown"),
    import("remark-gfm"),
    import("rehype-highlight"),
  ]).then(([ReactMarkdownModule, remarkGfmModule, rehypeHighlightModule]) => {
    const ReactMarkdown = ReactMarkdownModule.default;
    const remarkGfm = remarkGfmModule.default;
    const rehypeHighlight = rehypeHighlightModule.default;

    return {
      default: ({ children }: { children: string }) => (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ href = "", ...props }) => {
              const isExt = /^https?:\/\//.test(href);
              const yellowLink =
                "text-siteYellow-500 dark:text-siteYellow-300 hover:underline transition-colors";
              const codeRedLink =
                "text-red-400 dark:text-red-300 hover:underline transition-colors";
              return (
                <a
                  {...props}
                  href={href}
                  className={isExt ? codeRedLink : yellowLink}
                  target={isExt ? "_blank" : undefined}
                  rel={isExt ? "noopener noreferrer" : undefined}
                />
              );
            },
          }}
        >
          {children}
        </ReactMarkdown>
      ),
    };
  })
);

function MarkdownWithColoredLinks({ children }: { children: string }) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      }
    >
      <MarkdownRenderer>{children}</MarkdownRenderer>
    </Suspense>
  );
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: undefined,
  });
}

// Utility: check if content overflows
const useContentOverflow = () => {
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const checkOverflow = React.useCallback(() => {
    const el = ref.current;
    if (el) {
      const hasOverflow = el.scrollHeight > el.clientHeight;
      setIsOverflowing(hasOverflow);
    }
  }, []);

  // Check overflow after mount and when window is resized
  React.useEffect(() => {
    // Initial check after a short delay to allow for hydration
    const initialTimer = setTimeout(checkOverflow, 10);
    
    // Second check after content likely settled
    const secondTimer = setTimeout(checkOverflow, 100);

    // Setup resize observer for layout shifts
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Setup mutation observer for content changes
    const mutationObserver = new MutationObserver(() => {
      checkOverflow();
    });

    if (ref.current) {
      mutationObserver.observe(ref.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    const handleResize = () => {
      checkOverflow();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(secondTimer);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [checkOverflow]);

  return [ref, isOverflowing] as const;
};

export default function DailyLogsClient({ logs }: { logs: DisplayLog[] }) {
  const [modalLog, setModalLog] = useState<null | DisplayLog>(null);
  const [showWhyModal, setShowWhyModal] = useState(false);

  return (
    <div
      className={`min-h-screen bg-background text-foreground sm:p-8 font-nitti`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          <h1 className="text-lg font-semibold tracking-wide">DAILY LOGS</h1>
          </button>
        </div>
        <div className="flex gap-2">
          <Link
            href="/ask-me-anything"
            className="px-3 py-1 rounded border border-siteYellow-500 dark:border-siteYellow-300 text-siteYellow-500 dark:text-siteYellow-300 font-nitti text-sm hover:bg-siteYellow-500/10 transition"
          >
            Ask me anything
          </Link>
          <button
            onClick={() => setShowWhyModal(true)}
            className="px-3 py-1 rounded border border-muted text-muted-foreground font-nitti text-sm hover:bg-muted/50 transition"
          >
            Why keep daily logs?
          </button>
        </div>
      </div>

      {/* Logs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {logs.map((log, idx) => {
          const [contentRef, isOverflowing] = useContentOverflow();
          const chronologicalNumber = logs.length - idx;

          return (
            <div
              key={idx}
              className="flex flex-col justify-between border-2 border-dashed border-border bg-card p-5 min-h-[270px] max-h-[340px] transition-shadow hover:shadow-md rounded-sm font-nitti"
            >
              {/* Heading row */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-muted-foreground">
                    {formatDay(log.date)}
                  </span>
                  <span className="text-lg" title={log.mood.label}>
                    {log.mood.emoji}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground tracking-widest">
                  #{String(chronologicalNumber).padStart(3, "0")}
                </span>
              </div>
              {/* Log Content */}
              <div className="relative flex-1 mb-6">
                <div
                  ref={contentRef}
                  className="pr-2 overflow-hidden whitespace-pre-wrap tracking-[-1px] text-muted-foreground"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  <MarkdownWithColoredLinks>
                    {log.body}
                  </MarkdownWithColoredLinks>
                </div>
              </div>
              {/* Footer row with date left, read more right */}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{log.date}</span>
                {isOverflowing && (
                  <button
                    onClick={() => setModalLog(log)}
                    className="ml-4 text-codeRed hover:text-codeRed/70 dark:text-codeRed dark:hover:text-codeRed/70 font-semibold transition"
                  >
                    Read more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for full log */}
      {modalLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-card border-2 border-dashed border-border rounded-lg max-w-2xl w-full max-h-[80vh] shadow-xl relative flex flex-col">
            <button
              onClick={() => setModalLog(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-xl leading-none z-10"
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {formatDay(modalLog.date)}
                </span>
                <span className="text-lg">{modalLog.mood.emoji}</span>
              </div>
              <div className="text-right text-xs text-muted-foreground mt-2">
                {modalLog.date}
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="prose prose-sm dark:prose-invert max-w-none font-nitti text-sm">
                <MarkdownWithColoredLinks>
                  {modalLog.body}
                </MarkdownWithColoredLinks>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Keep a Note Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-card border-2 border-dashed border-border rounded-lg max-w-2xl w-full max-h-[80vh] shadow-xl relative flex flex-col">
            <button
              onClick={() => setShowWhyModal(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-xl leading-none z-10"
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-border">
              <h2 className="font-semibold text-foreground text-lg">
                Why Keep Daily Logs?
              </h2>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="prose prose-sm dark:prose-invert max-w-none font-nitti text-sm space-y-4">
                <p>
                  Keeping daily notes is like having a conversation with your
                  future self. It's a practice that transforms fleeting thoughts
                  into lasting insights.
                </p>

                <p>
                  My daily routines, interests and activities change through out
                  the year. Keeping a daily log will allow me to identify
                  probable causes of those changes and even growth. It'll also
                  allow me keep track of my daily activities, moods, and
                  recognize patterns. 
                  <br/>
                  <br/>
                  Writing daily will yet again allow me to
                  slow down, take things in, process them more intentionally and
                  then write about them. I'll be able to notice the little
                  things that made my day good or bad. It's a mindfull practice
                  that I intend to keep up no matter how inconsistent I am.
                </p>

                <blockquote className="border-l-4 border-siteYellow-400 pl-4 italic">
                  "The palest ink is better than the best memory." — Chinese
                  Proverb
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
