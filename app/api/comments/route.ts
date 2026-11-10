import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { sendCommentNotice } from "@/lib/comment-email";

export const dynamic = "force-dynamic";

// Replies belong to one essay or note, like "essays/my-essay".
const PAGE_PATTERN = /^(essays|notes)\/[a-z0-9][a-z0-9-]{0,150}$/i;

const optional = (schema: z.ZodString) =>
  schema.optional().or(z.literal("").transform(() => undefined));

const ReplySchema = z.object({
  page: z.string().regex(PAGE_PATTERN, "Unknown page"),
  pageTitle: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  email: optional(z.string().trim().email("Please enter a valid email address")),
  website: optional(z.string().trim().url("Please enter a valid URL").regex(/^https?:\/\//i, "Links must start with http")),
  message: z.string().trim().min(2, "Write a little more").max(2000, "Keep it under 2000 characters"),
  spam_check: z.string().refine((value) => value.trim().toLowerCase() === "garden", {
    message: 'Type "garden" to show you\'re human',
  }),
  // A field people never see. Bots tend to fill it in.
  company: z.string().max(0, "Something looks off. Please try again.").optional(),
});

const replies = () => adminDb().collection("comments");

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get("page") ?? "";
  if (!PAGE_PATTERN.test(page)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 400 });
  }

  try {
    const snapshot = await replies().where("page", "==", page).get();
    const list = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Record<string, any>)
      // To hide a reply, set "hidden: true" on it in the Firebase console.
      .filter((reply) => reply.hidden !== true)
      .sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0))
      .map(({ id, name, website, message, date }) => ({ id, name, website: website || undefined, message, date }));

    return NextResponse.json({ replies: list });
  } catch (error) {
    console.error("Error loading replies:", error);
    return NextResponse.json({ error: "Couldn't load replies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const parsed = ReplySchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Check the form and try again" }, { status: 400 });
    }

    const { page, pageTitle, name, email, website, message } = parsed.data;
    const date = new Date().toISOString().slice(0, 10);
    const doc = await replies().add({
      page,
      name,
      email: email ?? null,
      website: website ?? null,
      message,
      date,
      createdAt: FieldValue.serverTimestamp(),
    });

    // The reply is saved either way; a failed email shouldn't lose it.
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (host ? `https://${host}` : "")).replace(/\/$/, "");
    await sendCommentNotice({ name, message, pageTitle, link: `${siteUrl}/garden/${page}#reply-${doc.id}` }).catch((error) =>
      console.error("Reply email failed:", error)
    );

    return NextResponse.json({ reply: { id: doc.id, name, website, message, date } });
  } catch (error) {
    console.error("Error saving reply:", error);
    return NextResponse.json({ error: "Couldn't save your reply. Try again in a moment." }, { status: 500 });
  }
}
