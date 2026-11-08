import type { Digest, DigestItem } from "@/lib/garden/media-digest";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="relative inline-block text-xs leading-none tracking-wide text-foreground/20" role="img" aria-label={`${rating} out of 5 stars`}>
      ★★★★★
      <span className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-foreground" style={{ width: `${(rating / 5) * 100}%` }} aria-hidden="true">
        ★★★★★
      </span>
    </span>
  );
}

function Entry({ item }: { item: DigestItem }) {
  return (
    <li className="[overflow-wrap:anywhere]">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline decoration-primary decoration-2 underline-offset-2 hover:opacity-70"
          >
            {item.title}
          </a>
        ) : (
          <span className="text-sm">{item.title}</span>
        )}
        {item.by && <span className="text-xs text-muted-foreground">{item.by}</span>}
        {item.rating && <Stars rating={item.rating} />}
      </div>
      {item.note && <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>}
    </li>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-3 sm:grid-cols-[6rem_minmax(0,1fr)]">
      <h3 className="pt-0.5 font-mono text-xs text-muted-foreground">{label}</h3>
      {children}
    </div>
  );
}

const SECTIONS = [
  ["songs", "Listened"],
  ["movies", "Watched"],
  ["shows", "Shows"],
  ["books", "Read"],
  ["podcasts", "Podcasts"],
  ["articles", "Articles"],
] as const;

/** One month of the digest: a short label beside each kind of media. */
export function DigestMonth({ digest }: { digest: Digest }) {
  const sections = SECTIONS.filter(([key]) => digest[key].length > 0);
  const isEmpty = sections.length === 0 && digest.in.length === 0 && digest.out.length === 0;

  return (
    <section id={digest.month} className="scroll-mt-20">
      <h2 className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        <a href={`#${digest.month}`} className="hover:text-foreground">
          {digest.label}
        </a>
      </h2>
      {digest.intro && <p className="mb-2 text-sm">{digest.intro}</p>}

      {isEmpty ? (
        <p className="py-3 text-sm text-muted-foreground">Nothing logged yet.</p>
      ) : (
        <div className="divide-y divide-dashed">
          {sections.map(([key, label]) => (
            <Row key={key} label={label}>
              <ul className="space-y-2">
                {digest[key].map((item) => (
                  <Entry key={item.title} item={item} />
                ))}
              </ul>
            </Row>
          ))}
          {digest.in.length > 0 && (
            <Row label="In">
              <ul className="space-y-1 text-sm">
                {digest.in.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Row>
          )}
          {digest.out.length > 0 && (
            <Row label="Out">
              <ul className="space-y-1 text-sm text-muted-foreground line-through decoration-primary decoration-2">
                {digest.out.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Row>
          )}
        </div>
      )}
    </section>
  );
}
