import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DraftPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const draftsDir = path.join(process.cwd(), 'Content/drafts');
  const files = fs.readdirSync(draftsDir);
  return files.filter(f => f.endsWith('.md')).map(filename => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}

export default function DraftPage({ params }: DraftPageProps) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'Content/drafts', `${slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return (
    <div className="prose dark:prose-invert max-w-2xl mx-auto py-12 px-4">
      <h1 className="mb-2">{data.title}</h1>
      <div className="text-neutral-400 text-sm mb-8">{data.date}</div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
