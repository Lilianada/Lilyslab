export const runtime = 'nodejs';

import React from "react";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ChangelogTimeline, { ChangelogEntry } from "@/components/changelog/ChangelogTimeline";

// Load changelogs from markdown files in Content/changelog
async function loadChangelogs(): Promise<ChangelogEntry[]> {
  const dir = path.join(process.cwd(), 'Content', 'changelog');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const entries = files.map(file => {
    const fileContent = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(fileContent);
    return {
      version: data.version,
      title: data.title,
      date: data.date,
      type: data.type,
      body: content.trim(), // Use the markdown content instead of data.body
      category: data.category,
    } as ChangelogEntry;
  });
  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default async function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto sm:px-4 pt-16 pb-8">
      <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-1 text-xl font-medium">Changelog</h1>
        <p className="text-muted-foreground text-sm">
          Log of all notable changes and updates made to this website.
        </p>
      </header>

      <ChangelogTimeline entries={await loadChangelogs()} />
    </div>
  );
}
