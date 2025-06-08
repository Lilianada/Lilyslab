const fs = require('fs');
const path = require('path');

// Configuration
const BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');
const CATEGORIES = ['article', 'website', 'video', 'misc'];

// Function to check and fix bookmark files
function fixBookmarkFiles() {
  console.log('Starting bookmark file cleanup...');
  
  // Check if directory exists
  if (!fs.existsSync(BOOKMARKS_DIR)) {
    console.error(`Directory does not exist: ${BOOKMARKS_DIR}`);
    return;
  }
  
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
      console.log(`Processing ${category}.md...`);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Split by triple dashes to get each bookmark
      let entries = content.split(/---/).filter(entry => entry.trim());
      
      // Process each entry to ensure proper formatting
      const processedEntries = entries.map((entry, index) => {
        // Skip empty entries
        if (!entry.trim()) return '';
        
        const trimmedEntry = entry.trim();
        
        // Ensure entry ends with proper information
        const lines = trimmedEntry.split('\n');
        let hasType = false;
        let hasId = false;
        
        // Check if entry has type and id
        for (const line of lines) {
          if (line.trim().startsWith('type:')) hasType = true;
          if (line.trim().startsWith('id:')) hasId = true;
        }
        
        // Add type if missing
        const entryWithType = hasType ? trimmedEntry : `${trimmedEntry}\ntype: ${category}`;
        
        // Add id if missing
        const entryWithId = hasId ? entryWithType : 
          `${entryWithType}\nid: ${category}-${String(index + 1).padStart(3, '0')}`;
        
        return entryWithId;
      });
      
      // Join entries back with proper delimiters
      const fixedContent = processedEntries
        .filter(entry => entry.trim())
        .map(entry => `---\n${entry.trim()}\n---`)
        .join('\n\n');
      
      // Write back to file
      fs.writeFileSync(filePath, fixedContent);
      console.log(`Fixed ${category}.md`);
    } catch (error) {
      console.error(`Error processing ${category}.md:`, error);
    }
  }
  
  console.log('Bookmark file cleanup complete!');
}

fixBookmarkFiles();
