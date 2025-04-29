import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react'; // Keep icon for visual consistency if needed

// Define the structure for a log entry
type LogEntry = {
  slug: string;
  title: string;
  date: string;
  published: boolean;
  tags: string[];
};

// Helper function to parse frontmatter manually
// Improved robustness for line endings and empty lines
const parseFrontmatter = (content: string): Partial<LogEntry> => {
  const frontmatterMatch = content.match(/^---([\s\S]*?)---/); // Ensure --- is at the start
  if (!frontmatterMatch || !frontmatterMatch[1]) {
      console.warn("No frontmatter found or empty frontmatter.");
      return {};
  }

  const frontmatter = frontmatterMatch[1];
  // Split by newline, handle \r\n and \n, filter empty lines after trim
  const lines = frontmatter.split(/\r?\n/).filter(line => line.trim() !== '');

  const data: Partial<LogEntry> = { tags: [] };

  lines.forEach(line => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex !== -1) {
      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (key === 'title') {
        data.title = value;
      } else if (key === 'date') {
         // Ensure date is a string, even if it looks numeric
         data.date = String(value);
      } else if (key === 'published') {
        data.published = value.toLowerCase() === 'true';
      } else if (key === 'tags') {
        // Handle tags: Expecting format like ["#tag1", "#tag2"] or [#tag1, #tag2]
        if (value.startsWith('[') && value.endsWith(']')) {
           const tagsString = value.substring(1, value.length - 1);
           // Split by comma, trim whitespace, remove surrounding quotes from each tag
           data.tags = tagsString.split(',').map(tag => tag.trim().replace(/^['"]|['"]$/g, '')).filter(tag => tag !== '');
        } else {
            console.warn(`Tags format not recognized or invalid: ${value}. Expected array format like ["#tag1"].`);
            data.tags = [];
        }
      }
    } else {
         console.warn(`Skipping invalid frontmatter line: ${line}`);
    }
  });

  return data;
};


// Server Component to fetch and display logs
export default function DailyLogPage() {
  const logsDirectory = path.join(process.cwd(), 'Content', 'logs');
  let allLogs: LogEntry[] = [];

  console.log(`Reading logs from: ${logsDirectory}`); // Debug log

  try {
    const filenames = fs.readdirSync(logsDirectory);
    console.log(`Found files: ${filenames.join(', ')}`); // Debug log

    allLogs = filenames
      .filter(filename => filename.endsWith('.mdx'))
      .map(filename => {
        const filePath = path.join(logsDirectory, filename);
        console.log(`Processing file: ${filePath}`); // Debug log
        let fileContent = '';
        try {
            fileContent = fs.readFileSync(filePath, 'utf8');
        } catch (readError) {
            console.error(`Error reading file ${filePath}:`, readError);
            return null; // Skip this file if reading fails
        }

        const frontmatter = parseFrontmatter(fileContent);
        const slug = filename.replace(/\.mdx$/, ''); // Create slug from filename

        // Basic validation and default values
        const logEntry: LogEntry = {
          slug,
          title: frontmatter.title || 'Untitled Log',
          date: frontmatter.date || '1970-01-01', // Default valid date
          published: frontmatter.published === true, // Ensure it's explicitly true
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [], // Ensure tags is an array
        };
        console.log(`Parsed ${filename}:`, logEntry); // Debug log
        return logEntry;
      })
      .filter((log): log is LogEntry => log !== null && log.published) // Filter out nulls and unpublished logs
      .sort((a, b) => {
          try {
              // Attempt to parse dates for robust sorting
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              if (isNaN(dateA) || isNaN(dateB)) {
                  console.warn(`Invalid date detected during sort: ${a.date} or ${b.date}`);
                  return 0; // Keep original order if dates are invalid
              }
              return dateB - dateA; // Sort by date descending
          } catch (sortError) {
              console.error("Error sorting logs by date:", sortError);
              return 0;
          }
      });

      console.log(`Filtered and sorted logs (${allLogs.length}):`, allLogs.map(l => l.title)); // Debug log

  } catch (error) {
    console.error("Error reading logs directory or processing files:", error);
    allLogs = []; // Ensure logs is empty on error
  }


  return (
    <div className="min-h-screen text-foreground sm:p-8">
      <div className="max-w-3xl mx-auto sm:p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-1 text-xl font-medium">Project Logs</h1>
          <p className="text-sm text-muted-foreground">A build log of all my published projects.</p>
        </header>

        {/* Log Entries Grid */}
        {allLogs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {allLogs.map((log) => (
               <Link key={log.slug} href={`/workshop/logs/${log.slug}`} passHref legacyBehavior>
                 <a className="block hover:no-underline group"> {/* Wrap Card with Link */}
                    <Card className="h-full flex flex-col transition-shadow duration-200 group-hover:shadow-md dark:border-neutral-800">
                      <CardHeader>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {log.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {/* Format date safely */}
                          {(() => {
                              try {
                                  return new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                              } catch {
                                  return log.date; // Fallback to raw date string
                              }
                          })()}
                        </CardDescription>
                      </CardHeader>
                      {/* Optional: Add excerpt/description */}
                      {/* <CardContent className="flex-grow"></CardContent> */}
                      <CardFooter className="mt-auto pt-2">
                        <div className="flex flex-wrap gap-1">
                          {log.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  </a>
               </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg dark:border-neutral-800">
             <p className="text-muted-foreground">No published logs found or there was an error reading them.</p>
          </div>
        )}

      </div>
    </div>
  );
} 