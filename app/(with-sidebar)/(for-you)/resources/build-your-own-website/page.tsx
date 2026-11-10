import type { Metadata } from "next";
import Link from "next/link";
import { TrackList } from "@/components/learn/TrackList";
import { COURSE, getAllLessons, getTracks } from "@/lib/learn";

export const metadata: Metadata = {
  title: COURSE.title,
  description:
    "A free course for people with no tech background who want a website of their own: how the web works, HTML, CSS, JavaScript, AI prompting, design basics and deployment.",
};

export default function CoursePage() {
  const tracks = getTracks();
  const lessonCount = getAllLessons().length;
  const firstLesson = tracks.find((track) => track.lessons.length > 0)?.lessons[0];

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in pb-8 pt-16">
      <header className="mb-8">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">{COURSE.title}</h1>
        <div className="flex flex-col font-mono text-xs text-muted-foreground">
          <div>Created: November 10, 2026</div>
          <div>Tracks: {tracks.length}</div>
          <div>Lessons so far: {lessonCount}</div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          A free course for anyone who wants their own corner of the internet, no tech background needed. AI has made building a
          website easier than ever, and these lessons walk you through the basics, one step at a time. Start at the beginning, or
          jump to the part you need. Every lesson can be downloaded to read later.
        </p>
        {firstLesson && (
          <Link
            href={firstLesson.href}
            className="mt-4 inline-block text-sm underline decoration-primary decoration-2 underline-offset-2 hover:opacity-70"
          >
            Start with the first lesson →
          </Link>
        )}
      </header>

      <h2 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">The tracks</h2>
      <TrackList tracks={tracks} />

      <p className="mt-10 text-sm text-muted-foreground">
        Looking for more? My{" "}
        <Link href="/resources" className="text-foreground underline decoration-primary decoration-2 underline-offset-2">
          resources
        </Link>{" "}
        page has other courses, videos and tools I recommend.
      </p>
    </div>
  );
}
