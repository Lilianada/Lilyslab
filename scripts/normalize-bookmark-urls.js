const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');
const CATEGORIES = ['article', 'website', 'video', 'misc'];

// Function to normalize URL case
function normalizeUrl(bookmark) {
  // If URL is present but url is not, add url property
  if (bookmark.URL && !bookmark.url) {
    bookmark.url = bookmark.URL;
  }
  // If url is present but URL is not, add URL property
  else if (bookmark.url && !bookmark.URL) {
    bookmark.URL = bookmark.url;
  }
  return bookmark;
}

// Process bookmarks
function updateBookmarkUrls() {
  console.log('Starting bookmarks URL normalization...');
  
  // Process each category file
  for (const category of CATEGORIES) {
    const filePath = path.join(BOOKMARKS_DIR, `${category}.md`);
    
    // Skip if file doesn't exist
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${category}.md - file doesn't exist`);
      continue;
    }
    
    try {
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Split content by bookmarks (each bookmark is separated by double newlines)
      const bookmarkSections = fileContent.split(/---\n\n---/);
      
      // Process each bookmark
      const processedSections = bookmarkSections.map(section => {
        if (!section.trim()) return section;
        
        try {
          // Parse the section
          const { data, content } = matter('---\n' + section);
          
          // Normalize URL
          const normalizedData = normalizeUrl(data);
          
          // Create frontmatter string
          const newFrontmatter = Object.entries(normalizedData)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
              } else if (value instanceof Date) {
                return `${key}: ${value.toISOString().split('T')[0]}`;
              } else {
                return `${key}: ${value}`;
              }
            })
            .join('\n');
          
          // Combine frontmatter and content
          return `---\n${newFrontmatter}\n---\n\n${content.trim()}`;
        } catch (err) {
          console.error(`Error processing bookmark section:`, err);
          return section;
        }
      });
      
      // Join sections back together
      const updatedContent = processedSections.join('\n\n---\n\n');
      
      // Write updated content back to file
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`Updated ${category}.md`);
    } catch (err) {
      console.error(`Error processing ${category}.md:`, err);
    }
  }
  
  console.log('URL normalization complete!');
}

updateBookmarkUrls();
