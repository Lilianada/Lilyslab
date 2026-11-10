import Link from "next/link";
import type { Track } from "@/lib/learn";

const plural = (count: number) => `${count} ${count === 1 ? "lesson" : "lessons"}`;

/** The course's tracks in order, each with its lesson count. */
export function TrackList({ tracks }: { tracks: Track[] }) {
  return (
    <ol className="divide-y divide-dashed">
      {tracks.map((track, index) => (
        <li key={track.slug}>
          <Link href={track.href} className="group flex items-start gap-4 py-3">
            <span className="w-6 shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium underline decoration-transparent decoration-2 underline-offset-2 transition-colors group-hover:decoration-primary">
                {track.title}
              </span>
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
