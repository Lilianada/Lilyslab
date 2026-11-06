import Link from "next/link";
import { Music } from "lucide-react";
import type { ReactNode } from "react";
import type { Digest, DigestItem } from "@/lib/garden/media-digest";

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

function hashTitle(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

/** Wraps an entry in its link, when it has one. */
function MaybeLink({ url, className, children }: { url?: string; className?: string; children: ReactNode }) {
  if (!url) return <div className={className}>{children}</div>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`block transition-opacity hover:opacity-80 ${className ?? ""}`}>
      {children}
    </a>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="relative inline-block text-sm leading-none tracking-wide text-primary/30" role="img" aria-label={`${rating} out of 5 stars`}>
      ★★★★★
      <span className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-primary" style={{ width: `${(rating / 5) * 100}%` }} aria-hidden="true">
        ★★★★★
      </span>
    </span>
  );
}

function Cover({ item, className }: { item: DigestItem; className: string }) {
  if (!item.cover) return null;
  const tilt = TILTS[hashTitle(item.title) % TILTS.length];
  // Covers come from many sites, so these are plain images rather than next/image.
  return <img src={item.cover} alt="" loading="lazy" className={`shrink-0 rounded object-cover shadow-sm ${tilt} ${className}`} />;
}

function SongCard({ song }: { song: DigestItem }) {
  const played = 20 + (hashTitle(song.title) % 65);
  return (
    <MaybeLink url={song.url} className="rounded-xl border border-primary/40 bg-primary/10 p-3">
      <div className="flex items-center gap-3">
        {song.cover ? (
          <Cover item={song} className="h-11 w-11" />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-primary/25" aria-hidden="true">
            <Music size={16} />
          </span>
        )}
        <span className="min-w-0 [overflow-wrap:anywhere]">
          <span className="block text-sm font-medium">{song.title}</span>
          {song.by && <span className="block text-xs text-muted-foreground">{song.by}</span>}
        </span>
      </div>
      <span className="mt-3 block h-1 overflow-hidden rounded-full bg-primary/25" aria-hidden="true">
        <span className="block h-full rounded-full bg-primary" style={{ width: `${played}%` }} />
      </span>
      {song.note && <span className="mt-2 block text-xs text-muted-foreground">{song.note}</span>}
    </MaybeLink>
  );
}

function ArticleCard({ article }: { article: DigestItem }) {
  return (
    <MaybeLink url={article.url} className="rounded-lg border border-border bg-card p-4 [overflow-wrap:anywhere]">
      {article.by && <span className="mb-1 block font-mono text-xs uppercase text-muted-foreground">{article.by}</span>}
      <span className="block text-base font-semibold leading-snug">{article.title}</span>
      {article.note && <span className="mt-1.5 block text-xs text-muted-foreground">{article.note}</span>}
    </MaybeLink>
  );
}

/** Movies, shows, books and podcasts: a title, and whatever else was written down. */
function Entry({ item }: { item: DigestItem }) {
  return (
    <MaybeLink url={item.url} className="flex items-start gap-3">
      <Cover item={item} className="h-20 w-14" />
      <span className="min-w-0 [overflow-wrap:anywhere]">
        <span className="block text-sm font-medium">{item.title}</span>
        {item.by && <span className="block text-xs text-muted-foreground">{item.by}</span>}
        {item.rating && (
          <span className="mt-1 block">
            <Stars rating={item.rating} />
          </span>
        )}
        {item.note && <span className="mt-1 block text-xs text-muted-foreground">{item.note}</span>}
      </span>
    </MaybeLink>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10 break-inside-avoid">
      <h2 className="mb-3 font-poem text-2xl italic">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** A little ink stamp with the issue's month in the middle. */
function Postmark({ label }: { label: string }) {
  const [month, year] = label.split(" ");
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-20 w-20 shrink-0 rotate-12 text-primary sm:h-28 sm:w-28">
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path id="postmark-ring" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" fill="none" />
      <text fill="currentColor" fontSize="10.5" fontFamily="monospace" letterSpacing="1.8">
        <textPath href="#postmark-ring">LILY&apos;S GARDEN * MEDIA DIGEST *</textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" fill="currentColor" fontSize="15" fontFamily="monospace" fontWeight="bold">
        {month.slice(0, 3).toUpperCase()}
      </text>
      <text x="60" y="75" textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="monospace">
        {year}
      </text>
    </svg>
  );
}

export function DigestIssue({ digest, allDigests }: { digest: Digest; allDigests: Digest[] }) {
  const hasEntries = [digest.songs, digest.podcasts, digest.movies, digest.shows, digest.books, digest.articles, digest.in, digest.out].some(
    (list) => list.length > 0
  );

  return (
    <div className="mx-auto w-full max-w-5xl animate-fade-in pb-8 pt-16 sm:px-4">
      <header className="mb-12 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-poem text-4xl leading-tight sm:text-6xl">the {digest.label.toLowerCase()} digest</h1>
          {digest.intro && <p className="mt-4 max-w-xl text-sm text-muted-foreground">{digest.intro}</p>}
        </div>
        <Postmark label={digest.label} />
      </header>

      {hasEntries ? (
        <div className="gap-10 md:columns-2 lg:columns-3">
          {digest.songs.length > 0 && (
            <Section title="listened to:">
              {digest.songs.map((song) => (
                <SongCard key={song.title} song={song} />
              ))}
            </Section>
          )}
          {digest.movies.length > 0 && (
            <Section title="watched:">
              {digest.movies.map((movie) => (
                <Entry key={movie.title} item={movie} />
              ))}
            </Section>
          )}
          {digest.books.length > 0 && (
            <Section title="read:">
              {digest.books.map((book) => (
                <Entry key={book.title} item={book} />
              ))}
            </Section>
          )}
          {digest.shows.length > 0 && (
            <Section title="series & shows:">
              {digest.shows.map((show) => (
                <Entry key={show.title} item={show} />
              ))}
            </Section>
          )}
          {digest.articles.length > 0 && (
            <Section title="articles:">
              {digest.articles.map((article) => (
                <ArticleCard key={article.title} article={article} />
              ))}
            </Section>
          )}
          {digest.podcasts.length > 0 && (
            <Section title="podcasts:">
              {digest.podcasts.map((podcast) => (
                <Entry key={podcast.title} item={podcast} />
              ))}
            </Section>
          )}
          {digest.in.length > 0 && (
            <Section title="in:">
              <ul className="space-y-1.5 text-sm">
                {digest.in.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Section>
          )}
          {digest.out.length > 0 && (
            <Section title="out:">
              <ul className="space-y-1.5 text-sm text-muted-foreground line-through decoration-primary">
                {digest.out.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing logged yet this month.</p>
      )}

      {allDigests.length > 1 && (
        <nav aria-label="Past digests" className="mt-6 border-t border-dashed border-border pt-6">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">Past digests</h2>
          <ul className="flex flex-wrap gap-2">
            {allDigests.map(({ month, label }) => (
              <li key={month}>
                <Link
                  href={`/garden/media-digest/${month}`}
                  aria-current={month === digest.month ? "page" : undefined}
                  className={`block rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                    month === digest.month
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
