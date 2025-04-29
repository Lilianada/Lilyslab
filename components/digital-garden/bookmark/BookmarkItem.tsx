import React from "react";

export type Bookmark = {
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

  const date = new Date(bookmark.created);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  let domain = "";
  try {
    domain = new URL(bookmark.link).hostname;
  } catch { }

  // Color dots
  const colorMap = {
    article: "bg-extra-lavender",
    website: "bg-extra-peach",
    video: "bg-extra-steelBlue",
    misc: "bg-extra-yellow",
  } as const;

  return (
    <>
      {/* Desktop Version */}
      <li className="list-item-image-hover-effect group relative hidden md:block transition-all duration-300">
        <a href={bookmark.link} className="flex items-center justify-between gap-4 py-2 transition-all duration-300 hover:scale-[1.025] " target="_blank" rel="noopener noreferrer">
          {/* <img
            className="cover-image max-w-64 pointer-events-none absolute z-10 hidden max-h-40 shadow-lg md:group-hover:block"
            src={bookmark.cover}
            alt={bookmark.title}
          /> */}
          <div className="flex max-w-[80%] shrink-0 items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colorMap[bookmark.type]}`} />
            <p className="mr-2 truncate font-mono text-sm">{bookmark.title}</p>
            {bookmark.tags.length > 0 && (
              <div className="flex gap-1 ">
                {bookmark.tags.map((tag) => (
                  <span key={tag} className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
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
      </li>

      {/* Mobile Version */}
      <li className="md:hidden">
        <a href={bookmark.link} className="mt-5 flex flex-col gap-2 border-b border-neutral-200 pb-5" target="_blank" rel="noopener noreferrer">
          <div className="flex items-center justify-between gap-1">
            <div className="flex shrink items-center gap-2 overflow-x-auto">
              <div className={`h-2 w-2 shrink-0 rounded-full ${colorMap[bookmark.type]}`} />
              <p className="mr-2 truncate font-mono text-xs md:text-sm">{bookmark.title}</p>
            </div>
            <p className="shrink-0 text-right font-mono text-xs text-neutral-500">
              {formattedDate}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div>
              {bookmark.tags.length > 0 && (
                <div className="flex gap-1 ">
                  {bookmark.tags.map((tag) => (
                    <span key={tag} className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2 text-neutral-400">
              <p className="text-[10px]">{domain}</p>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7m10 0v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </a>
      </li>
    </>
  );
}
