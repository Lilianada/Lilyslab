import { COURSE, getAllLessons, getLesson, toPlainText } from "@/lib/learn";

const SITE_URL = (process.env.SITE_URL || "https://lilyslab.xyz").replace(/\/$/, "");
const FORMATS = { md: "text/markdown", txt: "text/plain" } as const;
type Format = keyof typeof FORMATS;

// Every download is made once at build time, like the lesson pages.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLessons().flatMap(({ track, slug }) =>
    (Object.keys(FORMATS) as Format[]).map((format) => ({ track, lesson: slug, format }))
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ track: string; lesson: string; format: string }> }) {
  const { track, lesson: slug, format } = await params;
  const lesson = getLesson(track, slug);
  if (!lesson || !(format in FORMATS)) return new Response("Not found", { status: 404 });

  const source = `From "${COURSE.title}" by Lily: ${SITE_URL}${lesson.href}`;
  const heading = `${lesson.trackTitle}, lesson ${lesson.number}`;
  const body =
    format === "md"
      ? [`# ${lesson.title}`, `*${heading}*`, lesson.description ?? "", lesson.content.trim(), "---", `*${source}*`]
      : [lesson.title.toUpperCase(), heading, lesson.description ?? "", toPlainText(lesson.content), "---", source];

  return new Response(body.filter(Boolean).join("\n\n") + "\n", {
    headers: {
      "Content-Type": `${FORMATS[format as Format]}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${lesson.track}-${lesson.number}-${lesson.slug}.${format}"`,
    },
  });
}
