import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  const draftsDir = path.join(process.cwd(), 'Content/drafts');
  const files = fs.readdirSync(draftsDir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({ slug: file.replace(/\.md$/, '') }));
}

export default function DraftPage({ params }: { params: Params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'Content/drafts', `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const title = data.title || slug;
  const date = data.date ? formatDate(data.date) : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
        {date && <p className="text-xs text-muted-foreground">Published: {date}</p>}
      </header>
      <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-justify [&_img]:rounded-lg [&_blockquote]:border-l [&_blockquote]:border-muted/50 [&_blockquote]:pl-4">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
