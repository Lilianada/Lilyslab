import { NextRequest, NextResponse } from "next/server";
import { fetchPlaylist, PlaylistError } from "@/lib/burn-cd/playlist";

/** GET /api/burn-cd/playlist?url=… → the playlist's tracklist (metadata only). */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Add a playlist link." }, { status: 400 });

  try {
    const playlist = await fetchPlaylist(url);
    return NextResponse.json(playlist, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch (error) {
    if (error instanceof PlaylistError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("burn-cd playlist failed", error);
    return NextResponse.json({ error: "Something went wrong reading that playlist." }, { status: 500 });
  }
}
