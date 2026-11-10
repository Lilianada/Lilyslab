import Link from "next/link";
import type { Track } from "@/lib/learn";

/** Shared look for the numbered lists on Resources and the track pages. */
export const LIST_CLASS = "divide-y divide-dashed";
export const ROW_CLASS = "group flex items-start gap-4 py-3 transition-colors hover:bg-muted/50";
export const NUMBER_CLASS = "w-6 shrink-0 pt-0.5 font-mono text-xs text-muted-foreground";
export const number = (position: number) => String(position).padStart(2, "0");

const plural = (count: number) => `${count} ${count === 1 ? "lesson" : "lessons"}`;

type TrackListItem = Pick<Track, "slug" | "title" | "description" | "href"> & { lessons: unknown[] };

/** The course's tracks in order, each with its lesson count. */
export function TrackList({ tracks }: { tracks: TrackListItem[] }) {
  return (
    <ol className={LIST_CLASS}>
      {tracks.map((track, index) => (
        <li key={track.slug}>
          <Link href={track.href} className={ROW_CLASS}>
            <span className={NUMBER_CLASS}>{number(index + 1)}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{track.title}</span>
              {track.description && <span className="mt-0.5 block text-xs text-muted-foreground">{track.description}</span>}
            </span>
            <span className="shrink-0 pt-0.5 font-mono text-[11px] text-muted-foreground">
              {track.lessons.length > 0 ? plural(track.lessons.length) : "coming soon"}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
