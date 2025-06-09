import { Feed } from 'feed';
import { getAllWritings, Writing } from '@/lib/garden/writings';
import { getAllLogsData, LogData } from '@/lib/garden/logs';
import { getAllNotesData, NoteData } from '@/lib/notes';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const siteURL = 'https://lilyslab.com';
  const date = new Date();
  
  // Create a new feed
  const feed = new Feed({
    title: "Lilyslab",
    description: "Lilian's digital garden, workshop, and playground",
    id: siteURL,
    link: siteURL,
    language: "en",
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, Lilian`,
    updated: date,
    feedLinks: {
      rss2: `${siteURL}/feed`,
      json: `${siteURL}/feed?format=json`,
      atom: `${siteURL}/feed?format=atom`,
    },
    author: {
      name: "Lilian",
      link: siteURL,
    },
  });

  // Add writings to feed
  const writings = await getAllWritings();
  
  writings.forEach((writing: Writing) => {
    const url = `${siteURL}/writing/${writing.slug}`;
    
    feed.addItem({
      title: writing.title,
      id: url,
      link: url,
      description: writing.excerpt || '',
      content: writing.content,
      author: [
        {
          name: "Lilian",
          link: siteURL,
        },
      ],
      date: new Date(writing.date),
      ...(writing.tags && writing.tags.length > 0 && { category: writing.tags.map(tag => ({ name: tag })) }),
    });
  });

  // Add logs to feed
  const logs = getAllLogsData();
  
  logs.forEach((log: LogData) => {
    const url = `${siteURL}/workshop/logs/${log.slug}`;
    
    feed.addItem({
      title: log.frontmatter.title,
      id: url,
      link: url,
      description: log.frontmatter.excerpt || '',
      author: [
        {
          name: "Lilian",
          link: siteURL,
        },
      ],
      date: new Date(log.frontmatter.date),
      ...(log.frontmatter.tags && log.frontmatter.tags.length > 0 && { category: log.frontmatter.tags.map(tag => ({ name: tag })) }),
    });
  });
  
  // Add notes to feed
  const notes = getAllNotesData();
  
  notes.forEach((note: NoteData) => {
    const url = `${siteURL}/digital-garden/notes/${note.slug}`;
    
    feed.addItem({
      title: note.frontmatter.title,
      id: url,
      link: url,
      description: note.content.substring(0, 150) + '...',
      content: note.content,
      author: [
        {
          name: "Lilian",
          link: siteURL,
        },
      ],
      date: new Date(note.frontmatter.date),
      ...(note.frontmatter.tags && note.frontmatter.tags.length > 0 && { category: note.frontmatter.tags.map(tag => ({ name: tag })) }),
    });
  });

  // Determine the format based on query parameter
  const url = new URL(request.url);
  const format = url.searchParams.get('format');

  let contentType = 'application/rss+xml; charset=utf-8';
  let output = feed.rss2();

  if (format === 'atom') {
    contentType = 'application/atom+xml; charset=utf-8';
    output = feed.atom1();
  } else if (format === 'json') {
    contentType = 'application/json; charset=utf-8';
    output = feed.json1();
  }

  // Return the feed with appropriate content type
  return new NextResponse(output, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
