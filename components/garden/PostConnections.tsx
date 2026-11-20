import Link from "next/link";
import { getBacklinks, getGardenPosts, getMentions, getRelated, type GardenPost } from "@/lib/garden/posts";
import { getTopic } from "@/lib/garden/topics";
import { GardenPostRow } from "./GardenPostRow";

/** How many posts a list shows before the rest fold away behind "N more". */
const SHOWN = 3;

/** A short list of posts; anything past the first few folds away so phones stay tidy. */
function ConnectionList({ title, hint, posts, empty }: { title: string; hint: string; posts: GardenPost[]; empty?: string }) {
  if (posts.length === 0 && !empty) return null;
  const rows = (list: GardenPost[]) =>
    list.map((p) => <GardenPostRow key={p.href} post={p} showDate={false} truncate />);

  return (
    <section className="min-w-0">
      <h2 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground" title={hint}>
        {title}
        {posts.length > 0 && <span className="ml-1.5 opacity-70">{posts.length}</span>}
      </h2>
      {posts.length === 0 ? (
        <p className="py-1.5 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <>
          <ul>{rows(posts.slice(0, SHOWN))}</ul>
          {posts.length > SHOWN && (
            <details className="group/more">
              <summary className="cursor-pointer list-none py-1 font-mono text-xs text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span className="group-open/more:hidden">{posts.length - SHOWN} more</span>
                <span className="hidden group-open/more:inline">Show fewer</span>
              </summary>
              <ul>{rows(posts.slice(SHOWN))}</ul>
            </details>
          )}
        </>
      )}
    </section>
  );
}

/**
 * The paths out of a post, at the bottom of every essay and note. All of it is
 * worked out from the writing itself, so nothing here needs updating by hand:
 * - Backlinks: posts that link here with [[double brackets]]
 * - Mentioned in: posts that name this one without linking it
 * - Related: posts named under `related:` in the front matter, then posts
 *   sharing its tags and topic
 */
export function PostConnections({ href }: { href: string }) {
  const post = getGardenPosts().find((p) => p.href === href);
  if (!post) return null;
  const backlinks = getBacklinks(href);
  const mentions = getMentions(href);
  const related = getRelated(href);
  const topic = getTopic(post.topicId);

  return (
    <nav aria-label="Connected posts" className="mt-16 space-y-6 border-t border-border pt-8">
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-8">
        <ConnectionList
          title="Backlinks"
          hint="Posts that link here"
          posts={backlinks}
          empty="Nothing links here yet."
        />
        <ConnectionList title="Mentioned in" hint="Posts that name this one without linking it" posts={mentions} />
        <ConnectionList title="Related" hint="Posts on similar things" posts={related} />
      </div>
      
    </nav>
  );
}
