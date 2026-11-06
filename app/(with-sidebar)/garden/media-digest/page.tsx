import type { Metadata } from "next";
import { DigestIssue } from "@/components/digital-garden/media-digest/DigestIssue";
import { getDigests } from "@/lib/garden/media-digest";

export const metadata: Metadata = {
  title: "Media Digest",
  description: "A monthly roundup of the songs, films, shows, podcasts, books and articles I've been enjoying.",
};

export default function MediaDigestPage() {
  const digests = getDigests();

  if (digests.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl pb-8 pt-16 sm:px-4">
        <h1 className="mb-4 font-poem text-4xl">the media digest</h1>
        <p className="text-sm text-muted-foreground">The first issue is on its way.</p>
      </div>
    );
  }

  return <DigestIssue digest={digests[0]} allDigests={digests} />;
}
