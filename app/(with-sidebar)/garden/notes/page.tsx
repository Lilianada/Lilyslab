import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { read } from 'zod-matter';
import { Footer } from '@/components/layout/footer';
import { safeFormatDate } from '@/lib/utils';

// Define schema for front matter validation
const NoteMetaSchema = z.object({
  title: z.string().optional(),
  createdAt: z.union([
    z.string(),
    z.coerce.date().refine(
      (val) => !isNaN(val.getTime()),
      { message: "Invalid date format" }
    )
  ]).optional(),
  date: z.union([
    z.string(),
    z.coerce.date().refine(
      (val) => !isNaN(val.getTime()),
      { message: "Invalid date format" }
    )
  ]).optional(),
  lastUpdated: z.union([
    z.string(),
    z.coerce.date().refine(
      (val) => !isNaN(val.getTime()),
      { message: "Invalid date format" }
    )
  ]).optional(),
  type: z.string().optional(),
});

interface NoteMeta {
  title: string;
  createdAt: string;
  lastUpdated: string;
  type: string;
  slug: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getSafeData(raw: string): { title?: string; date?: string } {
  try {
    const { data } = matter(raw);
    return data;
  } catch (error) {
    console.error('Error parsing front matter');
    return {};
  }
}


export default function NotesPage() {
  const notesDir = path.join(process.cwd(), 'Content/notes');
  const files = fs.readdirSync(notesDir);

  const notes: NoteMeta[] = files
    .filter(f => f.endsWith('.md'))
    .filter(f => f !== 'README.md') // Skip README files
    .flatMap(filename => {
      try {
        const filePath = path.join(notesDir, filename);
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = getSafeData(raw);
        // Try to parse and validate frontmatter, skip if ZodError or invalid date
        try {
          const result = read(filePath, NoteMetaSchema);
          
          // Use our centralized date formatting utility
          // Determine the best date to use - prefer createdAt then fall back to date
          const dateValue = result.data.createdAt || result.data.date;
          const createdAtStr = safeFormatDate(dateValue).split('T')[0]; // Get just YYYY-MM-DD part
          
          // If lastUpdated is available use it, otherwise use createdAt
          const lastUpdatedStr = result.data.lastUpdated ? 
                                safeFormatDate(result.data.lastUpdated).split('T')[0] : 
                                createdAtStr;
          
          const validated = {
            title: result.data.title || filename.replace(/\.md$/, ''),
            createdAt: createdAtStr,
            lastUpdated: lastUpdatedStr,
            type: result.data.type || 'seedling',
            slug: filename.replace(/\.md$/, ''),
          };
          return [validated];
        } catch (zodErr) {
          console.error(`Skipping invalid file (bad date or metadata): ${filename}`, zodErr);
          return [];
        }
      } catch (error) {
        console.error(`Skipping unreadable file: ${filename}`, error);
        return [];
      }
    });

  // Sort and group notes by year and month using createdAt
  const grouped = notes
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .reduce((acc, note) => {
      const [year, month, day] = note.createdAt.split('-');
      if (!year || !month || !day) return acc; // Skip invalid dates

      // Format date as MM-DD
      const formattedDate = `${month}-${day}`;
      
      // Create year-month key for grouping (e.g. "2025-05")
      const yearMonthKey = `${year}-${month}`;
      
      // If this year doesn't exist in the accumulator yet, create it
      if (!acc[year]) {
        acc[year] = {};
      }
      
      // If this month doesn't exist in this year yet, create it
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      
      // Add the note to the appropriate year and month group
      acc[year][month].push({
        ...note,
        displayDate: formattedDate,
        fullDate: note.createdAt // Keep the original date for sorting if needed
      });
      
      return acc;
    }, {} as Record<string, Record<string, (NoteMeta & { displayDate: string; fullDate: string })[]>>);

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-2xl mx-auto px-0 sm:px-4 py-8">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Notes</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: 2025-04-20</div>
            <div>Last updated: 2025-06-13</div>
            <div>Inspired by: Digital gardens</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            A collection of thoughts, quotes, and reflections.
          </p>
        </header>
        {/* Sort years in descending order (newest first) */}
        {Object.entries(grouped)
          .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
          .map(([year, monthGroups]) => (
          <div key={year} className="mb-10">
            <p className='text-neutral-400 text-sm mb-3'>{year}</p>
            
            {/* Sort months in descending order (newest first) */}
            {Object.entries(monthGroups)
              .sort(([monthA], [monthB]) => parseInt(monthB) - parseInt(monthA))
              .map(([month, notes]) => {
              const monthIndex = parseInt(month, 10) - 1;
              const monthName = MONTHS[monthIndex];
              const totalNotes = notes.length;
              
              return (
                <div key={`${year}-${month}`} className="mb-6">
                  <div className="font-semibold text-sm mb-3 font-mono flex items-center justify-between">
                    <p>{totalNotes}</p>
                    <span className='h-[1px] w-full bg-border mx-3'></span>
                    <p className=''>{monthName}</p>
                  </div>
                  
                  <div className="">
                    {notes.map((note) => (
                      <div
                        key={note.slug}
                        className="group flex items-center py-2 transition-transform duration-150 hover:scale-[1.02]"
                      >
                        <a
                          href={`/garden/notes//${note.slug}`}
                          className="text-sm hover:underline flex-1 flex items-center justify-between"
                        >
                          <span>{note.title}</span>
                        </a>
                        <span className="text-neutral-400 font-mono text-sm">
                          {note.displayDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      <Footer 
          inspirationName="Linus Rogge"
          inspirationUrl="https://linusrogge.com/log/concerts"
          color='text-extra-steelBlue'
        />
      </div>

    </div>
  );
}