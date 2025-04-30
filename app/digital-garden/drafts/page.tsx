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

function validateDraft(data: unknown): DraftMeta | null {
  try {
    const parsed = DraftMetaSchema.parse(data);
    return {
      title: parsed.title || '',
      date: z.coerce.string().parse(parsed.date.toISOString().split('T')[0]),
      slug: ''
    };
  } catch (error) {
    console.error('Invalid draft metadata:', error);
    return null;
  }
}


export default function DraftPage() {
  const draftsDir = path.join(process.cwd(), 'Content/drafts');
  const files = fs.readdirSync(draftsDir);

  const drafts: DraftMeta[] = files
    .filter(f => f.endsWith('.md'))
    .flatMap(filename => {
      try {
        const filePath = path.join(draftsDir, filename);
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = getSafeData(raw);
        
        const result = read(filePath, DraftMetaSchema);
const validated = {
  title: result.data.title || filename.replace(/\.md$/, ''),
  date: result.data.date.toISOString().split('T')[0],
  slug: filename.replace(/\.md$/, '')
};
        
        return [{
          title: validated.title || filename.replace(/\.md$/, ''),
          date: validated.date,
          slug: filename.replace(/\.md$/, ''),
        }];
      } catch (error) {
        console.error(`Skipping invalid file: ${filename}`, error);
        return [];
      }
    });

  // Sort and group drafts
  const grouped = drafts
    .sort((a, b) => b.date.localeCompare(a.date))
    .reduce((acc, draft) => {
      const [year, month, day] = draft.date.split('-');
      if (!year || !month || !day) return acc; // Skip invalid dates
      
      const monthIndex = parseInt(month, 10) - 1;
      if (monthIndex < 0 || monthIndex >= MONTHS.length) return acc;

      const formattedDate = `${year}-${MONTHS[monthIndex].slice(0,3)}-${day}`;
      
      return {
        ...acc,
        [year]: [...(acc[year] || []), { ...draft, date: formattedDate }]
      };
    }, {} as Record<string, DraftMeta[]>);

  return (
    <div className="min-h-screen animate-fade-in">
    <div className="container max-w-3xl mx-auto px-0 sm:px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="mb-1 text-xl font-medium">Drafts</h1>
          <p className="text-sm text-muted-foreground">
            Unfinished notes, thoughts and all.
          </p>
        </div>
      </header>
        {Object.entries(grouped).map(([year, items]) => (
          <div key={year} className="mb-10">
            <div className="font-bold text-xl mb-3 font-mono">{year}</div>
            <div className="divide-y divide-border">
              {items.map((draft) => (
                <div key={draft.slug} className="flex items-baseline py-2">
                  <span className="w-28 text-neutral-400 font-mono text-sm">
                    {draft.date}
                  </span>
                  <a
                    href={`/digital-garden/drafts/${draft.slug}`}
                    className="ml-2 text-base text-extra-steelBlue hover:underline"
                  >
                    {draft.title}
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
