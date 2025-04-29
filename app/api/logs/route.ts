import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

function parseLogContent(content: string) {
  const lines = content.split('\n');
  const stack: any[] = [];
  let root: any[] = [];
  let inProjectGoals = false;

  function getIndent(line: string) {
    return line.match(/^\s*/)?.[0].length || 0;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) continue;

    // Detect section headers
    if (/^##\s*Project Goals/.test(line)) {
      inProjectGoals = true;
      continue;
    } else if (/^##\s*/.test(line) && !/^##\s*Project Goals/.test(line)) {
      inProjectGoals = false;
    }

    // Only process bullet lines
    if (!/^(-|\s+-)/.test(rawLine)) continue;

    // Determine nesting level by indentation
    const indent = getIndent(rawLine);
    const item: any = {};
    let text = line;
    let checked = undefined;
    if ((inProjectGoals || /^- \[(x| )\]/.test(line)) && line.startsWith('-')) {
      // Checkbox logic
      text = line.replace(/^-\s*\[(x| )\]\s*/, (m, x) => {
        checked = x === 'x';
        return '';
      });
      text = text.replace(/^-\s*/, '');
      Object.assign(item, formatLogLine(text));
      if (typeof checked !== 'undefined') item.checked = checked;
    } else {
      Object.assign(item, formatLogLine(line.replace(/^[-]/, '').trim()));
    }

    // Attach to correct parent based on indent
    while (stack.length && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    if (stack.length) {
      const parent = stack[stack.length - 1].item;
      if (!parent.subItems) parent.subItems = [];
      parent.subItems.push(item);
    } else {
      root.push(item);
    }
    stack.push({ indent, item });
  }
  return root;
}


function formatLogLine(text: string) {
  // Extract and format label (e.g., **Top of mind:**)
  let labelMatch = text.match(/^\*\*(.+?):\*\*\s*(.*)$/);
  let label = undefined;
  let bold = false;
  if (labelMatch) {
    label = labelMatch[1];
    text = labelMatch[2];
    bold = true;
  }

  // Extract markdown link [text](url)
  let linkMatch = text.match(/\[([^\]]+)\]\(([^\)]+)\)/);
  let linkText = undefined;
  let link = undefined;
  if (linkMatch) {
    linkText = linkMatch[1];
    link = linkMatch[2];
    // Remove the markdown link from text
    text = text.replace(linkMatch[0], linkText);
  }

  // Extract hashtag (e.g., #habit)
  let tagMatch = text.match(/(#[a-zA-Z0-9-_]+)/);
  let tag = undefined;
  if (tagMatch) {
    tag = tagMatch[1];
    // Remove tag from text
    text = text.replace(tag, '').trim();
  }

  return {
    text: text,
    label,
    bold,
    linkText,
    link,
    tag
  };
}


// function formatLogLine(text: string) {
//   // Extract and format label (e.g., **Top of mind:**)
//   let labelMatch = text.match(/^\*\*(.+?):\*\*\s*(.*)$/);
//   let label = undefined;
//   if (labelMatch) {
//     label = labelMatch[1];
//     text = labelMatch[2];
//   }

//   // Extract markdown link [text](url)
//   let linkMatch = text.match(/\[([^\]]+)\]\(([^\)]+)\)/);
//   let linkText = undefined;
//   let link = undefined;
//   if (linkMatch) {
//     linkText = linkMatch[1];
//     link = linkMatch[2];
//     // Remove the markdown link from text
//     text = text.replace(linkMatch[0], linkText);
//   }

//   // Extract hashtag (e.g., #habit)
//   let tagMatch = text.match(/(#[a-zA-Z0-9-_]+)/);
//   let tag = undefined;
//   if (tagMatch) {
//     tag = tagMatch[1];
//     // Remove tag from text
//     text = text.replace(tag, '').trim();
//   }

//   // Compose display text: bold label if present
//   let displayText = label ? `**${label}:** ${text}` : text;

//   return {
//     text: displayText,
//     linkText,
//     link,
//     tag
//   };
// }


export async function GET() {
  const logsDir = path.join(process.cwd(), 'Content', 'logs');
  const files = await fs.readdir(logsDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));
  let sections: any[] = [];
  for (const file of mdxFiles) {
    const filePath = path.join(logsDir, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    if (data.published !== true) continue;
    const section = {
      title: data.title || file.replace(/\.mdx$/, ''),
      date: data.date || '',
      tags: data.tags || [],
      items: parseLogContent(content)
    };
    sections.push(section);
  }
  sections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json({ sections });
}
