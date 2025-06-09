import type { Bookmark } from "@/lib/bookmarks";
import { getBookmarks } from "@/lib/bookmarks";

// TagFilter must be a Client Component if it uses useState
import TagFilterClient from "./TagFilterClient";

// Bookmark component
export default async function BookmarkPage() {
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

          {/* Filters and Bookmarks List */}
          <div>
            <TagFilterClient bookmarks={bookmarks} />
          </div>
    </div>
    </div>
  );
}