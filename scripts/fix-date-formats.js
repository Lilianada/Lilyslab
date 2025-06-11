/**
 * Script to fix date formats across all content files
 * Ensures consistent YYYY-MM-DD format for dates without quotes
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Content directories to process
const contentDirs = [
  path.join(process.cwd(), 'Content/bookmarks'),
  path.join(process.cwd(), 'Content/notes'),
  path.join(process.cwd(), 'Content/writings'),
  path.join(process.cwd(), 'Content/threads')
];

// Count of files processed and fixed
let processedCount = 0;
let fixedCount = 0;

/**
 * Fix date format for a single file
 * @param {string} filePath - Path to the content file
 */
function fixDateFormat(filePath) {
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter
    const { data, content } = matter(fileContent);
    
    let needsUpdate = false;
    
    // Fix createdAt format if needed
    if (data.createdAt) {
      if (typeof data.createdAt === 'string' && data.createdAt.startsWith("'") && data.createdAt.endsWith("'")) {
        // Remove quotes from string date
        data.createdAt = data.createdAt.substring(1, data.createdAt.length - 1);
        needsUpdate = true;
      } else if (typeof data.createdAt !== 'string') {
        // Convert date object or other types to string
        data.createdAt = new Date(data.createdAt).toISOString().split('T')[0];
        needsUpdate = true;
      }
    }
    
    // Fix lastUpdated format if needed
    if (data.lastUpdated) {
      if (typeof data.lastUpdated === 'string' && data.lastUpdated.startsWith("'") && data.lastUpdated.endsWith("'")) {
        // Remove quotes from string date
        data.lastUpdated = data.lastUpdated.substring(1, data.lastUpdated.length - 1);
        needsUpdate = true;
      } else if (typeof data.lastUpdated !== 'string') {
        // Convert date object or other types to string
        data.lastUpdated = new Date(data.lastUpdated).toISOString().split('T')[0];
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      // Create updated file content
      const updatedFileContent = matter.stringify(content, data);
      
      // Write updated content back to file
      fs.writeFileSync(filePath, updatedFileContent);
      fixedCount++;
      console.log(`  ✓ Fixed date format in: ${path.basename(filePath)}`);
    }
    
    processedCount++;
  } catch (error) {
    console.error(`  Error fixing date format in ${filePath}:`, error);
  }
}

/**
 * Process all files in a directory
 * @param {string} dirPath - Directory path to process
 */
function processDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory does not exist: ${dirPath}`);
      return;
    }
    
    console.log(`\nProcessing directory: ${dirPath}`);
    
    // Get all markdown files in the directory
    const files = fs.readdirSync(dirPath).filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );
    
    console.log(`Found ${files.length} markdown files`);
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      fixDateFormat(filePath);
    });
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

// Main execution
console.log('=== Starting Date Format Fix ===');

// Process each content directory
contentDirs.forEach(dirPath => {
  processDirectory(dirPath);
});

console.log(`\n=== Finished Date Format Fix ===`);
console.log(`Processed ${processedCount} files, fixed ${fixedCount} files with date format issues`);
