import { NextResponse } from "next/server";

/**
 * Every mention the site has received, for the AMA page.
 * The webmention.io token stays here on the server instead of shipping to every visitor.
 */
export const revalidate = 600;

export async function GET() {
  const token = process.env.WEBMENTION_TOKEN || process.env.NEXT_PUBLIC_WEBMENTION_TOKEN;
  if (!token) return NextResponse.json({ type: "feed", children: [] });

  const response = await fetch(`https://webmention.io/api/mentions.jf2?token=${encodeURIComponent(token)}&per-page=100`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 600 },
  });
  if (!response.ok) return NextResponse.json({ error: "Couldn't load mentions." }, { status: 502 });
  return NextResponse.json(await response.json());
}
