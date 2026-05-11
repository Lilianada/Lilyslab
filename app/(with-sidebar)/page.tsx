"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Smile } from "lucide-react";
import { formatDate } from "@/lib/utils";
import AnimatedLogo from "@/components/comps/AnimatedLogo";
import { MusicPlayerWidget } from "@/components/audio/music-player-widget";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/search-bar";

interface Post {
  slug: string;
  title: string;
  createdAt: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
}

interface Bookmark {
  id: string;
  title: string;
  link: string;
  created: string;
  tags: string[];
  type: string;
}

interface MicroBlog {
  id: string;
  content: string;
  date: string;
  likeCount: number;
}

interface ArchiveItem {
  slug: string;
  title: string;
  category: string;
  createdAt?: string;
}

interface SearchResult {
  id: string;
  title: string;
  path: string;
  type: string;
  snippet?: string;
  external?: boolean;
}

const staticPageSearchItems: SearchResult[] = [
  {
    id: "page-essays",
    title: "Essays",
    path: "/garden/essays",
    type: "Page",
    snippet: "Browse essays and long-form writing.",
  },
  {
    id: "page-notes",
    title: "Notes",
    path: "/garden/notes",
    type: "Page",
    snippet: "Explore notes, drafts, and short thoughts.",
  },
  {
    id: "page-poems",
    title: "Poems",
    path: "/garden/poems",
    type: "Page",
    snippet: "Discover poetry and verse.",
  },
  {
    id: "page-bookmarks",
    title: "Bookmarks",
    path: "/garden/bookmarks",
    type: "Page",
    snippet: "Find saved links and curated bookmarks.",
  },
  {
    id: "page-archives",
    title: "Archives",
    path: "/archives",
    type: "Page",
    snippet: "Search older archived writings and notes.",
  },
  {
    id: "page-quotes",
    title: "Quotes",
    path: "/quotes",
    type: "Page",
    snippet: "Read collections of favorite quotes.",
  },
];

// Collection item component for the left side of the page
const CollectionItem = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) => (
  <div className="border border-dashed border-codeRed rounded-md p-3 hover:shadow-md transition-shadow">
    <Link href={path} className="block h-full">
      <h3 className="font-medium text-sm mb-1 capitalize">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Link>
  </div>
);

// Post list item component for the right side of the page
const ListItem = ({
  title,
  path,
  date,
}: {
  title: string;
  path: string;
  date: string;
}) => (
  <div className="flex justify-between items-center py-1">
    <Link href={path} className="hover:italic hover:text-codeRed text-xs">
      {title}
    </Link>
    <span className="text-[10px] text-muted-foreground">
      {formatDate(date)}
    </span>
  </div>
);

