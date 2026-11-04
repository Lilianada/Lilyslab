import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RandomThought } from "@/components/micro-blog/RandomThought";
import { ThoughtHeart } from "@/components/micro-blog/ThoughtHeart";
import { getMicroBlogs, type MicroBlogItem } from "@/lib/garden-index";

export const metadata: Metadata = {
  title: "Micro-blog",
  description: "Short-form thoughts and musings that don't warrant a full essay.",
};

const formatDate = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });

function groupByMonth(posts: MicroBlogItem[]) {
  const months = new Map<string, MicroBlogItem[]>();
  for (const post of posts) {
    const month = formatDate(post.date, { month: "long", year: "numeric" });
    months.set(month, [...(months.get(month) ?? []), post]);
  }
  return [...months.entries()];
}

export default function MicroBlogPage() {
  const posts = getMicroBlogs();

  return (
    <div className="max-w-2xl w-full mx-auto pt-16 pb-8 animate-fade-in">
      <header className="mb-10">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Micro-blog</h1>
        <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <div>Created: 2025-04-15</div>
          {posts[0] && <div>Last thought: {posts[0].date.slice(0, 10)}</div>}
          <div>Thoughts so far: {posts.length}</div>
          <div>
            Inspired by:{" "}
            <a href="https://fromemily.com/feedbackless-feed/" className="text-paleYellow hover:underline">
              FromEmily
            </a>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          Short-form thoughts and musings that don't warrant a full essay.
        </p>
        {posts.length > 1 && <RandomThought ids={posts.map((post) => post.id)} />}
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here yet. Check back soon!</p>
      ) : (
        <div className="space-y-10">
          {groupByMonth(posts).map(([month, monthPosts]) => (
            <section key={month}>
              <h2 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">{month}</h2>
              <div className="divide-y divide-dashed">
                {monthPosts.map((post) => (
                  <article
                    key={post.id}
                    id={post.id}
                    className="-mx-3 scroll-mt-20 rounded-md px-3 py-4 transition-colors duration-500 target:bg-accent/60"
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words font-nitti text-[14px] leading-relaxed [&_p]:my-2 [&_ul]:my-2 [&_a]:text-codeRed [&>:first-child]:mt-0 [&>:last-child]:mb-0">
                      <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <a
                        href={`#${post.id}`}
                        className="font-mono text-[11px] text-muted-foreground hover:text-codeRed hover:italic"
                        title="Link to this thought"
                      >
                        {formatDate(post.date, { month: "short", day: "numeric" })}
                      </a>
                      <ThoughtHeart id={post.id} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
