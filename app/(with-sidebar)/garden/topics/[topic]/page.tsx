import Link from "next/link";
import { notFound } from "next/navigation";
import { byLastTended, getGardenPosts } from "@/lib/garden/posts";
import { STAGES, TOPICS, getTopic, type Stage } from "@/lib/garden/topics";
import { GardenPostRow, StageIcon } from "@/components/garden/GardenPostRow";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topic: topic.id }));
}

export async function generateMetadata({ params }: Props) {
  const topic = getTopic((await params).topic);
  return topic ? { title: `${topic.title} · Garden`, description: topic.blurb } : { title: "Topic not found" };
}

const STAGE_ORDER: Stage[] = ["evergreen", "budding", "seedling"];

/** One topic's bed: its introduction, then every essay and note in it, most finished first. */
export default async function TopicPage({ params }: Props) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();

  const posts = getGardenPosts()
    .filter((post) => post.topicId === topic.id)
    .sort(byLastTended);
  const others = TOPICS.filter((t) => t.id !== topic.id);

  return (
    <div className="mx-auto max-w-2xl animate-fade-in pb-8 pt-16 sm:px-4">
      <header className="mb-10">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">{topic.title}</h1>
        <p className="font-mono text-xs text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} · newest growth first
        </p>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">{topic.intro}</p>
      </header>

      {STAGE_ORDER.map((stage) => {
        const group = posts.filter((post) => post.stage === stage);
        if (group.length === 0) return null;
        return (
          <section key={stage} className="mb-10" aria-labelledby={`stage-${stage}`}>
            <h2 id={`stage-${stage}`} className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <StageIcon stage={stage} size={12} />
              {STAGES[stage].label}
              <span className="normal-case tracking-normal opacity-70">· {STAGES[stage].description.toLowerCase()}</span>
            </h2>
            <ul className="divide-y divide-border/60">
              {group.map((post) => (
                <GardenPostRow key={post.href} post={post} />
              ))}
            </ul>
          </section>
        );
      })}

      {posts.length === 0 && <p className="text-sm text-muted-foreground">Nothing planted here yet.</p>}

      <nav aria-label="Other topics" className="mt-16 border-t border-border pt-6">
        <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">Other topics</h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((t) => (
            <li key={t.id}>
              <Link
                href={`/garden/topics/${t.id}`}
                className="inline-block rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
