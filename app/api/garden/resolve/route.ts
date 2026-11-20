import { NextResponse } from "next/server";
import { getLinkTargets, resolveLink } from "@/lib/garden/posts";

/** Where a [[double bracket]] link goes: the same match the backlinks lists use. */
export function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("text")?.slice(0, 200) ?? "";
  const target = text ? resolveLink(text, getLinkTargets()) : undefined;
  return NextResponse.json({ href: target?.href ?? null });
}
