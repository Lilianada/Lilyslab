import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { formatDate } from '@/lib/utils';
import MarkdownRenderer from '@/components/markdown/markdown-renderer';

// Load manifesto content from markdown file
async function getManifestoContent() {
  try {
    const manifestoPath = path.join(process.cwd(), 'Content', 'manifesto', 'index.md');
    const fileContent = fs.readFileSync(manifestoPath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      content,
      title: data.title || 'Web Manifesto',
      description: data.description || 'My personal web manifesto',
      createdAt: data.createdAt,
      lastUpdated: data.lastUpdated,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error('Error loading manifesto content:', error);
    return {
      content: '## Error loading manifesto\n\nThe manifesto content could not be loaded.',
      title: 'Web Manifesto',
      description: 'My personal web manifesto',
      createdAt: null,
      lastUpdated: null,
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
    <div className="max-w-2xl mx-auto w-full sm:px-4 pt-16 pb-8">
      <div className="space-y-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">{manifesto.title}</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: {formatDate(manifesto.createdAt)}</div>
            <div>Last updated: {formatDate(manifesto.lastUpdated)}</div>
            <div>Inspired by: IndieWeb principles</div>
            {manifesto.tags && typeof manifesto.tags === 'string' && (
              <div className="flex flex-wrap gap-1">
                <span>Tags: {manifesto.tags}</span>
              </div>
            )}
          </div>
        </header>
        
        <article className="prose dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-p:text-[14px] max-w-none">
          <MarkdownRenderer 
            content={manifesto.content}
            className="max-w-none"
          />
        </article>
      </div>
      
      <Footer />
    </div>
  );
}
