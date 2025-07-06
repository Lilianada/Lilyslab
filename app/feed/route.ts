import { Feed } from 'feed';
import { NextResponse } from 'next/server';
import { safeFormatDate } from '@/lib/utils';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Define the types locally to avoid client-side imports
export interface Writing {
  slug: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  content: string;
  published: boolean;
  type: string;
}

export interface LogFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  published: boolean;
  [key: string]: any;
}

export interface LogData {
  slug: string;
  frontmatter: LogFrontmatter;
  content: string;
}

export interface NoteFrontmatter {
  title: string;
  createdAt: string;
  lastUpdated: string;
  publish?: boolean;
  tags: string[];
  type: string;
  image?: string;
  date?: string;
  [key: string]: any;
}

export interface NoteData {
  slug: string;
  frontmatter: NoteFrontmatter;
  content: string;
}

export async function GET(request: Request) {
  const siteURL = process.env.SITE_URL || 'https://lilyslab.xyz';
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

  // Server-side implementation of getAllWritings
  async function getAllWritings(): Promise<Writing[]> {
    const writingsPath = path.join(process.cwd(), "Content/essays");
    
    try {
      const files = await fs.readdir(writingsPath);
      
      const writingsPromises = files
        .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
        .map(async file => {
          const filePath = path.join(writingsPath, file);
          const raw = await fs.readFile(filePath, 'utf-8');
          const { data, content } = matter(raw);

          const published = data.published === true;
          if (!published) return null;
          
          // Handle dates safely
          const createdAtValue = data.createdAt || data.date;
          const createdAt = safeFormatDate(createdAtValue);
          const lastUpdated = safeFormatDate(data.lastUpdated || createdAtValue);

          return {
            slug: file.replace(/\.mdx?$/, ''),
            title: data.title || 'Untitled',
            createdAt,
            lastUpdated,
            excerpt: data.excerpt || '',
            tags: (data.tags || []).slice(0, 3), // Limit to 3 tags
            coverImage: data.coverImage || null,
            content,
            published: true,
            type: data.type || 'evergreen',
          };
        });

      const writings = (await Promise.all(writingsPromises))
        .filter((writing): writing is NonNullable<typeof writing> => writing !== null)
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

      return writings;
    } catch (error) {
      console.error("Error getting writings:", error);
      return [];
    }
  }
  
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
      date: new Date(writing.createdAt), // createdAt is already validated in getAllWritings
      ...(writing.tags && writing.tags.length > 0 && { category: writing.tags.map(tag => ({ name: tag })) }),
    });
  });

  // Server-side implementation of getAllLogsData
  async function getAllLogsData(): Promise<LogData[]> {
    const logsDirectory = path.join(process.cwd(), 'Content/logs');
    
    try {
      const filenames = await fs.readdir(logsDirectory);
      
      const logsPromises = filenames
        .filter((filename) => /\.mdx?$/.test(filename))
        .map(async (filename) => {
          const slug = filename.replace(/\.mdx?$/, '');
          const fullPath = path.join(logsDirectory, filename);
          
          try {
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            
            if (data.published !== true) return null;
            
            return {
              slug,
              frontmatter: data as LogFrontmatter,
              content
            };
          } catch (error) {
            console.error(`Error processing log file ${filename}:`, error);
            return null;
          }
        });
        
      const logs = (await Promise.all(logsPromises))
        .filter((log): log is LogData => log !== null)
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date);
          const dateB = new Date(b.frontmatter.date);
          return dateB.getTime() - dateA.getTime();
        });
        
      return logs;
    } catch (error) {
      console.error("Error reading logs directory:", error);
      return [];
    }
  }

  // Add logs to feed
  const logs = await getAllLogsData();
  
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
      // Use createdAt if available, otherwise fall back to date with validation
      date: new Date(safeFormatDate(log.frontmatter.createdAt || log.frontmatter.date)),
      ...(log.frontmatter.tags && log.frontmatter.tags.length > 0 && { category: log.frontmatter.tags.map(tag => ({ name: tag })) }),
    });
  });
  
  // Server-side implementation of getAllNotesData
  async function getAllNotesData(): Promise<NoteData[]> {
    const notesDirectory = path.join(process.cwd(), 'Content/notes');
    
    try {
      const filenames = await fs.readdir(notesDirectory);
      
      const notesPromises = filenames
        .filter((filename) => /\.mdx?$/.test(filename))
        .map(async (filename) => {
          const slug = filename.replace(/\.mdx?$/, '');
          const fullPath = path.join(notesDirectory, filename);
          
          try {
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            
            // Basic validation
            if (!data.title) {
              console.warn(`Skipping ${filename}: missing title in frontmatter.`);
              return null;
            }
            
            // Check if the note should be published - use 'publish' field for notes
            if (data.publish !== true) {
              return null;
            }
            
            // Handle date fields with proper validation
            const createdAt = data.createdAt || data.date;
            const formattedCreatedAt = safeFormatDate(createdAt);
            
            // If provided, ensure lastUpdated is valid, otherwise use createdAt
            const lastUpdated = data.lastUpdated ? 
              safeFormatDate(data.lastUpdated) : 
              formattedCreatedAt;
            
            const frontmatter = {
              ...data,
              createdAt: formattedCreatedAt,
              lastUpdated,
              type: data.type || 'seedling',
              tags: (data.tags || []).slice(0, 3) // Limit to 3 tags
            } as NoteFrontmatter;
            
            return {
              slug,
              frontmatter,
              content
            };
          } catch (error) {
            console.error(`Error processing note file ${filename}:`, error);
            return null;
          }
        });
        
      const notes = (await Promise.all(notesPromises))
        .filter((note): note is NoteData => note !== null)
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.createdAt);
          const dateB = new Date(b.frontmatter.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        
      return notes;
    } catch (error) {
      console.error("Error reading notes directory:", error);
      return [];
    }
  }
  
  // Add notes to feed
  const notes = await getAllNotesData();
  
  notes.forEach((note: NoteData) => {
    const url = `${siteURL}/garden/notes//${note.slug}`;
    
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
      date: new Date(note.frontmatter.createdAt), // createdAt is already validated in getAllNotesData
      ...(note.frontmatter.tags && note.frontmatter.tags.length > 0 && { category: note.frontmatter.tags.map(tag => ({ name: tag })) }),
    });
  });

  // Server-side implementation of getAllDailyLogsData
  async function getAllDailyLogsData(): Promise<LogData[]> {
    const dailyLogsDirectory = path.join(process.cwd(), 'Content/dailyLogs');
    
    try {
      const filenames = await fs.readdir(dailyLogsDirectory);
      
      const dailyLogsPromises = filenames
        .filter((filename) => /\.mdx?$/.test(filename))
        .map(async (filename) => {
          const slug = filename.replace(/\.mdx?$/, '');
          const fullPath = path.join(dailyLogsDirectory, filename);
          
          try {
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            
            return {
              slug,
              frontmatter: {
                title: `Daily Log - ${safeFormatDate(data.date)}`,
                date: data.date,
                published: true,
                tags: ['daily-log'],
                ...data
              } as LogFrontmatter,
              content
            };
          } catch (error) {
            console.error(`Error processing daily log file ${filename}:`, error);
            return null;
          }
        });
        
      const dailyLogs = (await Promise.all(dailyLogsPromises))
        .filter((log): log is LogData => log !== null)
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date);
          const dateB = new Date(b.frontmatter.date);
          return dateB.getTime() - dateA.getTime();
        });
        
      return dailyLogs;
    } catch (error) {
      console.error("Error reading daily logs directory:", error);
      return [];
    }
  }

  // Server-side implementation of getAllMicroBlogData
  async function getAllMicroBlogData(): Promise<LogData[]> {
    const microBlogDirectory = path.join(process.cwd(), 'Content/microBlog');
    
    try {
      const filenames = await fs.readdir(microBlogDirectory);
      
      const microBlogPromises = filenames
        .filter((filename) => /\.mdx?$/.test(filename))
        .map(async (filename) => {
          const slug = filename.replace(/\.mdx?$/, '');
          const fullPath = path.join(microBlogDirectory, filename);
          
          try {
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            
            if (data.publish !== true) return null;
            
            return {
              slug,
              frontmatter: {
                title: `Micro Blog #${data.id}`,
                date: data.date,
                published: true,
                tags: ['micro-blog', data.type],
                ...data
              } as LogFrontmatter,
              content
            };
          } catch (error) {
            console.error(`Error processing micro blog file ${filename}:`, error);
            return null;
          }
        });
        
      const microBlogs = (await Promise.all(microBlogPromises))
        .filter((blog): blog is LogData => blog !== null)
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date);
          const dateB = new Date(b.frontmatter.date);
          return dateB.getTime() - dateA.getTime();
        });
        
      return microBlogs;
    } catch (error) {
      console.error("Error reading micro blog directory:", error);
      return [];
    }
  }

  // Server-side implementation of getAllWordOfTheDayData
  async function getAllWordOfTheDayData(): Promise<LogData[]> {
    const wordOfTheDayDirectory = path.join(process.cwd(), 'Content/wordOfTheDay');
    
    try {
      const filenames = await fs.readdir(wordOfTheDayDirectory);
      
      const wordPromises = filenames
        .filter((filename) => /\.mdx?$/.test(filename) && filename !== 'index.md')
        .map(async (filename) => {
          const slug = filename.replace(/\.mdx?$/, '');
          const fullPath = path.join(wordOfTheDayDirectory, filename);
          
          try {
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            
            if (!data.word || !data.date) return null;
            
            return {
              slug,
              frontmatter: {
                title: `Word of the Day: ${data.word}`,
                date: data.date,
                published: true,
                tags: ['word-of-the-day', data.partOfSpeech].filter(Boolean),
                ...data
              } as LogFrontmatter,
              content
            };
          } catch (error) {
            console.error(`Error processing word of the day file ${filename}:`, error);
            return null;
          }
        });
        
      const words = (await Promise.all(wordPromises))
        .filter((word): word is LogData => word !== null)
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date);
          const dateB = new Date(b.frontmatter.date);
          return dateB.getTime() - dateA.getTime();
        });
        
      return words;
    } catch (error) {
      console.error("Error reading word of the day directory:", error);
      return [];
    }
  }

  // Add daily logs to feed
  const dailyLogs = await getAllDailyLogsData();
  
  dailyLogs.forEach((dailyLog: LogData) => {
    const url = `${siteURL}/daily-logs/${dailyLog.slug}`;
    
    feed.addItem({
      title: dailyLog.frontmatter.title,
      id: url,
      link: url,
      description: dailyLog.content.substring(0, 150) + '...',
      content: dailyLog.content,
      author: [
        {
          name: "Lilian",
          link: siteURL,
        },
      ],
      date: new Date(safeFormatDate(dailyLog.frontmatter.date)),
      ...(dailyLog.frontmatter.tags && dailyLog.frontmatter.tags.length > 0 && { category: dailyLog.frontmatter.tags.map(tag => ({ name: tag })) }),
    });
  });

  // Add micro blog posts to feed
  const microBlogs = await getAllMicroBlogData();
  
  microBlogs.forEach((microBlog: LogData) => {
    const url = `${siteURL}/micro-blog/${microBlog.slug}`;
    
    feed.addItem({
      title: microBlog.frontmatter.title,
      id: url,
      link: url,
      description: microBlog.content.substring(0, 150) + '...',
      content: microBlog.content,
      author: [
        {
          name: "Lilian",
          link: siteURL,
        },
      ],
      date: new Date(safeFormatDate(microBlog.frontmatter.date)),
      ...(microBlog.frontmatter.tags && microBlog.frontmatter.tags.length > 0 && { category: microBlog.frontmatter.tags.map(tag => ({ name: tag })) }),
    });
  });

  // Add word of the day entries to feed
  const wordOfTheDay = await getAllWordOfTheDayData();
  
  wordOfTheDay.forEach((word: LogData) => {
    const url = `${siteURL}/word-of-the-day/${word.slug}`;
    
    feed.addItem({
      title: word.frontmatter.title,
      id: url,
      link: url,
      description: word.content.substring(0, 150) + '...',
      content: word.content,
      author: [
        {
          name: "Lilian",
          link: siteURL,
        },
      ],
      date: new Date(safeFormatDate(word.frontmatter.date)),
      ...(word.frontmatter.tags && word.frontmatter.tags.length > 0 && { category: word.frontmatter.tags.map(tag => ({ name: tag })) }),
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

  // Add custom styling to RSS/Atom feeds
  if (format !== 'json') {
    const styleUrl = `${siteURL}/feed-styles.css`;
    const xslUrl = `${siteURL}/feed-transform.xsl`;
    
    // Add CSS and XSL processing instructions
    const processingInstructions = [
      `<?xml-stylesheet type="text/css" href="${styleUrl}" ?>`,
      `<?xml-stylesheet type="text/xsl" href="${xslUrl}" ?>`
    ].join('\n');
    
    // Insert processing instructions after the XML declaration
    output = output.replace(
      /(<\?xml[^>]*\?>)/,
      `$1\n${processingInstructions}`
    );
  }

  // Return the feed with appropriate content type
  return new NextResponse(output, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
