/**
 * Script to update metadata structure in notes and writings
 * Changes:
 * - Renames 'date' to 'createdAt'
 * - Adds 'lastUpdated' field with current date
 * - Adds 'type: seedling' to notes if missing
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const currentDate = new Date().toISOString().split('T')[0];

// Function to process a directory of markdown files
function processDirectory(directoryPath) {
  console.log(`Processing directory: ${directoryPath}`);
  
  try {
    // Get all markdown files in directory
    const files = fs.readdirSync(directoryPath).filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );
    
    console.log(`Found ${files.length} markdown files`);
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      console.log(`Processing file: ${filePath}`);
      
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContent);
      
      // Check if already has new structure
      if (data.createdAt && data.lastUpdated && data.type) {
        console.log(`File already has new structure: ${file}`);
        return;
      }
      
      // Update metadata
      const updatedData = { ...data };
      
      // Update date to createdAt
      if (data.date && !data.createdAt) {
        updatedData.createdAt = data.date;
        delete updatedData.date;
      } else if (!data.createdAt) {
        updatedData.createdAt = currentDate;
      }
      
      // Add lastUpdated if not present
      if (!updatedData.lastUpdated) {
        updatedData.lastUpdated = currentDate;
      }
      
      // Add type: seedling for notes if not present
      if (directoryPath.includes('notes') && !updatedData.type) {
        updatedData.type = 'seedling';
      }
      
      // Add type for writings if not present
      if (directoryPath.includes('writings') && !updatedData.type) {
        updatedData.type = 'seedling';
      }
      
      // Create updated file content
      const updatedFileContent = matter.stringify(content, updatedData);
      
      // Write updated content back to file
      fs.writeFileSync(filePath, updatedFileContent);
      console.log(`Updated file: ${file}`);
    });
    
    console.log(`Completed processing directory: ${directoryPath}`);
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
  }
}

// Main execution
const notesDir = path.join(process.cwd(), 'Content', 'notes');
const writingsDir = path.join(process.cwd(), 'Content', 'writings');

console.log('Starting metadata structure update');
processDirectory(notesDir);
processDirectory(writingsDir);
console.log('Finished metadata structure update');
