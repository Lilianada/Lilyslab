import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface WordOfTheDay {
  id: string;
  date: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  similar: string[];
  context: string;
}

export async function GET() {
  const wotdDir = path.join(process.cwd(), 'Content', 'wordOfTheDay');
  const words: WordOfTheDay[] = [];

  try {
    const files = await fs.readdir(wotdDir);
    const mdFiles = files.filter((file) => file.endsWith('.md') && file !== 'index.md');

    for (const file of mdFiles) {
      const filePath = path.join(wotdDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // Extract information from content
      const meaningMatch = content.match(/\*\*Meaning:\*\*\s*(.*?)(?=\n\n|\*\*|$)/s);
      const exampleMatch = content.match(/\*\*Example:\*\*\s*(.*?)(?=\n\n|\*\*|$)/s);
      const contextMatch = content.match(/\*\*Context:\*\*\s*(.*?)(?=\n\n|\*\*|$)/s);
      const similarMatch = content.match(/\*\*Similar:\*\*\s*(.*?)(?=\n\n|\*\*|$)/s);

      // Parse similar words
      let similarWords: string[] = [];
      if (similarMatch && similarMatch[1]) {
        similarWords = similarMatch[1]
          .split('\n')
          .map(line => line.replace(/^-\s*/, '').trim())
          .filter(word => word.length > 0);
      }

      if (data.word && data.date) {
        words.push({
          id: file.replace(/\.md$/, ''),
          date: data.date,
          word: data.word,
          pronunciation: data.pronunciation || '',
          partOfSpeech: data.partOfSpeech || '',
          meaning: meaningMatch ? meaningMatch[1].trim() : '',
          example: exampleMatch ? exampleMatch[1].trim().replace(/^"|"$/g, '') : '',
          similar: similarWords,
          context: contextMatch ? contextMatch[1].trim().replace(/^"|"$/g, '') : '',
        });
      }
    }

    // Sort by date, newest first
    words.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error("Error reading WOTD content:", error);
    return NextResponse.json({ error: 'Failed to load WOTD data' }, { status: 500 });
  }

  return NextResponse.json(words);
}
