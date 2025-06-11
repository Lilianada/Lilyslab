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
    // Read file content as a string first
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const fileName = path.basename(filePath);
    const hasQuotedDate = /'(\d{4}-\d{2}-\d{2})'/.test(fileContent);
    
    if (hasQuotedDate) {
      console.log(`  Found quoted date in: ${fileName}`);
    }
    
    // Fix quoted dates manually in the raw string
    let updatedContent = fileContent
      // Fix createdAt with single quotes
      .replace(/createdAt: '(\d{4}-\d{2}-\d{2})'/g, "createdAt: $1")
      // Fix lastUpdated with single quotes
      .replace(/lastUpdated: '(\d{4}-\d{2}-\d{2})'/g, "lastUpdated: $1");
    
    // Only write back if changes were made
    if (updatedContent !== fileContent) {
      fs.writeFileSync(filePath, updatedContent);
      fixedCount++;
      console.log(`  ✓ Fixed quoted date in: ${fileName}`);
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
console.log('=== Starting Date Format Fix (Removing Quotes) ===');

// Process each content directory
contentDirs.forEach(dirPath => {
  processDirectory(dirPath);
});

console.log(`\n=== Finished Date Format Fix ===`);
console.log(`Processed ${processedCount} files, fixed ${fixedCount} files with quoted date formats`);
