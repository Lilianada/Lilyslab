import { NextResponse } from "next/server";
import { getGardenPosts, resolveLink } from "@/lib/garden/posts";

/** Where a [[double bracket]] link goes: the same match the "Linked from" lists use. */
export function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("text")?.slice(0, 200) ?? "";
  const post = text ? resolveLink(text, getGardenPosts()) : undefined;
  return NextResponse.json({ href: post?.href ?? null });
}
