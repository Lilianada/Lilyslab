import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface WebrollLink {
  id: string;
  title: string;
  url: string;
  category: string;
  notes?: string;
  tags: string[];
  date: string;
}

// Webroll directory and categories
const WEBROLL_DIR = path.join(process.cwd(), 'Content/webroll');
const WEBROLL_CATEGORIES = ['digitalGarden', 'personalWikis', 'portfolio', 'webDirectories', '512kb', 'misc'];

export async function getWebrollLinks(): Promise<WebrollLink[]> {
  const allLinks: WebrollLink[] = [];

  // Process each category file
  for (const category of WEBROLL_CATEGORIES) {
    const filePath = path.join(WEBROLL_DIR, `${category}.md`);
    
    // Skip if file doesn't exist
    if (!fs.existsSync(filePath)) {
      console.warn(`Webroll category file ${category}.md not found`);
      continue;
    }

    try {
      // Read file content
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Split content by '---' markers which separate entries
      const entrySections = content
        .split(/---/)
        .filter(section => section.trim() !== '');
      
      for (const section of entrySections) {
        if (!section.trim()) continue;
        
        try {
          // Add frontmatter delimiters if needed
          const processedSection = section.trim().startsWith('publish:') || 
                                   section.trim().startsWith('title:') || 
                                   section.trim().startsWith('url:') ? 
                                   `---\n${section.trim()}\n---` : `---\n${section.trim()}`;
                                   
          const { data: meta } = matter(processedSection);
          
          // Only include if publish is true or not specified
          const published = meta.publish === true || meta.publish !== false;
          if (!published) continue;
          
          allLinks.push({
            id: meta.id || `${category}-unknown`,
            title: meta.title || '',
            url: meta.url || '',
            category: getCategoryDisplayName(category),
            notes: meta.notes || undefined,
            tags: meta.tags || [],
            date: meta.date || ''
          });
        } catch (err) {
          console.error('Error parsing webroll entry section:', err);
        }
      }
    } catch (err) {
      console.error(`Error reading webroll category file ${category}.md:`, err);
    }
  }

  return allLinks;
}

// Convert file names to display names
function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    'digitalGarden': 'digital-gardens',
    'personalWikis': 'personal-wikis',
    'portfolio': 'portfolios',
    'webDirectories': 'web-directories',
    '512kb': '512kb',
    'misc': 'misc'
  };
  
  return categoryMap[category] || category;
}

// Function to append a new submission to submissions.md
export async function addWebrollSubmission(submission: {
  title: string;
  url: string;
  category: string;
}) {
  const submissionsPath = path.join(WEBROLL_DIR, 'submissions.md');
  const today = new Date().toISOString().split('T')[0];
  
  const submissionEntry = `- [${submission.title}](${submission.url}) - Category: ${submission.category} - Submitted: ${today}\n`;
  
  try {
    // Append to submissions file
    fs.appendFileSync(submissionsPath, submissionEntry);
    return true;
  } catch (error) {
    console.error('Error saving webroll submission:', error);
    return false;
  }
}
