import { NextResponse } from "next/server";
import { getLinkTargets, resolveLink } from "@/lib/garden/posts";

/**
 * /garden/go?to=indie web → redirects to whatever [[indie web]] links to.
 * This gives [[double bracket]] links a real address, so they work without
 * JavaScript, open in a new tab, and can be followed by search engines.
 */
export function GET(request: Request) {
  const url = new URL(request.url);
  const text = url.searchParams.get("to")?.slice(0, 200) ?? "";
  const target = text ? resolveLink(text, getLinkTargets()) : undefined;
  return NextResponse.redirect(new URL(target?.href ?? "/garden", url.origin), 307);
}
