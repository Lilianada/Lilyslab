import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonMarkdown } from "@/components/learn/LessonMarkdown";
import { LIST_CLASS, NUMBER_CLASS, ROW_CLASS, number } from "@/components/learn/TrackList";
import { PrevNext } from "@/components/layout/prev-next";
import { COURSE, getTracks, type LessonSummary } from "@/lib/learn";

type Props = { params: Promise<{ track: string }> };

/** Runs of lessons that share a section, in lesson order. */
function groupBySection(lessons: LessonSummary[]) {
  const groups: { section?: string; lessons: LessonSummary[] }[] = [];
  for (const lesson of lessons) {
    const last = groups[groups.length - 1];
    if (last && last.section === lesson.section) last.lessons.push(lesson);
    else groups.push({ section: lesson.section, lessons: [lesson] });
  }
  return groups;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getTracks().map(({ slug }) => ({ track: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: slug } = await params;
  const track = getTracks().find((candidate) => candidate.slug === slug);
  return { title: track ? `${track.title} · ${COURSE.title}` : COURSE.title, description: track?.description };
}

export default async function TrackPage({ params }: Props) {
  const { track: slug } = await params;
  const tracks = getTracks();
  const position = tracks.findIndex((candidate) => candidate.slug === slug);
  const track = tracks[position];
  if (!track) notFound();

  const neighbour = (other?: (typeof tracks)[number]) => (other ? { title: other.title, href: other.href } : undefined);

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in pb-8 pt-16">
      <header className="mb-8">
        <Link href="/resources" className="font-mono text-xs text-muted-foreground hover:text-foreground">
          ← Resources
        </Link>
        <h1 className="mb-2 mt-3 text-xl font-medium">{track.title}</h1>
        <div className="flex flex-col font-mono text-xs text-muted-foreground">
          <div>
            Track {position + 1} of {tracks.length}
          </div>
          <div>Lessons: {track.lessons.length}</div>
        </div>
        {track.description && <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>}
        {position === 0 && (
          <Link
            href="/garden/essays/why-you-should-own-a-website"
            className="mt-4 inline-block text-sm underline decoration-primary decoration-2 underline-offset-2 hover:opacity-70"
          >
            Start with: Why you should own your own website →
          </Link>
        )}
      </header>

      {track.intro && (
        <div className="mb-8">
          <LessonMarkdown content={track.intro} />
        </div>
      )}

      {track.lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">The lessons for this track are on their way.</p>
      ) : (
        <div className="space-y-8">
          {groupBySection(track.lessons).map((group, index) => (
            <section key={`${group.section ?? ""}-${index}`}>
              {group.section && (
                <h2 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">{group.section}</h2>
              )}
              <ol start={group.lessons[0].number} className={LIST_CLASS}>
                {group.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link href={lesson.href} className={ROW_CLASS}>
                      <span className={NUMBER_CLASS}>{number(lesson.number)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{lesson.title}</span>
                        {lesson.description && <span className="mt-0.5 block text-xs text-muted-foreground">{lesson.description}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}

      <PrevNext prev={neighbour(tracks[position - 1])} next={neighbour(tracks[position + 1])} />
    </div>
  );
}
