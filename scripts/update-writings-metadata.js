/**
 * Script to update writings to be type: evergreen and remove lastUpdated field
 * unless the file was modified today
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const TODAY = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
const writingsDir = path.join(process.cwd(), 'Content/writings');

// Function to process writings directory
function processWritings() {
  console.log(`Processing writings directory: ${writingsDir}`);
  
  try {
    // Get all markdown files in writings directory
    const files = fs.readdirSync(writingsDir).filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );
    
    console.log(`Found ${files.length} writing files`);
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(writingsDir, file);
      console.log(`Processing file: ${filePath}`);
      
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContent);
      
      // Check if the file was manually edited
      // We'll consider a file manually edited if it contains a formatted lastUpdated date with quotes
      const hasManuallyEditedDate = data.lastUpdated && typeof data.lastUpdated === 'string' && 
                               (data.lastUpdated.includes('-') || data.lastUpdated.startsWith("'") || data.lastUpdated.startsWith('"'));
      
      if (hasManuallyEditedDate && data.lastUpdated.includes(TODAY.slice(-2))) {
        console.log(`Skipping file with manually edited date: ${file}`);
        return;
      }
      
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContent);
      
      // Update type to evergreen
      if (data.type === 'seedling') {
        data.type = 'evergreen';
      }
      
      // Remove lastUpdated field if it exists and was automatically added
      if (data.lastUpdated) {
        delete data.lastUpdated;
      }
      
      // Create updated file content
      const updatedFileContent = matter.stringify(content, data);
      
      // Write updated content back to file
      fs.writeFileSync(filePath, updatedFileContent);
      console.log(`Updated file: ${file} - Set type to evergreen and removed lastUpdated`);
    });
    
    console.log(`Completed processing writings directory`);
  } catch (error) {
    console.error(`Error processing directory ${writingsDir}:`, error);
  }
}

console.log('Starting updates for writings files');
processWritings();
console.log('Finished updates');
