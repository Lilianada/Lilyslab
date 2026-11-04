import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/ama-auth";
import { getGardenHealth } from "@/lib/garden-health";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getGardenHealth());
}
