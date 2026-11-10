"use client";

import dynamic from "next/dynamic";
import { MarkdownSkeleton } from "@/components/markdown/markdown-renderer";

const MarkdownRenderer = dynamic(() => import("@/components/markdown"), {
  loading: () => <MarkdownSkeleton />,
});

export function LessonMarkdown({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />;
}
