import Link from "next/link";

export interface PrevNextLink {
  href: string;
  title: string;
}

const PagerLink = ({ link, direction }: { link: PrevNextLink; direction: "prev" | "next" }) => {
  const isNext = direction === "next";

  return (
    <Link
      href={link.href}
      rel={direction}
      className={`group min-w-0 rounded-md p-2 transition-colors hover:bg-accent/50 ${isNext ? "text-right" : "text-left"}`}
    >
      <span className="block text-xs text-muted-foreground">{isNext ? "Next →" : "← Prev"}</span>
      <span className="block truncate text-sm group-hover:text-codeRed group-hover:italic">{link.title}</span>
    </Link>
  );
};

/** Links to the neighbouring pages in a series, such as essays or playground toys. */
export function PrevNext({ prev, next }: { prev?: PrevNextLink; next?: PrevNextLink }) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Previous and next pages" className="mt-12 grid grid-cols-2 gap-4 border-t border-dashed pt-4 font-mono">
      {prev ? <PagerLink link={prev} direction="prev" /> : <span />}
      {next && <PagerLink link={next} direction="next" />}
    </nav>
  );
}
