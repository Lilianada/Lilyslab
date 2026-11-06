import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface DigestItem {
  title: string;
  by?: string;
  url?: string;
  /** Out of 5. Halves are fine. */
  rating?: number;
  note?: string;
  cover?: string;
}

export interface Digest {
  /** YYYY-MM, from the file name. */
  month: string;
  /** For example, "November 2026". */
  label: string;
  intro?: string;
  songs: DigestItem[];
  podcasts: DigestItem[];
  movies: DigestItem[];
  shows: DigestItem[];
  books: DigestItem[];
  articles: DigestItem[];
  in: string[];
  out: string[];
}

const DIGEST_DIR = path.join(process.cwd(), "Content", "mediaDigest");

const optionalText = (value: unknown) => (value == null || value === "" ? undefined : String(value));

function optionalUrl(value: unknown, pattern: RegExp) {
  const text = optionalText(value);
  return text && pattern.test(text) ? text : undefined;
}

function toItems(value: unknown): DigestItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry): DigestItem[] => {
    // A plain line is enough: "- Girl from Nowhere".
    if (typeof entry !== "object" || entry === null) {
      const title = optionalText(entry);
      return title ? [{ title }] : [];
    }

    const fields = entry as Record<string, unknown>;
    const title = optionalText(fields.title);
    if (!title) return [];

    const rating = Number(fields.rating);
    return [
      {
        title,
        by: optionalText(fields.by),
        url: optionalUrl(fields.url, /^https?:\/\//i),
        rating: Number.isFinite(rating) && rating > 0 ? Math.min(Math.round(rating * 2) / 2, 5) : undefined,
        note: optionalText(fields.note),
        cover: optionalUrl(fields.cover, /^(https?:\/\/|\/)/i),
      },
    ];
  });
}

const toLines = (value: unknown) => (Array.isArray(value) ? value.filter(Boolean).map(String) : []);

/** Every published digest, newest first. */
export function getDigests(): Digest[] {
  if (!fs.existsSync(DIGEST_DIR)) return [];

  return fs
    .readdirSync(DIGEST_DIR)
    .filter((file) => /^\d{4}-(0[1-9]|1[0-2])\.md$/.test(file))
    .sort()
    .reverse()
    .flatMap((file): Digest[] => {
      const { data } = matter(fs.readFileSync(path.join(DIGEST_DIR, file), "utf8"));
      if (data.published === false) return [];

      const month = file.replace(/\.md$/, "");
      return [
        {
          month,
          label: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
            new Date(`${month}-01T00:00:00Z`)
          ),
          intro: optionalText(data.intro),
          songs: toItems(data.songs),
          podcasts: toItems(data.podcasts),
          movies: toItems(data.movies),
          shows: toItems(data.shows),
          books: toItems(data.books),
          articles: toItems(data.articles),
          in: toLines(data.in),
          out: toLines(data.out),
        },
      ];
    });
}
