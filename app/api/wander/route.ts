import { NextResponse } from "next/server";
import { getWanderPaths } from "@/lib/garden-index";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getWanderPaths());
}
