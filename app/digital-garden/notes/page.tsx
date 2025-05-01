import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod'; 
import { read } from 'zod-matter';

// Define schema for front matter validation
const DraftMetaSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.date().refine(
    (val) => !isNaN(val.getTime()), 
    { message: "Invalid date format" }
  ),
});

interface DraftMeta {
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


export default function DraftPage() {
  const draftsDir = path.join(process.cwd(), 'Content/notes');
  const files = fs.readdirSync(draftsDir);

  const notes: DraftMeta[] = files
    .filter(f => f.endsWith('.md'))
    .flatMap(filename => {
      try {
        const filePath = path.join(draftsDir, filename);
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = getSafeData(raw);
        // Try to parse and validate frontmatter, skip if ZodError or invalid date
        try {
          const result = read(filePath, DraftMetaSchema);
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

  // Sort and group notes
  const grouped = notes
    .sort((a, b) => b.date.localeCompare(a.date))
    .reduce((acc, note) => {
      const [year, month, day] = note.date.split('-');
      if (!year || !month || !day) return acc; // Skip invalid dates
      
      const monthIndex = parseInt(month, 10) - 1;
      if (monthIndex < 0 || monthIndex >= MONTHS.length) return acc;

      const formattedDate = `${year}-${MONTHS[monthIndex].slice(0,3)}-${day}`;
      
      return {
        ...acc,
        [year]: [...(acc[year] || []), { ...note, date: formattedDate }]
      };
    }, {} as Record<string, DraftMeta[]>);

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
        {Object.entries(grouped).map(([year, items]) => (
          <div key={year} className="mb-10">
            <div className="font-bold text-base mb-3 font-mono">{year}</div>
            <div className="divide-y divide-border">
              {items.map((note) => (
                <div
                  key={note.slug}
                  className="group flex items-baseline py-2 transition-transform duration-150 hover:scale-[1.02]"
                >
                  <span className="w-28 text-neutral-400 font-mono text-xs">
                    {note.date}
                  </span>
                  <a
                    href={`/digital-garden/notes/${note.slug}`}
                    className="ml-2 text-xs text-extra-steelBlue hover:underline flex-1 flex items-center justify-between"
                  >
                    <span>{note.title}</span>
                    <span className="flex items-center opacity-0 group-hover:opacity-100 ml-4 transition-opacity duration-200">
                      {/* Arrow icon (right arrow) */}
                      <svg className="inline h-4 w-4 text-extra-steelBlue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
