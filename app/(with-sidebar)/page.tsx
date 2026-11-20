import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Flower2, Hammer, Sprout, Smile, type LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getHomeFeed, type FeedItem } from "@/lib/garden-index";
import AnimatedLogo from "@/components/comps/AnimatedLogo";
import { MusicPlayerWidget } from "@/components/audio/music-player-widget";
import { HomeSearch } from "@/components/home/HomeSearch";
import { WanderButton } from "@/components/fun/WanderButton";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Everything beyond the essays, notes and bookmarks on the right, planted in beds.
 * Kept in step with the sidebar.
 */
const BEDS: { name: string; icon: LucideIcon; blurb: string; items: { title: string; description: string; path: string }[] }[] = [
  {
    name: "Reading",
    icon: BookOpen,
    blurb: "What I take in",
    items: [
      { title: "Bookshelf", description: "Books I've read, am reading, or plan to", path: "/garden/bookshelf" },
      { title: "Media digest", description: "What I watched, heard and read each month", path: "/garden/media-digest" },
      { title: "Quotes", description: "Lines worth keeping", path: "/quotes" },
      { title: "Word of the day", description: "New words, one at a time", path: "/garden/word-of-the-day" },
    ],
  },
  {
    name: "Writing",
    icon: Sprout,
    blurb: "What I put out",
    items: [
      { title: "Poems", description: "Poems I've written", path: "/garden/poems" },
      { title: "Commonplace book", description: "Clippings, fragments and notes", path: "/commonplace-book" },
      { title: "Daily logs", description: "Small entries from ordinary days", path: "/daily-logs" },
      { title: "Archives", description: "Old writing from earlier blogs", path: "/archives" },
    ],
  },
  {
    name: "Making",
    icon: Hammer,
    blurb: "What I build",
    items: [
      { title: "Projects", description: "Things I've built and am building", path: "/projects" },
      { title: "Tools", description: "Tools I use to make things", path: "/tools" },
      { title: "Write Online", description: "A quiet place to write", path: "/playground/write" },
      { title: "Burn CD", description: "Plan and burn a mix CD", path: "/playground/burn-cd" },
    ],
  },
  {
    name: "Wandering",
    icon: Flower2,
    blurb: "Where I go on the web",
    items: [
      { title: "Webroll", description: "Personal websites I love", path: "/webroll" },
      { title: "Webrings", description: "Rings this site belongs to", path: "/webrings" },
      { title: "Manifesto", description: "What I believe about the web", path: "/manifesto" },
      { title: "Uses", description: "My setup, apps and gear", path: "/uses" },
    ],
  },
];

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getUTCFullYear()}`;
};

/** One bed of collections: a small header, then its pages. */
const Bed = ({ bed }: { bed: (typeof BEDS)[number] }) => (
  <section aria-label={bed.name}>
    <h3 className="mb-1 flex items-center gap-2 text-sm">
      <bed.icon size={14} strokeWidth={1.75} className="text-codeRed" aria-hidden="true" />
      <span className="uppercase font-medium text-muted-foreground">{bed.name}</span>
      <span className="text-[10px] text-muted-foreground/70">· {bed.blurb}</span>
    </h3>
    <ul className="border-l border-dashed border-codeRed/60 pl-4 py-1">
      {bed.items.map((item) => (
        <li key={item.path}>
          <Link href={item.path} className="group flex items-baseline gap-3 py-1.5">
            <span className="shrink-0 text-xs group-hover:italic group-hover:text-codeRed">{item.title}</span>
            <span className="min-w-0 flex-1 truncate text-right text-[10px] text-muted-foreground">{item.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

const FeedDate = ({ date }: { date: string }) => (
  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
    <span className="inline sm:hidden">{formatShortDate(date)}</span>
    <span className="hidden sm:inline">{formatDate(date)}</span>
  </span>
);

const FeedSection = ({
  heading,
  href,
  children,
}: {
  heading: string;
  href: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <div className="flex justify-between text-sm items-center">
      <h3 className="uppercase font-medium text-muted-foreground mb-2">{heading}</h3>
      <Link href={href} className="flex items-center hover:italic text-codeRed">
        ALL <ArrowRight size={14} className="ml-1" />
      </Link>
    </div>
    <div className="space-y-1 border-l pl-4 py-2">{children}</div>
  </div>
);

const FeedList = ({ items, empty, external }: { items: FeedItem[]; empty: string; external?: boolean }) =>
  items.length > 0 ? (
    <>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center gap-3 py-1">
          {external ? (
            <a href={item.path} target="_blank" rel="noopener noreferrer" title={item.title} className="min-w-0 truncate hover:italic hover:text-codeRed text-xs">
              {item.title}
            </a>
          ) : (
            <Link href={item.path} title={item.title} className="min-w-0 truncate hover:italic hover:text-codeRed text-xs">
              {item.title}
            </Link>
          )}
          <FeedDate date={item.date} />
        </div>
      ))}
    </>
  ) : (
    <p className="py-2 text-sm text-muted-foreground">{empty}</p>
  );

export default async function HomePage() {
  const { essays, notes, bookmarks, microBlogs } = await getHomeFeed();
  const lastUpdated = formatDate(process.env.NEXT_PUBLIC_BUILD_TIME || new Date());

  return (
    <div className="md:container py-10 max-w-6xl font-mono">
      <div className="flex flex-col text-xs text-muted-foreground font-mono max-w-xl mb-6">
        <div className="w-20 h-20 mb-6">
          <AnimatedLogo />
        </div>
        <div>Created: April 10, 2025</div>
        <div>Last updated: {lastUpdated}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 font-mono">
        <div className="md:col-span-2">
          <h1 className="font-medium">Lily's Garden</h1>
          <div className="flex flex-col text-sm text-muted-foreground lg:max-w-xl">
            <div className="mt-3 space-y-2 ">
              <div className="flex items-center">
                <p className="text-sm mr-2 font-nitti">
                  {" "}
                  Hi there wanderer, I'm Lily.{" "}
                </p>{" "}
                <Smile size={14} className="inline-block" />
              </div>
              <p className="text-s font-nitti">
                Welcome to my{" "}
                <Link href="/garden/essays/digital-garden" className="text-codeRed">
                  digital garden
                </Link>{" "}
                and{" "}
                <Link href="/minispace" className="text-codeRed">
                  minispace
                </Link>{" "}
                on the internet where I post about all my little interests,
                ideas, resources, hobbies and life work. I'm super excited to
                have had you wander into my website. There's literally no limit
                to what I can do here.
              </p>
              <p className="text-sm font-nitti">
                I'm currently looking for funding, contract work, or employment.{" "}
                <Link href="/hello" className="text-codeRed">
                  Reach out
                </Link>{" "}
                if you'd like to work together or know of something I'd be a
                good fit for. Here's my career{" "}
                <Link href="/bucket-list" className="text-codeRed">
                  bucket list
                </Link>{" "}
                just to give you an idea of what I'm aiming for.
              </p>
              <p className="text-sm font-nitti">
                Before you go, you should first learn a little{" "}
                <Link href="/about" className="text-codeRed">
                  about me
                </Link>
                , and find out what I'm doing{" "}
                <Link href="/now" className="text-codeRed">
                  now
                </Link>
                . You can also check to see what I'll like to do{" "}
                <Link href="/someday" className="text-codeRed">
                  someday
                </Link>
                . Be sure to leave your footprint by signing my{" "}
                <Link href="/guestbook" className="text-codeRed">
                  guestbook
                </Link>
                .
              </p>
              <div className="py-2">
                <MusicPlayerWidget
                  imageUrl="/images/lily_flower.jpeg"
                  title="Welcome to my digital garden and personal playground!"
                  artist="Written by Lily, recorded with Play.ai"
                />
              </div>
            </div>
          </div>

          {/* Four beds of four pages: sized to end about level with "Recently Tended" beside it. */}
          <div className="mt-8">
            <h2 className="font-medium mb-1">Collections & Pages</h2>
            <p className="text-sm text-muted-foreground mb-6 font-nitti">
              The rest of the garden, planted in beds.
            </p>
            <div className="space-y-8 lg:space-y-10">
              {BEDS.map((bed) => (
                <Bed key={bed.name} bed={bed} />
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="font-medium mb-6">Recently Tended</h2>
          <HomeSearch />

          <FeedSection heading="Essays" href="/garden/essays">
            <FeedList items={essays} empty="No essays found" />
          </FeedSection>

          <FeedSection heading="Notes" href="/garden/notes">
            <FeedList items={notes} empty="No notes found" />
          </FeedSection>

          <FeedSection heading="Bookmarks" href="/garden/bookmarks">
            <FeedList items={bookmarks} empty="No bookmarks found" external />
          </FeedSection>

          <FeedSection heading="MicroBlog" href="/garden/micro-blog">
            {microBlogs.length > 0 ? (
              microBlogs.map((blog) => (
                <div key={blog.id} className="py-1">
                  <div className="text-xs line-clamp-2">{blog.content}</div>
                  <FeedDate date={blog.date} />
                </div>
              ))
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                No microblogs found
              </p>
            )}
          </FeedSection>
        </div>
      </div>
    </div>
  );
}
