import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/ama-auth";
import { Transcript1Error, getAccount } from "@/lib/transcribe/transcript1";

export const dynamic = "force-dynamic";

/** My Transcript1 balance: minutes left and when they renew. */
export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ account: await getAccount() });
  } catch (error) {
    const message = error instanceof Transcript1Error ? error.message : "Couldn't check your minutes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
