import { Sparkles } from "lucide-react";

/**
 * Shown on essays and notes marked `aiEdited: true` in their frontmatter:
 * I wrote them, and used AI to edit (not write) them.
 */
export function AiEditedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-dashed border-border px-1.5 py-px font-mono text-[10px] leading-4 text-muted-foreground ${className}`}
      title="Written by me, edited with AI"
    >
      <Sparkles size={10} aria-hidden="true" />
      AI-edited
      <span className="sr-only">: written by me, edited with AI</span>
    </span>
  );
}

/** Frontmatter can say `aiEdited: true` (or the looser `ai: edited`). */
export const isAiEdited = (data: Record<string, unknown>) => data.aiEdited === true || data.ai === "edited";
