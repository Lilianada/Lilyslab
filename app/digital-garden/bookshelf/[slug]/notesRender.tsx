
import {
    NotionHeading1,
    NotionHeading2,
    NotionHeading3,
    NotionParagraph,
    NotionList,
    NotionNumberedList,
    NotionQuote,
  } from "@/components/digital-garden/notes/NotionBlock";
import { Handlee } from 'next/font/google';

const handlee = Handlee({ subsets: ['latin'], weight: ['400'] });

interface RenderMarkdownWithNotionBlocksProps {
  markdown: string;
}

export default function RenderMarkdownWithNotionBlocks({ markdown }: RenderMarkdownWithNotionBlocksProps) {
  if (typeof markdown !== 'string') {
    return <div style={{ color: 'red' }}>Invalid markdown content</div>;
  }
  const lines = markdown.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let orderedListItems: string[] = [];
  lines.forEach((line, idx) => {
    if (line.startsWith('# ')) {
      blocks.push(<NotionHeading1 key={idx}>{line.replace('# ', '')}</NotionHeading1>);
    } else if (line.startsWith('## ')) {
      blocks.push(<NotionHeading2 key={idx}>{line.replace('## ', '')}</NotionHeading2>);
    } else if (line.startsWith('### ')) {
      blocks.push(<NotionHeading3 key={idx}>{line.replace('### ', '')}</NotionHeading3>);
    } else if (line.startsWith('- ')) {
      listItems.push(line.replace('- ', ''));
      // If next line is not a list, flush
      if (!lines[idx + 1] || !lines[idx + 1].startsWith('- ')) {
        blocks.push(<NotionList key={idx} items={[...listItems]} />);
        listItems = [];
      }
    } else if (/^\d+\. /.test(line)) {
      orderedListItems.push(line.replace(/^\d+\. /, ''));
      if (!lines[idx + 1] || !/^\d+\. /.test(lines[idx + 1])) {
        blocks.push(<NotionNumberedList key={idx} items={[...orderedListItems]} />);
        orderedListItems = [];
      }
    } else if (line.startsWith('> ')) {
      blocks.push(<NotionQuote key={idx}>{line.replace('> ', '')}</NotionQuote>);
    } else if (line.trim() !== '') {
      blocks.push(<NotionParagraph key={idx}>{line}</NotionParagraph>);
    }
  });
  return <div className={handlee.className}>{blocks}</div>;
}