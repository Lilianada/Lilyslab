import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';
import matter from 'gray-matter';

export interface DailyLog {
  id: string;
  slug: string;
  date: Date;
  content: string;
  mood?: string;
  createdAt: string;
}

const LOGS_DIRECTORY = path.join(process.cwd(), 'Content/dailyLogs');

export async function getAllDailyLogs(): Promise<DailyLog[]> {
  const fileNames = await fsp.readdir(LOGS_DIRECTORY);

  const allLogs = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const filePath = path.join(LOGS_DIRECTORY, fileName);
        const fileContents = await fsp.readFile(filePath, 'utf8');
        
        const { data, content } = matter(fileContents);
        
        // Use the new date field if available, fallback to createdAt
        const dateString = data.date || data.createdAt;
        const date = new Date(dateString);
        
        // Validate the date - if invalid, try to parse filename as date
        if (isNaN(date.getTime())) {
          // Try to extract date from filename (YYYY-MM-DD.md)
          const filenameDate = slug.match(/^\d{4}-\d{2}-\d{2}$/);
          if (filenameDate) {
            const fallbackDate = new Date(slug);
            if (!isNaN(fallbackDate.getTime())) {
              console.warn(`Invalid date in ${fileName}, using filename date: ${slug}`);
              return {
                id: slug,
                slug,
                date: fallbackDate,
                content,
                mood: data.mood,
                createdAt: slug
              } as DailyLog;
            }
          }
          console.error(`Invalid date in ${fileName}: ${dateString}`);
          return null;
        }
        
        return {
          id: slug,
          slug,
          date,
          content,
          mood: data.mood,
          createdAt: dateString
        } as DailyLog;
      })
  );

  // Sort logs by date (newest first) and filter out null entries
  return allLogs
    .filter((log): log is DailyLog => log !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
