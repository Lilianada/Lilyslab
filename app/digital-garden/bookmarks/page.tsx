import { BookmarkItem } from "@/components/digital-garden/BookmarkItem";
import type { Bookmark } from "@/lib/bookmarks";
import { getBookmarks } from "@/lib/bookmarks";

// TagFilter must be a Client Component if it uses useState
import TagFilterClient from "./TagFilterClient";

// TagFilter component
export default async function Bookmark() {
  const bookmarks = await getBookmarks();

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-8">
        <h1 className="mb-1 text-xl font-medium">Bookmarks</h1>
      </header>

      <div>
        <p className="font-mono mb-6 text-sm text-muted-foreground">
          I collect and organize my favorite reads, tools, and discoveries here—curated from my daily explorations across the web. Each bookmark is handpicked and tagged for inspiration, learning, or just plain delight.
        </p>
        <ul className="mt-8 flex items-center gap-4 font-mono text-xs">
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#FBF3B9] border border-gray-300"></span>Article
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#FFDCCC] border border-gray-300"></span>Website
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#FDB7EA] border border-gray-300"></span>Video
          </li>
          <li>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#B7B1F2] border border-gray-300"></span>Misc
          </li>
        </ul>

        {/* Tag Filter Collapsible */}
        <TagFilterClient bookmarks={bookmarks} />
      </div>
    </div>
  );
}