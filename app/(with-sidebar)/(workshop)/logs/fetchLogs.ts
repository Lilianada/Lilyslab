import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export async function fetchLogs() {
  const logsDir = path.join(process.cwd(), 'Content', 'logs');
  const files = await fs.readdir(logsDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));
  const sections: any[] = [];

  for (const file of mdxFiles) {
    const filePath = path.join(logsDir, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    if (data.published !== true) continue;
    // Use the title as section title, and parse content into items
    const section = {
      title: data.title || file.replace(/\.mdx$/, ''),
      date: data.date || '',
      tags: data.tags || [],
      items: parseLogContent(content)
    };
    sections.push(section);
  }
  // Optionally sort by date descending
  sections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sections;
}

// Helper to parse log content into the UI's items structure
function parseLogContent(content: string) {
  // This is a simple parser for the markdown structure in your logs
  // It finds bullet points and sub-bullets, and maps them to the UI shape
  const lines = content.split('\n');
  const items: any[] = [];
  const currentItem: any = null;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('- [x]')) {
      // Checked item
      items.push({ text: line.replace('- [x]', '').trim(), checked: true });
    } else if (line.startsWith('- [ ]')) {
      // Unchecked item
      items.push({ text: line.replace('- [ ]', '').trim(), checked: false });
    } else if (line.startsWith('-')) {
      // Regular bullet
      items.push({ text: line.replace('-', '').trim() });
    } else if (line.startsWith('    -')) {
      // Sub-item (4 spaces indent)
      if (items.length > 0) {
        const parent = items[items.length - 1];
        if (!parent.subItems) parent.subItems = [];
        parent.subItems.push(line.replace('    -', '').trim());
      }
    }
  }
  return items;
}
