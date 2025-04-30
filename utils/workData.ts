import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { WorkItem } from '@/components/homepage-items';

export async function fetchWorkData(): Promise<WorkItem[]> {
  const workDir = path.join(process.cwd(), 'Content/work');
  const files = await fs.promises.readdir(workDir);

  const workItems = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(workDir, filename);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const { data } = matter(fileContent);

      return {
        id: filename.replace(/\.md$/, ''),
        company: data.company || '',
        role: data.role || '',
        period: data.period || '',
        description: data.description || '',
      } as WorkItem;
    })
  );

  return workItems;
}