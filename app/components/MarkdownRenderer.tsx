import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-justify [&_p]:text-[14px] [&_p]:leading-normal [&_li]:text-[14px] [&_li]:leading-normal [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mb-4 [&_h2]:text-foreground [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mb-4 [&_h3]:text-foreground [&_h4]:text-[16px] [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:mb-3 [&_h4]:text-foreground [&_a]:text-steelBlue">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