// Main client component
const HomeV2Client = () => {
  // Example posts data - in production this would come from an API or props
  const [essayPosts, setEssayPosts] = useState<Post[]>([]);
  const [notePosts, setNotePosts] = useState<Post[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [microBlogs, setMicroBlogs] = useState<MicroBlog[]>([]);
  const [allEssays, setAllEssays] = useState<Post[]>([]);
  const [allNotes, setAllNotes] = useState<Post[]>([]);
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([]);
  const [allMicroBlogs, setAllMicroBlogs] = useState<MicroBlog[]>([]);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch essay posts
        const essayResponse = await fetch("/api/essays");
        const essayData = await essayResponse.json();

        const publishedEssayData = essayData
          .filter((essay: any) => essay.published === true)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Fetch note posts
        const noteResponse = await fetch("/api/notes");
        const noteData = await noteResponse.json();

        const publishedNoteData = noteData
          .filter((note: any) => note.published === true)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Fetch bookmark posts from the dedicated bookmarks API
        const bookmarkResponse = await fetch("/api/bookmarks");
        const bookmarkData = await bookmarkResponse.json();

        const processedBookmarks = bookmarkData
          .map((bookmark: any) => ({
            id: bookmark.id,
            title: bookmark.title,
            link: bookmark.url,
            created: bookmark.createdAt,
            tags: bookmark.tags || [],
            type: bookmark.type,
          }))
          .sort(
            (a: Bookmark, b: Bookmark) =>
              new Date(b.created).getTime() - new Date(a.created).getTime()
          );

        // Fetch microblog posts
        const microblogResponse = await fetch("/api/micro-blog");
        const microblogData = await microblogResponse.json();

        const processedMicroblogs = microblogData
          .map((item: any) => ({
            id: item.id || item.slug,
            content: item.content || "",
            date: item.date || item.createdAt,
            likeCount: item.likeCount || 0,
          }))
          .sort(
            (a: MicroBlog, b: MicroBlog) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        // Fetch archive items for search
        const archiveResponse = await fetch("/api/archives");
        const archiveData = await archiveResponse.json();
        const archives = archiveData.items || [];

        setAllEssays(publishedEssayData);
        setEssayPosts(publishedEssayData.slice(0, 5));
        setAllNotes(publishedNoteData);
        setNotePosts(publishedNoteData.slice(0, 5));
        setAllBookmarks(processedBookmarks);
        setBookmarks(processedBookmarks.slice(0, 5));
        setAllMicroBlogs(processedMicroblogs);
        setMicroBlogs(processedMicroblogs.slice(0, 5));
        setArchiveItems(archives);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };

    fetchPosts();

    return () => {};
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: SearchResult[] = [];
    const addResult = (item: SearchResult) => {
      if (results.find((result) => result.path === item.path)) return;
      results.push(item);
    };

    const matches = (value?: string) =>
      !!value && value.toLowerCase().includes(query);

    const matchesTags = (tags?: string[]) =>
      Array.isArray(tags) && tags.some((tag) => tag.toLowerCase().includes(query));

    allEssays.forEach((essay) => {
      if (
        matches(essay.title) ||
        matches(essay.excerpt) ||
        matches(essay.content) ||
        matchesTags(essay.tags)
      ) {
        addResult({
          id: `essay-${essay.slug}`,
          title: essay.title,
          path: `/garden/essays/${essay.slug}`,
          type: "Essay",
          snippet: essay.excerpt || essay.content?.slice(0, 120) || "",
        });
      }
    });

    allNotes.forEach((note) => {
      if (
        matches(note.title) ||
        matches(note.content) ||
        matchesTags(note.tags)
      ) {
        addResult({
          id: `note-${note.slug}`,
          title: note.title,
          path: `/garden/notes/${note.slug}`,
          type: "Note",
          snippet: note.content?.slice(0, 120) || "",
        });
      }
    });

    allBookmarks.forEach((bookmark) => {
      if (matches(bookmark.title) || matchesTags(bookmark.tags)) {
        addResult({
          id: `bookmark-${bookmark.id}`,
          title: bookmark.title,
          path: bookmark.link,
          type: "Bookmark",
          snippet: `Bookmark link: ${bookmark.link}`,
          external: true,
        });
      }
    });

    allMicroBlogs.forEach((blog) => {
      if (matches(blog.content)) {
        addResult({
          id: `microblog-${blog.id}`,
          title: blog.content.slice(0, 60) || "MicroBlog post",
          path: `/garden/micro-blog/${blog.id}`,
          type: "MicroBlog",
          snippet: blog.content.slice(0, 120),
        });
      }
    });

    archiveItems.forEach((archive) => {
      if (matches(archive.title) || matches(archive.category)) {
        addResult({
          id: `archive-${archive.category}-${archive.slug}`,
          title: archive.title,
          path: `/archives/${archive.category}/${archive.slug}`,
          type: "Archive",
          snippet: archive.category,
        });
      }
    });

    staticPageSearchItems.forEach((page) => {
      if (
        matches(page.title) ||
        matches(page.snippet) ||
        page.path.toLowerCase().includes(query)
      ) {
        addResult(page);
      }
    });

    return results.slice(0, 20);
  }, [searchQuery, allEssays, allNotes, allBookmarks, allMicroBlogs, archiveItems]);

  // Collections data
  const collections = [
    {
      title: "poems",
      description: "Poems I've written.",
      path: "/garden/poems",
    },
    {
      title: "bookshelf",
      description: "My reading list.",
      path: "/garden/bookshelf",
    },
    {
      title: "playground",
      description: "Fun experiments and projects.",
      path: "/playground",
    },
    {
      title: "projects",
      description: "Projects I worked on.",
      path: "/garden/projects",
    },
    {
      title: "webroll",
      description: "Links to my fav websites.",
      path: "/webroll",
    },
    {
      title: "quotes",
      description: "Collection of quotes.",
      path: "/quotes",
    },
  ];

  return (
    <div className="container py-10 max-w-6xl">
      {/* Main heading section */}
      <div className="flex flex-col text-xs text-muted-foreground font-mono max-w-xl mb-6">
        <div className="w-20 h-20 mb-6 object-contain">
          <AnimatedLogo />
        </div>
        <div>Created: April 10, 2025</div>
        <div>Last updated: July 25, 2025</div>
      </div>

      {/* Main content - responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 font-mono ">
        {/* Left side - Collections */}
        <div className="md:col-span-2">
          <h2 className="font-medium">Intro</h2>
          <div className="flex flex-col text-xs text-muted-foreground lg:max-w-xl">
            {isLoading ? (
              <div className="mt-3 space-y-2 animate-pulse">
                <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-5/6 mb-1"></div>
                <div className="h-3 bg-muted rounded w-11/12"></div>
                <div className="h-16 bg-muted rounded-md my-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-11/12 mb-1"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <p className="text-xs mr-2">Hiii there </p>{" "}
                  <Smile size={14} className="inline-block" />
                </div>
                <p className="text-xs">
                  Welcome to my digital home and mini space on the internet. My
                  name is Lily and I'm super excited to house you for the time
                  you'll be here. This is a space where I'm free to express
                  myself in whatever medium I choose. Could be through code,
                  images, sounds, and words. There's literally no limit to what
                  I can do here.
                </p>
                <p className="text-xs">
                  I've put in a lot of thoughts and efforts into building
                  everything you see and interact with in this space. I try to
                  make this website a living representation of my personal
                  space; small, cozy and with lots of depth. Be sure to leave
                  your footprint by signing my{" "}
                  <Link href="/guestbook" className="text-codeRed">
                    guestbook
                  </Link>
                  .
                </p>

                <p className="text-xs">
                  You should first learn a little more{" "}
                  <Link href="/about" className="text-codeRed">
                    about me
                  </Link>
                  , then find out what I'm currently up to at the moment by
                  checking the{" "}
                  <Link href="/now" className="text-codeRed">
                    now
                  </Link>{" "}
                  page. You can also check to see what I'll like to do{" "}
                  <Link href="/someday" className="text-codeRed">
                    someday
                  </Link>
                  , and also my career{" "}
                  <Link href="/bucket-list" className="text-codeRed">
                    bucket list
                  </Link>
                  .
                </p>

                <div className="py-2">
                  <Suspense
                    fallback={
                      <div className="h-16 bg-muted rounded-md flex items-center p-3 animate-pulse">
                        <div className="w-10 h-10 rounded-md bg-gray-300 mr-3"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                      </div>
                    }
                  >
                    <MusicPlayerWidget
                      imageUrl="/images/lily_flower.jpeg"
                      title="Welcome to my digital garden & workshop!"
                      artist="Written by Lily, recorded with Play.ai"
                    />
                  </Suspense>
                </div>
                <p className="text-xs">
                  If you like to read amature musings/essays/poems, check my{" "}
                  <Link href="/garden" className="text-codeRed">
                    garden
                  </Link>
                  . You can find my recently published on the right (for web) or
                  below (for mobile).
                </p>
              </div>
            )}
          </div>

          {/* Collections & Pages */}
          <div className="mt-4">
            <h2 className="font-medium mb-6">Collections & Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-dashed border-gray-200 rounded-md p-3 animate-pulse"
                    >
                      <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  ))}
                </>
              ) : (
                collections.map((collection) => (
                  <CollectionItem
                    key={collection.title}
                    title={collection.title}
                    description={collection.description}
                    path={collection.path}
                  />
                ))
              )}
            </div>
          </div>

          {/* Doodle */}
          {/* <div className="mt-4">
            <h2 className="font-medium mb-6">Leave a Doodle...</h2>
            <div className="">
              <DoodleCanvas />
            </div>
          </div> */}
        </div>

        {/* Right side - Recent Activity */}
        <div className="md:col-span-2">
          <h2 className="font-medium mb-6">Recently Published</h2>
          <div className="mb-6 max-w-xl">
            <SearchBar
              placeholder="Search essays, notes, poems, bookmarks, archives..."
              onSearch={setSearchQuery}
              className="max-w-xl"
            />
            {searchQuery ? (
              <div className="mt-4 rounded-md border border-muted p-4 bg-surface">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>Search results for "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-codeRed hover:underline"
                  >
                    Clear
                  </button>
                </div>
                {searchResults.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {searchResults.map((result) => (
                      <div key={result.id} className="rounded-md border border-muted p-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              href={result.path}
                              target={result.external ? "_blank" : undefined}
                              rel={result.external ? "noopener noreferrer" : undefined}
                              className="font-medium text-sm text-codeRed hover:underline"
                            >
                              {result.title}
                            </Link>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mt-1">
                              {result.type}
                            </p>
                          </div>
                        </div>
                        {result.snippet ? (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                            {result.snippet}...
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No matching content found. Try a broader term or browse the sections below.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {/* Essays skeleton */}
              <div className="mb-8">
                <div className="flex justify-between text-xs items-center">
                  <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-1 border-l pl-4 py-2 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1 animate-pulse"
                    >
                      <div className="w-3/4 h-3 bg-muted rounded"></div>
                      <div className="w-16 h-3 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes skeleton */}
              <div className="mb-8">
                <div className="flex justify-between text-xs items-center">
                  <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-1 border-l pl-4 py-2 mt-2">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1 animate-pulse"
                    >
                      <div className="w-3/4 h-3 bg-muted rounded"></div>
                      <div className="w-16 h-3 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookmarks skeleton */}
              <div className="mb-8">
                <div className="flex justify-between text-xs items-center">
                  <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-1 border-l pl-4 py-2 mt-2">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1 animate-pulse"
                    >
                      <div className="w-3/4 h-3 bg-muted rounded"></div>
                      <div className="w-16 h-3 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Microblog skeleton */}
              <div>
                <div className="flex justify-between text-xs items-center">
                  <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-3 border-l pl-4 py-2 mt-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="py-1 animate-pulse">
                      <div className="w-full h-8 bg-muted rounded mb-1"></div>
                      <div className="w-16 h-3 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Essays section */}
              <div className="mb-8">
                <div className="flex justify-between text-xs items-center">
                  <h3 className="uppercase font-medium text-muted-foreground mb-2">
                    Essays
                  </h3>
                  <Link
                    href="/garden/essays"
                    className="flex items-center hover:italic text-codeRed"
                  >
                    ALL <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
                <div className="space-y-1 border-l pl-4 py-2">
                  {essayPosts.length > 0 ? (
                    essayPosts.map((post) => (
                      <ListItem
                        key={post.slug}
                        title={post.title}
                        path={`/garden/essays/${post.slug}`}
                        date={post.createdAt}
                      />
                    ))
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">
                      No essays found
                    </p>
                  )}
                </div>
              </div>

              {/* Notes section */}
              <div className="mb-8">
                <div className="flex justify-between text-xs items-center">
                  <h3 className="uppercase text-xs font-medium text-muted-foreground mb-2">
                    Notes
                  </h3>
                  <Link
                    href="/garden/notes"
                    className="flex items-center hover:italic text-codeRed"
                  >
                    ALL <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
                <div className="space-y-1 border-l pl-4 py-2">
                  {notePosts.length > 0 ? (
                    notePosts.map((post) => (
                      <ListItem
                        key={post.title || post.slug}
                        title={post.title}
                        path={`/garden/notes/${post.slug}`}
                        date={post.createdAt}
                      />
                    ))
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">
                      No notes found
                    </p>
                  )}
                </div>
              </div>

              {/* Bookmarks section */}
              <div className="mb-8">
                <div className="flex justify-between text-xs items-center">
                  <h3 className="uppercase font-medium text-muted-foreground mb-2">
                    Bookmarks
                  </h3>
                  <Link
                    href="/garden/bookmarks"
                    className="flex items-center hover:italic text-codeRed"
                  >
                    ALL <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
                <div className="space-y-1 border-l pl-4 py-2">
                  {bookmarks.length > 0 ? (
                    bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="flex justify-between items-center py-1"
                      >
                        <a
                          href={bookmark.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:italic text-xs"
                        >
                          {bookmark.title}
                        </a>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(bookmark.created)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">
                      No bookmarks found
                    </p>
                  )}
                </div>
              </div>

              {/* MicroBlog section */}
              <div>
                <div className="flex justify-between text-xs items-center">
                  <h3 className="uppercase font-medium text-muted-foreground mb-2">
                    MicroBlog
                  </h3>
                  <Link
                    href="/garden/micro-blog"
                    className="flex items-center hover:italic text-codeRed"
                  >
                    ALL <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
                <div className="space-y-3 border-l pl-4 py-2">
                  {microBlogs.length > 0 ? (
                    microBlogs.map((blog) => (
                      <div key={blog.id} className="py-1">
                        <div className="text-xs line-clamp-2">
                          {blog.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(blog.date)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">
                      No microblogs found
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeV2Client;
