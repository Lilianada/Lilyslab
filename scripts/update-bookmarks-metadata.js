/**
 * Script to update metadata structure in bookmarks
 * Changes:
 * - Renames 'date' to 'createdAt'
 * - Adds 'lastUpdated' field 
 */
const fs = require('fs');
const path = require('path');

// Function to process bookmarks file
function processBookmarksFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Replace 'date: ' with 'createdAt: ' and add lastUpdated
    let updatedContent = fileContent.replace(/date: (\d{4}-\d{2}-\d{2})/g, function(match, date) {
      return `createdAt: ${date}\nlastUpdated: ${date}`;
    });
    
    // Write updated content back to file
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated file: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main execution
const bookmarksDir = path.join(process.cwd(), 'Content', 'bookmarks');

console.log('Starting bookmarks metadata update');

// Get all markdown files in directory
const files = fs.readdirSync(bookmarksDir).filter(file => 
  file.endsWith('.md') || file.endsWith('.mdx')
);

console.log(`Found ${files.length} bookmark files`);

// Process each file
files.forEach(file => {
  const filePath = path.join(bookmarksDir, file);
  processBookmarksFile(filePath);
});

console.log('Finished bookmarks metadata update');
