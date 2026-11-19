import Link from "next/link";
import { getBacklinks, getGardenPosts, getRelated } from "@/lib/garden/posts";
import { getTopic } from "@/lib/garden/topics";
import { GardenPostRow } from "./GardenPostRow";

/**
 * The paths out of a post: posts that link here, a few related ones, and the
 * topic it's planted in. Rendered at the bottom of every essay and note.
 */
export function PostConnections({ href }: { href: string }) {
  const post = getGardenPosts().find((p) => p.href === href);
  if (!post) return null;
  const backlinks = getBacklinks(href);
  const related = getRelated(href);
  const topic = getTopic(post.topicId);

  return (
    <nav aria-label="Connected posts" className="mt-16 space-y-8 border-t border-border pt-8">
      {backlinks.length > 0 && (
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">Linked from</h2>
          <ul>
            {backlinks.map((p) => (
              <GardenPostRow key={p.href} post={p} showDate={false} />
            ))}
          </ul>
        </section>
      )}
      {related.length > 0 && (
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">Related</h2>
          <ul>
            {related.map((p) => (
              <GardenPostRow key={p.href} post={p} showDate={false} />
            ))}
          </ul>
        </section>
      )}
      {topic && (
        <p className="font-mono text-xs text-muted-foreground">
          Planted in{" "}
          <Link href={`/garden/topics/${topic.id}`} className="text-foreground underline underline-offset-4 hover:text-primary">
            {topic.title}
          </Link>{" "}
          ·{" "}
          <Link href="/garden" className="underline underline-offset-4 hover:text-foreground">
            See the whole garden
          </Link>
        </p>
      )}
    </nav>
  );
}
