import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DigestIssue } from "@/components/digital-garden/media-digest/DigestIssue";
import { getDigests } from "@/lib/garden/media-digest";

type Props = { params: Promise<{ month: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getDigests().map(({ month }) => ({ month }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const digest = getDigests().find((issue) => issue.month === month);
  return { title: digest ? `${digest.label} Digest` : "Media Digest" };
}

export default async function MediaDigestIssuePage({ params }: Props) {
  const { month } = await params;
  const digests = getDigests();
  const digest = digests.find((issue) => issue.month === month);
  if (!digest) notFound();

  return <DigestIssue digest={digest} allDigests={digests} />;
}
