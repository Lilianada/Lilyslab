import type { Metadata } from "next";

/** The site's public address, with no trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://lilyslab.xyz").replace(/\/$/, "");

export const AUTHOR = {
  name: "Lilian Ada",
  alternateName: "Lily",
  url: SITE_URL,
  /** Pages that are also you, for search engines tying them together. */
  sameAs: ["https://github.com/lilianada", "https://linkedin.com/in/lilianada", "https://twitter.com/lilian_ada_"],
};

/**
 * A search-result-sized summary (about 155 characters) from a post's markdown,
 * for posts with no `excerpt` or `description` in their front matter.
 */
export function describe(markdown: string, fallback = ""): string {
  const text = markdown
    .replace(/^---[\s\S]*?---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s.*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[\[([^\]|]*)\|?([^\]]*)\]\]/g, (_m, target: string, label: string) => label || target)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[\^[^\]]*\]:?/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`>#|~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return fallback;
  if (text.length <= 155) return text;
  const cut = text.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 100 ? cut.lastIndexOf(" ") : 155).replace(/[,;:.\s]+$/, "")}…`;
}

const iso = (value: unknown) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return isNaN(date.getTime()) ? undefined : date.toISOString();
};

type PostInput = {
  title: string;
  description: string;
  path: string;
  createdAt?: unknown;
  lastUpdated?: unknown;
  tags?: string[];
  section?: string;
};

/** Title, description, canonical address and share-card details for an essay or note. */
export function postMetadata({ title, description, path, createdAt, lastUpdated, tags = [], section }: PostInput): Metadata {
  return {
    title,
    description,
    keywords: tags,
    authors: [{ name: AUTHOR.name, url: SITE_URL }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
      siteName: "Lily's Lab",
      publishedTime: iso(createdAt),
      modifiedTime: iso(lastUpdated || createdAt),
      authors: [AUTHOR.name],
      tags,
      section,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** schema.org data describing an essay or note, so search engines know who wrote it and when. */
export function articleJsonLd({ title, description, path, createdAt, lastUpdated, tags = [] }: PostInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
    datePublished: iso(createdAt),
    dateModified: iso(lastUpdated || createdAt),
    keywords: tags.join(", ") || undefined,
    image: `${SITE_URL}/opengraph-image`,
    author: { "@type": "Person", name: AUTHOR.name, url: SITE_URL },
    publisher: { "@type": "Person", name: AUTHOR.name, url: SITE_URL },
  };
}
