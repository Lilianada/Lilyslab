import Link from "next/link";
import { Leaf, Sprout, TreeDeciduous } from "lucide-react";
import { STAGES, type Stage } from "@/lib/garden/topics";

const ICONS = { seedling: Sprout, budding: Leaf, evergreen: TreeDeciduous } as const;

/** A small icon for how grown a post is, with its meaning on hover. */
export function StageIcon({ stage, size = 13, className = "" }: { stage: Stage; size?: number; className?: string }) {
  const Icon = ICONS[stage];
  const { label, description } = STAGES[stage];
  return (
    <span title={`${label}: ${description}`} className={`inline-flex shrink-0 text-muted-foreground ${className}`}>
      <Icon size={size} strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

const shortDate = (day: string) =>
  day ? new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";

/** One essay or note in a garden list: stage, title, kind, and when it was last tended. */
export function GardenPostRow({
  post,
  showDate = true,
  truncate = false,
}: {
  post: { href: string; title: string; kind: "essay" | "note"; stage: Stage; lastUpdated: string };
  showDate?: boolean;
  /** Keep the title to one line (the full title shows on hover). */
  truncate?: boolean;
}) {
  return (
    <li>
      <Link href={post.href} title={truncate ? post.title : undefined} className="group flex items-baseline gap-2.5 py-1.5 text-sm">
        <StageIcon stage={post.stage} className="translate-y-0.5" />
        <span
          className={`min-w-0 flex-1 group-hover:text-primary group-hover:underline group-hover:underline-offset-4 ${
            truncate ? "truncate" : "[overflow-wrap:anywhere]"
          }`}
        >
          {post.title}
        </span>
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {post.kind}
          {showDate && post.lastUpdated && <span className="max-sm:hidden"> · {shortDate(post.lastUpdated)}</span>}
        </span>
      </Link>
    </li>
  );
}

/** The key to the stage icons. */
export function StageLegend() {
  return (
    <ul className="flex flex-col gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
      {(Object.keys(STAGES) as Stage[]).map((stage) => (
        <li key={stage} className="inline-flex items-center gap-1.5">
          <StageIcon stage={stage} size={12} />
          {STAGES[stage].label}: <span className="opacity-80">{STAGES[stage].description.toLowerCase()}</span>
        </li>
      ))}
    </ul>
  );
}
