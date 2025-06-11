/**
 * Script to update writings to be type: evergreen and remove lastUpdated field
 * unless the file was manually edited today
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const TODAY = '2025-06-11'; // Today's date in YYYY-MM-DD format
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
      console.log(`Processing file: ${file}`);
      
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContent);
      
      // Check if the file was manually edited today (contains a date with today's date)
      // We'll look for lastUpdated that matches today's date in quotes
      const isManuallyEdited = file === 'the-strength-to-be-myself.md' || 
                              (data.lastUpdated && 
                               typeof data.lastUpdated === 'string' && 
                               data.lastUpdated.includes(TODAY));
                               
      console.log(`File ${file} - type: ${data.type || 'none'}, lastUpdated: ${data.lastUpdated || 'none'}, isManuallyEdited: ${isManuallyEdited}`);
      
      if (isManuallyEdited) {
        console.log(`Skipping manually edited file: ${file}`);
        return;
      }
      
      // Make changes
      let madeChanges = false;
      
      // Update type to evergreen if it's currently seedling
      if (data.type === 'seedling') {
        data.type = 'evergreen';
        madeChanges = true;
        console.log(`Changed type to evergreen in: ${file}`);
      }
      
      // Remove lastUpdated field if it exists
      if (data.lastUpdated) {
        delete data.lastUpdated;
        madeChanges = true;
        console.log(`Removed lastUpdated from: ${file}`);
      }
      
      // Only write the file if changes were made
      if (madeChanges) {
        // Create updated file content
        const updatedFileContent = matter.stringify(content, data);
        
        // Write updated content back to file
        fs.writeFileSync(filePath, updatedFileContent);
        console.log(`Updated file: ${file}`);
      } else {
        console.log(`No changes needed for: ${file}`);
      }
    });
    
    console.log(`Completed processing writings directory`);
  } catch (error) {
    console.error(`Error processing directory ${writingsDir}:`, error);
  }
}

// Function to process notes directory
function processNotes() {
  const notesDir = path.join(process.cwd(), 'Content/notes');
  console.log(`Processing notes directory: ${notesDir}`);
  
  try {
    // Get all markdown files in notes directory
    const files = fs.readdirSync(notesDir).filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );
    
    console.log(`Found ${files.length} note files`);
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(notesDir, file);
      
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContent);
      
      // Check if the file has a manually edited lastUpdated date
      const isManuallyEdited = data.lastUpdated && 
                               typeof data.lastUpdated === 'string' && 
                               data.lastUpdated.includes(TODAY);
      
      if (isManuallyEdited) {
        console.log(`Skipping manually edited note: ${file}`);
        return;
      }
      
      // Remove lastUpdated field if it exists
      if (data.lastUpdated) {
        delete data.lastUpdated;
        
        // Create updated file content
        const updatedFileContent = matter.stringify(content, data);
        
        // Write updated content back to file
        fs.writeFileSync(filePath, updatedFileContent);
        console.log(`Updated note: ${file} - Removed lastUpdated`);
      }
    });
    
    console.log(`Completed processing notes directory`);
  } catch (error) {
    console.error(`Error processing directory ${notesDir}:`, error);
  }
}

console.log('Starting updates for writings and notes files');
processWritings();
processNotes();
console.log('Finished updates');
