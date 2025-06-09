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
        
        return {
          id: slug,
          slug,
          date,
          content,
          mood: data.mood,
          createdAt: dateString
        };
      })
  );

  // Sort logs by date (newest first)
  return allLogs.sort((a, b) => b.date.getTime() - a.date.getTime());
}
