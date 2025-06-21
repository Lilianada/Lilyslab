import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { read } from 'zod-matter';
import { Footer } from '@/components/layout/footer';
import { safeFormatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

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
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional()
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
          
          // Skip unpublished notes - only include if published is true or undefined
          if (result.data.published === false) {
            return [];
          }
          
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
      const formattedDate = `${year}-${month}-${day}`;
      
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
      <div className="container max-w-3xl mx-auto px-0 sm:px-4 pt-16 pb-8">
        <header className="mb-12">
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

        {/* Notes Grid Layout */}
        <div className="space-y-8">
          {/* Sort years in descending order (newest first) */}
          {Object.entries(grouped)
            .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
            .map(([year, monthGroups]) => {
              // Flatten all notes from all months in this year
              const yearNotes = Object.values(monthGroups).flat();
              
              return (
                <div key={year} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-medium text-foreground">{year}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {yearNotes.length} notes
                    </span>
                  </div>
                  
                  {/* Modern Card Grid - All notes for the year */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {yearNotes
                      .sort((a, b) => b.fullDate.localeCompare(a.fullDate))
                      .map((note) => (
                      <a
                        key={note.slug}
                        href={`/garden/notes/${note.slug}`}
                        className="group block"
                      >
                        <div className="p-4 rounded-lg border border-dashed border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-card/50 hover:shadow-sm hover:-translate-y-0.5">
                          <div className="space-y-1">
                            <p className="font-medium text-xs leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {note.title}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-nitti">
                                {note.displayDate}
                              </span>
                              <div className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Topics List Section */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Future Notes</h3>
            <p className="text-xs text-muted-foreground">
              Topics I'm planning to explore and write about.
            </p>
          </div>
          
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "50 things I know",
              "Atomic notes", 
              "Budding notes",
              "Content curation",
              "Digital Library",
              "Evergreen notes",
              "How to create your digital garden",
              "Journaling",
              "Map of Content",
              "Minimalism",
              "Personal wiki",
              "Seedlings",
              "Social Media performance",
              "Why I Read",
              "Why Start a Digital Garden?"
            ].map((topic, index) => (
              <div
                key={index}
                className="p-3 rounded-md bg-muted/20 border border-dashed border-muted-foreground/20"
              >
                <span className="text-xs text-muted-foreground">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Footer 
          inspirationName="Linus Rogge"
          inspirationUrl="https://linusrogge.com/log/concerts"
          color='text-steelBlue'
        />
      </div>
    </div>
  );
}