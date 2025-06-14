import type { Bookmark } from "@/lib/garden/bookmarks";
import { getBookmarks } from "@/lib/garden/bookmarks";

// TagFilter must be a Client Component if it uses useState
import TagFilterClient from "./TagFilterClient";

// Bookmark component
export default async function BookmarkPage() {
  const bookmarks = await getBookmarks();

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-3xl mx-auto p-0 sm:px-4 py-8">
        <header className="mb-8">
                  <span className="text-2xl animate-spin">✳︎</span>
                  <h1 className="mb-2 text-xl font-medium">Bookmarks</h1>
                  <div className="flex flex-col text-xs text-muted-foreground font-mono">
                    <div>Created: April 24, 2025</div>
                    <div>Last updated: June 13, 2025</div>
                    <div>Inspired by: ✳︎✳︎✳︎</div>
                  </div>
                </header>
            <p className="text-sm text-muted-foreground">
              I collect and organize my favorite reads, tools, and discoveries here—curated from my daily explorations across the web. Each bookmark is handpicked and tagged for inspiration, learning, or just plain delight.
            </p>

          {/* Filters and Bookmarks List */}
          <div>
            <TagFilterClient bookmarks={bookmarks} />
          </div>
    </div>
    </div>
  );
}