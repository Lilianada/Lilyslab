import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/ama-auth";
import { checkLink } from "@/lib/transcribe/platforms";
import { Transcript1Error, downloadTranscription, getTranscription, startTranscription } from "@/lib/transcribe/transcript1";

export const dynamic = "force-dynamic";

// Each transcription spends paid minutes, so only I can use this.
const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

function failure(error: unknown) {
  if (error instanceof Transcript1Error) {
    return NextResponse.json({ error: error.message }, { status: error.status >= 400 ? error.status : 500 });
  }
  console.error("Transcriber error:", error);
  return NextResponse.json({ error: "Something went wrong. Try again in a bit." }, { status: 500 });
}

/** Start a transcription: { url } → job. */
export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const link = checkLink(typeof body?.url === "string" ? body.url : "");
  if (!link.ok) return NextResponse.json({ error: link.reason }, { status: 400 });

  try {
    return NextResponse.json({ platform: link.platform, job: await startTranscription(link.url) });
  } catch (error) {
    return failure(error);
  }
}

/**
 * ?id=tr_… → the job's latest state.
 * ?id=tr_…&format=text|srt[&timestamps=true] → the finished transcript as a file.
 */
export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  if (!/^tr_[A-Za-z0-9_-]+$/.test(id)) return NextResponse.json({ error: "Missing or invalid id." }, { status: 400 });

  const format = searchParams.get("format");
  try {
    if (format === "text" || format === "srt") {
      const content = await downloadTranscription(id, format, searchParams.get("timestamps") === "true");
      return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    return NextResponse.json({ job: await getTranscription(id) });
  } catch (error) {
    return failure(error);
  }
}
