const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const INDIVIDUAL_BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks-individual');
const CATEGORY_BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');
const CATEGORIES = ['article', 'website', 'video', 'misc'];
const BACKUP_DIR = path.join(process.cwd(), 'Content/bookmarks-backup');

// Migrate back to individual files from category files
function migrateToIndividualFiles() {
  console.log('Starting migration to individual bookmark files...');
  
  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // Backup current individual files
  if (fs.existsSync(LEGACY_BOOKMARKS_DIR)) {
    const files = fs.readdirSync(LEGACY_BOOKMARKS_DIR).filter(f => f.endsWith('.md'));
    console.log(`Backing up ${files.length} existing bookmark files to ${BACKUP_DIR}`);
    files.forEach(file => {
      fs.copyFileSync(path.join(LEGACY_BOOKMARKS_DIR, file), path.join(BACKUP_DIR, file));
    });
  } else {
    fs.mkdirSync(LEGACY_BOOKMARKS_DIR, { recursive: true });
  }
  
  // Read category files and split into individual files
  let totalBookmarks = 0;
  for (const category of CATEGORIES) {
    const categoryFile = path.join(NEW_BOOKMARKS_DIR, `${category}.md`);
    if (!fs.existsSync(categoryFile)) {
      console.log(`Skipping ${category}.md - file doesn't exist`);
      continue;
    }
    
    try {
      // Read file content
      const fileContent = fs.readFileSync(categoryFile, 'utf8');
      
      // Split content by bookmarks
      const bookmarkSections = fileContent.split(/---\n\n---/);
      
      // Process each bookmark
      for (const section of bookmarkSections) {
        if (!section.trim()) continue;
        
        try {
          const { data, content } = matter('---\n' + section);
          
          // Generate filename from id or create a new one
          let filename;
          if (data.id) {
            filename = `${data.id}.md`;
          } else {
            filename = `${category}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}.md`;
          }
          
          // Remove id field from frontmatter as it's not needed in individual files
          if (data.id) {
            delete data.id;
          }
          
          // Write the individual file
          const individualFilePath = path.join(LEGACY_BOOKMARKS_DIR, filename);
          const fileContent = matter.stringify(content, data);
          fs.writeFileSync(individualFilePath, fileContent);
          totalBookmarks++;
        } catch (err) {
          console.error('Error processing bookmark section:', err);
        }
      }
    } catch (err) {
      console.error(`Error processing ${category}.md:`, err);
    }
  }
  
  console.log(`Migration complete! Created ${totalBookmarks} individual bookmark files.`);
}

// Migrate from individual files to category files
function migrateToCategoryFiles() {
  console.log('Starting migration to category-based bookmark files...');
  
  // Ensure output directory exists
  if (!fs.existsSync(NEW_BOOKMARKS_DIR)) {
    fs.mkdirSync(NEW_BOOKMARKS_DIR, { recursive: true });
  }
  
  // Initialize a map to hold bookmarks by category
  const bookmarksByCategory = {
    article: [],
    website: [],
    video: [],
    misc: []
  };
  
  // Get all markdown files
  const files = fs.readdirSync(LEGACY_BOOKMARKS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} bookmark files to process.`);
  
  // Process each bookmark file
  let processedCount = 0;
  
  files.forEach(filename => {
    const filePath = path.join(LEGACY_BOOKMARKS_DIR, filename);
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
      
      // Generate ID from filename without extension
      const id = filename.replace('.md', '');
      
      // Add id to frontmatter
      frontmatter.id = id;
      
      // Add to the appropriate category
      bookmarksByCategory[type].push({
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
    
    const output = bookmarks.map((bookmark) => {
      // Create markdown content with frontmatter
      const frontmatterStr = Object.entries(bookmark.frontmatter)
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
      
      return `---\n${frontmatterStr}\n---\n\n${bookmark.content.trim()}`;
    }).join('\n\n---\n\n');
    
    // Write to file
    fs.writeFileSync(path.join(NEW_BOOKMARKS_DIR, `${category}.md`), output);
  }
  
  console.log('Migration to category files complete!');
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const direction = args[0];
  
  if (direction === 'to-individual') {
    migrateToIndividualFiles();
  } else if (direction === 'to-category') {
    migrateToCategoryFiles();
  } else {
    console.log(`
Usage: node migration-script.js <direction>

Directions:
  to-individual: Migrate from category-based files to individual bookmark files
  to-category: Migrate from individual bookmark files to category-based files
    `);
  }
}

main();
