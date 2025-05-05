import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { read } from 'zod-matter';
import { Footer } from '@/components/footer';

// Define schema for front matter validation
const NoteMetaSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.date().refine(
    (val) => !isNaN(val.getTime()),
    { message: "Invalid date format" }
  ),
});

interface NoteMeta {
  title: string;
  date: string;
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
    .flatMap(filename => {
      try {
        const filePath = path.join(notesDir, filename);
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = getSafeData(raw);
        // Try to parse and validate frontmatter, skip if ZodError or invalid date
        try {
          const result = read(filePath, NoteMetaSchema);
          const validated = {
            title: result.data.title || filename.replace(/\.md$/, ''),
            date: result.data.date.toISOString().split('T')[0],
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

  // Sort and group notes by year and month
  const grouped = notes
    .sort((a, b) => b.date.localeCompare(a.date))
    .reduce((acc, note) => {
      const [year, month, day] = note.date.split('-');
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
        date: formattedDate,
        fullDate: note.date // Keep the original date for sorting if needed
      });
      
      return acc;
    }, {} as Record<string, Record<string, (NoteMeta & { fullDate: string })[]>>);

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-3xl mx-auto px-0 sm:px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Notes</h1>
            <p className="text-sm text-muted-foreground">
              A collection of thoughts, quotes, and reflections.
            </p>
          </div>
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
                          href={`/digital-garden/notes/${note.slug}`}
                          className="text-sm text-extra-steelBlue hover:underline flex-1 flex items-center justify-between"
                        >
                          <span>{note.title}</span>
                        </a>
                        <span className="text-neutral-400 font-mono text-sm">
                          {note.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Footer 
          inspirationName="Linus Rogge"
          inspirationUrl="https://linusrogge.com/log/concerts"
          color='text-extra-steelBlue'
        />

    </div>
  );
}