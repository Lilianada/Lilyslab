/** The platforms the transcriber accepts, and how to tell a link's platform from its address. */
export type Platform = "youtube" | "instagram" | "tiktok" | "pinterest" | "x";

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  x: "X",
};

const HOSTS: [Platform, RegExp][] = [
  ["youtube", /(^|\.)(youtube\.com|youtu\.be)$/],
  ["instagram", /(^|\.)instagram\.com$/],
  ["tiktok", /(^|\.)tiktok\.com$/],
  ["pinterest", /(^|\.)pinterest\.[a-z.]+$|^pin\.it$/],
  ["x", /(^|\.)(x\.com|twitter\.com)$/],
];

export type LinkCheck =
  | { ok: true; platform: Platform; url: string }
  | { ok: false; reason: string };

/** Works out the platform, and catches links Transcript1 is known not to handle. */
export function checkLink(input: string): LinkCheck {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { ok: false, reason: "That doesn't look like a link." };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, reason: "That doesn't look like a link." };
  }

  const host = url.hostname.toLowerCase();
  const platform = HOSTS.find(([, pattern]) => pattern.test(host))?.[0];
  if (!platform) {
    return { ok: false, reason: "Only YouTube, Instagram, TikTok, Pinterest and X links work here." };
  }

  // Transcript1 only takes full Pinterest video pin links, not pin.it short links.
  if (platform === "pinterest" && !/\/pin\/[^/]+/.test(url.pathname)) {
    return { ok: false, reason: "Open the pin and copy its full pinterest.com/pin/… link (pin.it short links don't work)." };
  }

  return { ok: true, platform, url: url.toString() };
}
