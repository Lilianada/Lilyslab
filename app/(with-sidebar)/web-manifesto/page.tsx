import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Footer } from '@/components/layout/footer';

// Load manifesto content from markdown file
async function getManifestoContent() {
  try {
    const manifestoPath = path.join(process.cwd(), 'Content', 'manifesto', 'index.md');
    const fileContent = fs.readFileSync(manifestoPath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      content,
      title: data.title || 'Web Manifesto',
      description: data.description || 'My personal web manifesto and thoughts on web development.',
      date: data.date || null,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error('Error loading manifesto content:', error);
    return {
      content: '## Error loading manifesto\n\nThe manifesto content could not be loaded.',
      title: 'Web Manifesto',
      description: 'My personal web manifesto and thoughts on web development.',
      date: null,
      tags: [],
    };
  }
}

// Generate dynamic metadata based on the manifesto content
export async function generateMetadata(): Promise<Metadata> {
  const manifesto = await getManifestoContent();
  
  return {
    title: `${manifesto.title} | Lily's Garden`,
    description: manifesto.description,
    keywords: manifesto.tags,
  };
}

export default async function WebManifestoPage() {
  const manifesto = await getManifestoContent();
  
  return (
    <div className="max-w-2xl mx-auto w-full pb-12">
      <div className="space-y-8">
        <header>
          <h1 className="text-xl font-medium tracking-tight mb-4">{manifesto.title}</h1>
          <p className="text-sm text-muted-foreground mb-3">{manifesto.description}</p>
          
          <div className="flex gap-2 flex-wrap mb-3">
            {manifesto.tags?.map((tag: string) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {manifesto.date && (
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(manifesto.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </header>
        
        <article className="prose dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-p:text-[14px] max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {manifesto.content}
          </ReactMarkdown>
        </article>
      </div>
      
      <Footer />
    </div>
  );
}
