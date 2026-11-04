import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Smile } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getHomeFeed, type FeedItem } from "@/lib/garden-index";
import AnimatedLogo from "@/components/comps/AnimatedLogo";
import { MusicPlayerWidget } from "@/components/audio/music-player-widget";
import { HomeSearch } from "@/components/home/HomeSearch";
import { InteractiveFlower } from "@/components/interactive-flower";
import { WanderButton } from "@/components/fun/WanderButton";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const collections = [
  { title: "poems", description: "Poems I've written.", path: "/garden/poems" },
  { title: "bookshelf", description: "My reading list.", path: "/garden/bookshelf" },
  { title: "playground", description: "Games, toys and experiments.", path: "/playground" },
  { title: "projects", description: "Projects I worked on.", path: "/projects" },
  { title: "webroll", description: "Links to my fav websites.", path: "/webroll" },
  { title: "quotes", description: "Collection of quotes.", path: "/quotes" },
];

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getUTCFullYear()}`;
};

const CollectionItem = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) => (
  <div className="border border-dashed border-codeRed rounded-md p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:-rotate-1">
    <Link href={path} className="block h-full">
      <h3 className="font-medium text-sm mb-1 capitalize">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Link>
  </div>
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
            <a href={item.path} target="_blank" rel="noopener noreferrer" className="hover:italic hover:text-codeRed text-sm">
              {item.title}
            </a>
          ) : (
            <Link href={item.path} className="hover:italic hover:text-codeRed text-xs">
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
    <div className="md:container py-10 max-w-6xl">
      <div className="flex flex-col text-xs text-muted-foreground font-mono max-w-xl mb-6">
        <div className="w-20 h-20 mb-6">
          <AnimatedLogo />
        </div>
        <div>Created: April 10, 2025</div>
        <div>Last updated: {lastUpdated}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 font-mono">
        <div className="md:col-span-2">
          <h2 className="font-medium">Intro</h2>
          <div className="flex flex-col text-sm text-muted-foreground lg:max-w-xl">
            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <p className="text-sm mr-2">Hiii there </p> <Smile size={14} className="inline-block" />
              </div>
              <p className="text-sm">
                Welcome to my digital home and mini space on the internet. My name is Lily and I'm super excited to
                house you for the time you'll be here. This is a space where I'm free to express myself in whatever
                medium I choose. Could be through code, images, sounds, and words. There's literally no limit to what I
                can do here.
              </p>
              <p className="text-sm">
                I've put in a lot of thoughts and efforts into building everything you see and interact with in this
                space. I try to make this website a living representation of my personal space; small, cozy and with
                lots of depth. Be sure to leave your footprint by signing my{" "}
                <Link href="/guestbook" className="text-codeRed">
                  guestbook
                </Link>
                .
              </p>
              <p className="text-sm">
                You should first learn a little more{" "}
                <Link href="/about" className="text-codeRed">
                  about me
                </Link>
                , then find out what I'm currently up to at the moment by checking the{" "}
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
                <MusicPlayerWidget
                  imageUrl="/images/lily_flower.jpeg"
                  title="Welcome to my digital garden and personal playground!"
                  artist="Written by Lily, recorded with Play.ai"
                />
              </div>

              <p className="text-sm">
                If you like to read amateur musings/essays/poems, check my{" "}
                <Link href="/garden" className="text-codeRed">
                  garden
                </Link>
                . You can find my recently published on the right (for web) or below (for mobile). Or, if you're not
                sure where to start, <WanderButton variant="link" />.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-medium mb-6">Collections & Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map((collection) => (
                <CollectionItem key={collection.title} {...collection} />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-medium mb-1">Grow Something</h2>
            <p className="text-sm text-muted-foreground mb-4">
              It's a garden, after all. Your flowers stay on this device, waiting for you to come back.
            </p>
            <InteractiveFlower />
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="font-medium mb-6">Recently Published</h2>
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
              <p className="py-2 text-sm text-muted-foreground">No microblogs found</p>
            )}
          </FeedSection>
        </div>
      </div>
    </div>
  );
}
