import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonMarkdown } from "@/components/learn/LessonMarkdown";
import { PrevNext } from "@/components/layout/prev-next";
import { COURSE, getTracks } from "@/lib/learn";

type Props = { params: Promise<{ track: string }> };

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
        <Link href={COURSE.href} className="font-mono text-xs text-muted-foreground hover:text-foreground">
          ← {COURSE.title}
        </Link>
        <h1 className="mb-2 mt-3 text-xl font-medium">{track.title}</h1>
        <div className="flex flex-col font-mono text-xs text-muted-foreground">
          <div>
            Track {position + 1} of {tracks.length}
          </div>
          <div>Lessons: {track.lessons.length}</div>
        </div>
        {track.description && <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>}
      </header>

      {track.intro && (
        <div className="mb-8">
          <LessonMarkdown content={track.intro} />
        </div>
      )}

      {track.lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">The lessons for this track are on their way.</p>
      ) : (
        <ol className="divide-y divide-dashed">
          {track.lessons.map((lesson) => (
            <li key={lesson.slug}>
              <Link href={lesson.href} className="group flex items-start gap-4 py-3">
                <span className="w-6 shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">{String(lesson.number).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium underline decoration-transparent decoration-2 underline-offset-2 transition-colors group-hover:decoration-primary">
                    {lesson.title}
                  </span>
                  {lesson.description && <span className="mt-0.5 block text-xs text-muted-foreground">{lesson.description}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <PrevNext prev={neighbour(tracks[position - 1])} next={neighbour(tracks[position + 1])} />
    </div>
  );
}
