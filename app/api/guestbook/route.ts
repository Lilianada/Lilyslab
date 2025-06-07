import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

// Define schema for guestbook entry validation
const GuestbookEntrySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().optional().or(z.string().length(0).transform(() => undefined)),
  url: z.string().url().optional().or(z.string().length(0).transform(() => undefined)),
  spam_check: z.string().refine(val => val.toLowerCase() === 'guestbook', {
    message: 'Please enter "guestbook" to prove you are human'
  }),
  message: z.string().min(1).max(1000).trim(),
});

type GuestbookEntry = z.infer<typeof GuestbookEntrySchema>;

export async function GET() {
  try {
    // Get entries directory
    const entriesDir = path.join(process.cwd(), 'Content', 'guestBook');
    
    // Check if directory exists
    try {
      await fs.access(entriesDir);
    } catch {
      // Create directory if it doesn't exist
      await fs.mkdir(entriesDir, { recursive: true });
      return NextResponse.json({ entries: [] });
    }
    
    // Read directory for markdown files
    const files = await fs.readdir(entriesDir);
    const entries = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .sort((a, b) => {
          // Sort by file number in descending order (newest first)
          const numA = parseInt(a.split('.')[0]);
          const numB = parseInt(b.split('.')[0]);
          return numB - numA;
        })
        .map(async (file) => {
          const filePath = path.join(entriesDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          
          // Parse markdown frontmatter
          const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
          const match = content.match(frontmatterRegex);
          
          if (!match) {
            return null;
          }
          
          const [_, frontmatter, message] = match;
          
          // Parse the frontmatter
          const entryData: Record<string, string> = {};
          frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
              entryData[key.trim()] = valueParts.join(':').trim();
            }
          });
          
          return {
            id: file.split('.')[0],
            name: entryData.name || 'Anonymous',
            url: entryData.url || undefined,
            date: entryData.date || new Date().toISOString(),
            message: message.trim()
          };
        })
    );

    // Filter out null entries
    const validEntries = entries.filter(entry => entry !== null);
    
    return NextResponse.json({ entries: validEntries });
  } catch (error) {
    console.error('Error reading guestbook entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate entry data
    const entry = GuestbookEntrySchema.parse(body);
    
    // Remove spam_check field from saved data
    const { spam_check, ...entryData } = entry;
    
    // Get entries directory
    const entriesDir = path.join(process.cwd(), 'Content', 'guestBook');
    
    // Create directory if it doesn't exist
    await fs.mkdir(entriesDir, { recursive: true });
    
    // Find the next file number
    let files: any[];
    try {
      files = await fs.readdir(entriesDir);
    } catch {
      files = [];
    }
    
    // Get existing files and find the highest number
    const existingNumbers = files
      .filter(file => file.match(/^\d+\.md$/))
      .map(file => parseInt(file.split('.')[0]));
    
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;
    
    // Format the file number with leading zeros
    const fileNumber = String(nextNumber).padStart(3, '0');
    const fileName = `${fileNumber}.md`;
    
    // Create content with frontmatter
    const date = new Date().toISOString();
    let content = '---\n';
    content += `name: ${entryData.name}\n`;
    if (entryData.email) content += `email: ${entryData.email}\n`;
    if (entryData.url) content += `url: ${entryData.url}\n`;
    content += `date: ${date}\n`;
    content += '---\n\n';
    content += entryData.message;
    
    // Write to file
    const filePath = path.join(entriesDir, fileName);
    await fs.writeFile(filePath, content);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for signing my guestbook!',
      entry: {
        id: fileNumber,
        name: entryData.name,
        url: entryData.url,
        date,
        message: entryData.message
      }
    });
    
  } catch (error) {
    console.error('Error saving guestbook entry:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to save entry' 
    }, { status: 500 });
  }
}
