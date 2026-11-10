import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { LessonMarkdown } from "@/components/learn/LessonMarkdown";
import { PrevNext } from "@/components/layout/prev-next";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { COURSE, getAllLessons, getLesson, getTracks } from "@/lib/learn";

type Props = { params: Promise<{ track: string; lesson: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLessons().map(({ track, slug }) => ({ track, lesson: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track, lesson: slug } = await params;
  const lesson = getLesson(track, slug);
  return { title: lesson ? `${lesson.title} · ${COURSE.title}` : COURSE.title, description: lesson?.description };
}

export default async function LessonPage({ params }: Props) {
  const { track: trackSlug, lesson: slug } = await params;
  const lesson = getLesson(trackSlug, slug);
  if (!lesson) notFound();

  const track = getTracks().find((candidate) => candidate.slug === trackSlug)!;
  // Back and Next carry on across tracks, so the course reads straight through.
  const all = getAllLessons();
  const position = all.findIndex((other) => other.href === lesson.href);
  const neighbour = (other?: (typeof all)[number]) => (other ? { title: other.title, href: other.href } : undefined);
  const download = (format: "md" | "txt") => `${lesson.href}/download/${format}`;

  return (
    <>
      <ScrollProgress color="bg-primary" height={3} glow={true} />
      <div className="mx-auto w-full max-w-2xl animate-fade-in pb-8 pt-16">
        <header className="mb-8">
          <Link href={track.href} className="font-mono text-xs text-muted-foreground hover:text-foreground">
            ← {track.title}
          </Link>
          <h1 className="mb-2 mt-3 text-xl font-semibold">{lesson.title}</h1>
          <div className="flex flex-col font-mono text-xs text-muted-foreground">
            <div>
              {COURSE.title} · {track.title}, lesson {lesson.number} of {track.lessons.length}
            </div>
            {lesson.updated && <div>Updated: {lesson.updated.slice(0, 10)}</div>}
          </div>
          {lesson.description && <p className="mt-2 text-sm text-muted-foreground">{lesson.description}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Download:</span>
            {(["md", "txt"] as const).map((format) => (
              <a
                key={format}
                href={download(format)}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/60 px-3 py-1 font-mono text-xs transition-colors hover:bg-primary/20"
              >
                <Download size={12} aria-hidden="true" />.{format}
              </a>
            ))}
          </div>
        </header>

        <LessonMarkdown content={lesson.content} />

        <PrevNext prev={neighbour(all[position - 1])} next={neighbour(all[position + 1])} />
      </div>
    </>
  );
}
