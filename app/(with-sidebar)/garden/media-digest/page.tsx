import type { Metadata } from "next";
import { DigestMonth } from "@/components/digital-garden/media-digest/DigestMonth";
import { getDigests } from "@/lib/garden/media-digest";

export const metadata: Metadata = {
  title: "Media Digest",
  description: "A monthly log of the songs, films, shows, podcasts, books and articles I've been enjoying.",
};

export default function MediaDigestPage() {
  const digests = getDigests();

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in pb-8 pt-16">
      <header className="mb-10">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Media Digest</h1>
        <div className="flex flex-col font-mono text-xs text-muted-foreground">
          <div>Created: 2026-11-06</div>
          {digests[0] && <div>Latest month: {digests[0].label}</div>}
          <div>Months logged: {digests.length}</div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          A monthly log of the songs, films, shows, podcasts, books and articles I&apos;ve been enjoying.
        </p>
      </header>

      {digests.length === 0 ? (
        <p className="text-sm text-muted-foreground">The first month is on its way.</p>
      ) : (
        <div className="space-y-10">
          {digests.map((digest) => (
            <DigestMonth key={digest.month} digest={digest} />
          ))}
        </div>
      )}
    </div>
  );
}
