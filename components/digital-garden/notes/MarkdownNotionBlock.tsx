// components/digital-garden/notes/MarkdownNotionBlock.tsx
import { NotionBlock, NotionHeading1, NotionHeading2, NotionHeading3, NotionParagraph, NotionList, NotionNumberedList } from "./NotionBlock";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Root, Content } from "mdast";

function renderMarkdownAst(node: Content | Root): React.ReactNode {
  if (node.type === "root") {
    return (node.children as Content[]).map((child, idx) => <span key={idx}>{renderMarkdownAst(child)}</span>);
  }
  switch (node.type) {
    case "heading":
      if (node.depth === 1) return <NotionHeading1>{node.children.map(renderMarkdownAst)}</NotionHeading1>;
      if (node.depth === 2) return <NotionHeading2>{node.children.map(renderMarkdownAst)}</NotionHeading2>;
      if (node.depth === 3) return <NotionHeading3>{node.children.map(renderMarkdownAst)}</NotionHeading3>;
      return <NotionBlock>{node.children.map(renderMarkdownAst)}</NotionBlock>;
    case "paragraph":
      return <NotionParagraph>{node.children.map(renderMarkdownAst)}</NotionParagraph>;
    case "list":
      if (node.ordered) return <NotionNumberedList items={node.children.map(item => renderMarkdownAst(item)) as string[]} />;
      return <NotionList items={node.children.map(item => renderMarkdownAst(item)) as string[]} />;
    case "listItem":
      // For simplicity, join all children as text
      return node.children.map(renderMarkdownAst).join(" ");
    case "text":
      return node.value;
    default:
      return null;
  }
}

export function MarkdownNotionBlock({ markdown }: { markdown: string }) {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  return <div>{renderMarkdownAst(tree)}</div>;
}