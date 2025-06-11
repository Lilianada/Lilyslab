/**
 * Script to update content types across different content directories:
 * - Threads: type: seedling
 * - Notes: type: budding
 * - Writings: type: evergreen
 * 
 * And remove lastUpdated field if it was automatically added
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const TODAY = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

// Content directories
const CONTENT_DIRS = {
  threads: {
    path: path.join(process.cwd(), 'Content/threads'),
    type: 'seedling'
  },
  notes: {
    path: path.join(process.cwd(), 'Content/notes'),
    type: 'budding'
  },
  writings: {
    path: path.join(process.cwd(), 'Content/writings'),
    type: 'evergreen'
  }
};

// Function to check if a file was updated today
function wasManuallyUpdatedToday(data) {
  return data.lastUpdated && 
         typeof data.lastUpdated === 'string' && 
         data.lastUpdated.includes(TODAY);
}

// Function to process content directories
function processContentDirectory(dirName, dirInfo) {
  const { path: dirPath, type: contentType } = dirInfo;
  console.log(`\nProcessing ${dirName} directory (type: ${contentType}): ${dirPath}`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return {
      updated: 0,
      skipped: 0,
      errors: 0
    };
  }
  
  let stats = {
    updated: 0,
    skipped: 0,
    errors: 0
  };
  
  try {
    // Get all markdown files in the directory
    const files = fs.readdirSync(dirPath).filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );
    
    console.log(`Found ${files.length} markdown files in ${dirName}`);
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      
      try {
        // Read file content
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Parse frontmatter
        const { data, content } = matter(fileContent);
        
        console.log(`File: ${file} (current type: ${data.type || 'none'}, has lastUpdated: ${!!data.lastUpdated})`);
        
        // Check if the file was manually updated today
        if (data.lastUpdated && 
            data.lastUpdated.toString().includes(TODAY) && 
            data.type === contentType) {
          console.log(`  Skipping file with today's date and correct type: ${file}`);
          stats.skipped++;
          return;
        }
        
        // Track if anything changed
        let wasModified = false;
        
        // Update type if needed
        if (data.type !== contentType) {
          console.log(`  Changing type from "${data.type || 'none'}" to "${contentType}"`);
          data.type = contentType;
          wasModified = true;
        }
        
        // Check if lastUpdated was likely automatically added
        const isAutoUpdated = data.lastUpdated && 
                           typeof data.lastUpdated === 'string' && 
                           data.lastUpdated.length === 10; // YYYY-MM-DD format
        
        // Remove lastUpdated field if it exists and was automatically added
        if (isAutoUpdated) {
          console.log(`  Removing automatically added lastUpdated: ${data.lastUpdated}`);
          delete data.lastUpdated;
          wasModified = true;
        }
        
        if (!wasModified) {
          console.log(`  No changes needed`);
          stats.skipped++;
          return;
        }
        
        // Create updated file content
        const updatedFileContent = matter.stringify(content, data);
        
        // Write updated content back to file
        fs.writeFileSync(filePath, updatedFileContent);
        console.log(`  Updated successfully`);
        stats.updated++;
      } catch (error) {
        console.error(`  Error processing file ${file}:`, error);
        stats.errors++;
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    stats.errors++;
  }
  
  return stats;
}

// Main execution
console.log('Starting content type updates');
Object.entries(CONTENT_DIRS).forEach(([dirName, dirInfo]) => {
  const stats = processContentDirectory(dirName, dirInfo);
  console.log(`${dirName}: ${stats.updated} updated, ${stats.skipped} skipped, ${stats.errors} errors`);
});
console.log('\nFinished content type updates');
