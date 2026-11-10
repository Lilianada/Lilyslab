"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Parent paths that are only URL segments and have no page to link to. */
const hasNoPage = (href: string) => /^\/archives\/[^/]+$/.test(href);

/** Names that plain capitalizing would get wrong, like "Html". */
const SPECIAL_LABELS: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  "ai-prompting": "AI prompting",
};

const toLabel = (segment: string) =>
  SPECIAL_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

/**
 * The trail of parent pages, shown after the site title in the top bar.
 * The current page is left out because its own heading sits right below.
 */
export function Breadcrumbs() {
  const segments = (usePathname() || "").split("/").filter(Boolean);

  const parents = segments
    .slice(0, -1)
    .map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join("/")}`,
      label: toLabel(segment),
    }))
    .filter(({ href }) => !hasNoPage(href));

  if (parents.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 overflow-hidden">
      <ol className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
        {parents.map(({ href, label }) => (
          <li key={href} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <Link href={href} className="hover:text-codeRed hover:italic transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
