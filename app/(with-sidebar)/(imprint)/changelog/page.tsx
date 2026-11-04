import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChangelogTimeline, { type ChangelogEntry, type ChangelogKind } from "@/components/changelog/ChangelogTimeline";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Log of all notable changes and updates made to this website.",
};

const SUMMARY_LENGTH = 140;

const KIND_BY_TYPE: Record<string, ChangelogKind> = {
  feature: "feature",
  enhancement: "improvement",
  improvement: "improvement",
  fix: "fix",
};

/** Drops the title heading and the author/date block, which the page already shows. */
const cleanBody = (body: string) =>
  body
    .trim()
    .replace(/^#\s+.*\n+/, "")
    .replace(/\n#{1,3}\s+Metadata\b[\s\S]*$/, "")
    .trim();

/** The first line of real text, without its markdown. */
function summarize(body: string) {
  const line = body
    .split("\n")
    .map((text) => text.trim())
    .find((text) => text && !text.startsWith("#") && !text.startsWith("|") && !text.startsWith("---"));
  if (!line) return "";

  const text = line
    .replace(/^([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "");
  return text.length <= SUMMARY_LENGTH ? text : `${text.slice(0, SUMMARY_LENGTH).replace(/\s+\S*$/, "")}…`;
}

function loadChangelog(): ChangelogEntry[] {
  const directory = path.join(process.cwd(), "Content/changelog");

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(directory, file), "utf8"));
      return { file, data, body: cleanBody(content) };
    })
    .filter(({ data }) => data.publish !== false)
    .map(({ file, data, body }) => ({ file, data, body, date: new Date(data.date) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime() || b.file.localeCompare(a.file))
    .map(({ file, data, body, date }) => ({
      id: file.replace(/\.md$/, ""),
      version: data.version ? String(data.version) : undefined,
      title: data.title || "Untitled update",
      displayDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      year: String(date.getUTCFullYear()),
      kind: KIND_BY_TYPE[data.type] ?? "update",
      summary: summarize(body),
      body: <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>,
    }));
}

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl w-full mx-auto pt-16 pb-8 animate-fade-in">
      <header className="mb-8">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-1 text-xl font-medium">Changelog</h1>
        <p className="text-muted-foreground text-sm">
          Log of all notable changes and updates made to this website.
        </p>
      </header>

      <ChangelogTimeline entries={loadChangelog()} />
    </div>
  );
}
