import { BookmarkItem } from "@/components/digital-garden/bookmark/BookmarkItem";
import type { Bookmark } from "@/lib/bookmarks";
import { getBookmarks } from "@/lib/bookmarks";

// TagFilter must be a Client Component if it uses useState
import TagFilterClient from "./TagFilterClient";

// TagFilter component
export default async function Bookmark() {
  const bookmarks = await getBookmarks();

  return (
    <div className="min-h-screen animate-fade-in">
    <div className="container max-w-3xl mx-auto p-0 sm:px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="mb-1 text-xl font-medium">Bookmarks</h1>
          <p className="text-sm text-muted-foreground">
          I collect and organize my favorite reads, tools, and discoveries here—curated from my daily explorations across the web. Each bookmark is handpicked and tagged for inspiration, learning, or just plain delight.
          </p>
        </div>
      </header>

      <div>
        <ul className="mt-8 flex items-center gap-4 font-mono text-xs">
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-lavender border border-gray-300"></span>Article
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-peach border border-gray-300"></span>Website
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-steelBlue border border-gray-300"></span>Video
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-yellow border border-gray-300"></span>Misc
          </li>
        </ul>

        {/* Tag Filter Collapsible */}
        <TagFilterClient bookmarks={bookmarks} />
      </div>
    </div>
    </div>
  );
}