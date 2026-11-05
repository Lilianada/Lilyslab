import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|facebookexternalhit|embedly|curl|wget|python|node-fetch/i;

const VisitSchema = z.object({
  path: z.string().regex(/^\/[\w\-./]{0,99}$/),
  referrer: z.string().max(500).optional(),
});

const stripWww = (host: string) => host.replace(/^www\./, "");

/** The site someone came from, or "direct". Internal and unreadable referrers count as direct. */
function getSource(referrer: string | undefined, ownHost: string) {
  try {
    const host = stripWww(new URL(referrer ?? "").hostname.toLowerCase());
    return host !== ownHost && /^[a-z0-9.-]{1,100}$/.test(host) ? host : "direct";
  } catch {
    return "direct";
  }
}

/**
 * Counts one first visit. Only totals are stored: no IP address, no identifier,
 * nothing that could tell one visitor from another.
 */
export async function POST(request: Request) {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
  const ownHost = stripWww(host.split(":")[0].toLowerCase());

  const origin = request.headers.get("origin");
  if (origin && stripWww(new URL(origin).hostname) !== ownHost) {
    return new NextResponse(null, { status: 403 });
  }

  // Bots and Netlify previews (deploy-preview-1--site.netlify.app) shouldn't move the real numbers.
  const isPreview = ownHost.endsWith(".netlify.app") && ownHost.includes("--");
  if (BOT_PATTERN.test(request.headers.get("user-agent") ?? "") || isPreview) {
    return new NextResponse(null, { status: 204 });
  }

  let visit: z.infer<typeof VisitSchema>;
  try {
    visit = VisitSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid visit" }, { status: 400 });
  }

  const country = request.headers.get("x-country") ?? "";

  try {
    const stats = adminDb().collection("visitorStats");
    const batch = adminDb().batch();
    batch.set(stats.doc("all-time"), { visitors: FieldValue.increment(1) }, { merge: true });
    batch.set(
      stats.doc(new Date().toISOString().slice(0, 10)),
      {
        visitors: FieldValue.increment(1),
        referrers: { [getSource(visit.referrer, ownHost)]: FieldValue.increment(1) },
        landings: { [visit.path]: FieldValue.increment(1) },
        ...(/^[A-Z]{2}$/.test(country) ? { countries: { [country]: FieldValue.increment(1) } } : {}),
      },
      { merge: true }
    );
    await batch.commit();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error counting visit:", error);
    return NextResponse.json({ error: "Failed to count visit" }, { status: 500 });
  }
}
