const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');
const OUTPUT_DIR = path.join(process.cwd(), 'Content/bookmarks-by-category');
const CATEGORIES = ['article', 'website', 'video', 'misc'];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process bookmarks
function reorganizeBookmarks() {
  console.log('Starting bookmarks reorganization...');
  
  // Initialize a map to hold bookmarks by category
  const bookmarksByCategory = {
    article: [],
    website: [],
    video: [],
    misc: []
  };
  
  // Get all markdown files
  const files = fs.readdirSync(BOOKMARKS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} bookmark files.`);
  
  // Process each bookmark file
  let processedCount = 0;
  
  files.forEach(filename => {
    const filePath = path.join(BOOKMARKS_DIR, filename);
    try {
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      
      // Normalize the type field (handle case variations)
      let type = (frontmatter.type || 'website').toLowerCase();
      
      // Ensure type is one of the allowed categories
      if (!CATEGORIES.includes(type)) {
        console.log(`Unknown type "${type}" in ${filename}, defaulting to "misc"`);
        type = 'misc';
      }
      
      // Add to the appropriate category
      bookmarksByCategory[type].push({
        originalFilename: filename,
        frontmatter,
        content
      });
      
      processedCount++;
    } catch (err) {
      console.error(`Error processing ${filename}:`, err);
    }
  });
  
  console.log(`Successfully processed ${processedCount} bookmarks.`);
  
  // Write categorized files
  for (const category of CATEGORIES) {
    const bookmarks = bookmarksByCategory[category];
    console.log(`Writing ${bookmarks.length} bookmarks to ${category}.md`);
    
    const output = bookmarks.map((bookmark, index) => {
      // Create a unique ID for each bookmark in the new format
      const id = `${category}-${String(index + 1).padStart(3, '0')}`;
      
      // Update the frontmatter with the id
      const updatedFrontmatter = {
        ...bookmark.frontmatter,
        id
      };
      
      // Create markdown content with frontmatter
      return `---
${Object.entries(updatedFrontmatter)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
    } else if (value instanceof Date) {
      return `${key}: ${value.toISOString().split('T')[0]}`;
    } else {
      return `${key}: ${value}`;
    }
  })
  .join('\n')}
---

${bookmark.content.trim()}
`;
    }).join('\n\n');
    
    // Write to file
    fs.writeFileSync(path.join(OUTPUT_DIR, `${category}.md`), output);
  }
  
  console.log('Bookmarks reorganization complete!');
  console.log(`
Summary:
  - Article bookmarks: ${bookmarksByCategory.article.length}
  - Website bookmarks: ${bookmarksByCategory.website.length}
  - Video bookmarks: ${bookmarksByCategory.video.length}
  - Misc bookmarks: ${bookmarksByCategory.misc.length}
  - Total: ${processedCount}
  `);
}

reorganizeBookmarks();
