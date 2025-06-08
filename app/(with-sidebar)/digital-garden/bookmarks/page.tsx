import type { Bookmark } from "@/lib/bookmarks";
import { getBookmarks } from "@/lib/bookmarks";

// TagFilter must be a Client Component if it uses useState
import TagFilterClient from "./TagFilterClient";

// Bookmark component
export default async function BookmarkPage() {
  const bookmarks = await getBookmarks();

  // Count bookmarks by category
  const categoryCounts = {
    article: 0,
    website: 0,
    video: 0,
    misc: 0
  };
  
  bookmarks.forEach(bookmark => {
    if (bookmark.type in categoryCounts) {
      categoryCounts[bookmark.type]++;
    }
  });

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

          {/* Category Legend */}
        <div>
          <div className="mt-8 mb-6">
            <h2 className="mb-3 text-sm font-medium">Categories</h2>
            <ul className="flex flex-wrap items-center gap-4 font-mono text-xs">
              <li className="flex items-center">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-lavender border border-gray-300"></span>
                Article <span className="ml-1 text-muted-foreground">({categoryCounts.article})</span>
              </li>
              <li className="flex items-center">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-peach border border-gray-300"></span>
                Website <span className="ml-1 text-muted-foreground">({categoryCounts.website})</span>
              </li>
              <li className="flex items-center">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-steelBlue border border-gray-300"></span>
                Video <span className="ml-1 text-muted-foreground">({categoryCounts.video})</span>
              </li>
              <li className="flex items-center">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-extra-yellow border border-gray-300"></span>
                Misc <span className="ml-1 text-muted-foreground">({categoryCounts.misc})</span>
              </li>
            </ul>
          </div>

          {/* Filters and Bookmarks List */}
          <TagFilterClient bookmarks={bookmarks} />
        </div>
    </div>
    </div>
  );
}