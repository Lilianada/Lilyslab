import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

// Define schema for guestbook entry validation
const GuestbookEntrySchema = z.object({
  id: z.string().optional().or(z.string().length(0).transform(() => '')),
  name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
  email: z.string().email("Please enter a valid email address").optional().or(z.string().length(0).transform(() => undefined)),
  url: z.string().url("Please enter a valid URL").optional().or(z.string().length(0).transform(() => undefined)),
  spam_check: z.string().refine(val => val.toLowerCase() === 'guestbook', {
    message: 'Please enter "guestbook" to prove you are human'
  }),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be 2000 characters or less").trim(),
  // Date format standardized to YYYY-MM-DD to ensure consistency
  date: z.string().optional().or(z.string().length(0).transform(() => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  })),
  // Y2K profile fields with strict character limits
  intro: z.string().max(150, "Bio must be 150 characters or less").optional().or(z.string().length(0).transform(() => undefined)),
  location: z.string().max(50, "Location must be 50 characters or less").optional().or(z.string().length(0).transform(() => undefined)),
  mood: z.string().max(30, "Mood must be 30 characters or less").optional().or(z.string().length(0).transform(() => undefined)),
  song: z.string().max(80, "Song name must be 80 characters or less").optional().or(z.string().length(0).transform(() => undefined)),
  favorite: z.string().max(50, "Favorite thing must be 50 characters or less").optional().or(z.string().length(0).transform(() => undefined)),
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
          
          // Ensure the date is in YYYY-MM-DD format for consistency
          let formattedDate = entryData.date || new Date().toISOString().split('T')[0];
          
          // If the date is in ISO format with time, convert it to YYYY-MM-DD
          if (formattedDate.includes('T')) {
            formattedDate = formattedDate.split('T')[0];
          }
          
          return {
            id: file.split('.')[0],
            name: entryData.name || 'Anonymous',
            url: entryData.url || undefined,
            date: formattedDate,
            email: entryData.email || undefined, // Include email in response
            message: message.trim(),
            // Include Y2K profile fields if they exist
            intro: entryData.intro || undefined,
            location: entryData.location || undefined,
            mood: entryData.mood || undefined,
            song: entryData.song || undefined,
            favorite: entryData.favorite || undefined
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
    let files: string[];
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
    // Use YYYY-MM-DD date format for consistency
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Start frontmatter
    let content = '---\n';
    content += `name: ${entryData.name}\n`;
    if (entryData.email) content += `email: ${entryData.email}\n`;
    if (entryData.url) content += `url: ${entryData.url}\n`;
    content += `date: ${date}\n`; // Consistent date format
    
    // Add Y2K profile fields to frontmatter if they exist
    // Ensure we escape any special characters in the values to prevent YAML parsing issues
    if (entryData.intro) content += `intro: ${entryData.intro.replace(/:/g, "\\:")}\n`;
    if (entryData.location) content += `location: ${entryData.location.replace(/:/g, "\\:")}\n`;
    if (entryData.mood) content += `mood: ${entryData.mood.replace(/:/g, "\\:")}\n`;
    if (entryData.song) content += `song: ${entryData.song.replace(/:/g, "\\:")}\n`;
    if (entryData.favorite) content += `favorite: ${entryData.favorite.replace(/:/g, "\\:")}\n`;
    
    content += '---\n\n';
    content += entryData.message;
    
    // Write to file
    const filePath = path.join(entriesDir, fileName);
    await fs.writeFile(filePath, content);
    
    // Prepare response with all fields for immediate display
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for signing my guestbook!',
      entry: {
        id: fileNumber,
        name: entryData.name,
        url: entryData.url,
        date, // Using YYYY-MM-DD format
        message: entryData.message,
        // Include all Y2K profile fields in the response, even if undefined
        email: entryData.email, // Include email in the response for complete data
        intro: entryData.intro,
        location: entryData.location,
        mood: entryData.mood,
        song: entryData.song,
        favorite: entryData.favorite,
        // Add created_at for compatibility with form component's onEntryAdded function
        created_at: date
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