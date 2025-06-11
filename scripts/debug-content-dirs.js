/**
 * Debug script to verify directory access and content types
 */
const fs = require('fs');
const path = require('path');

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

// Check if directories exist and list files
console.log('Checking content directories:');
Object.entries(CONTENT_DIRS).forEach(([name, dirInfo]) => {
  const { path: dirPath, type: contentType } = dirInfo;
  console.log(`\nDirectory "${name}" (type=${contentType}): ${dirPath}`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`  Directory does not exist`);
    return;
  }
  
  try {
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    console.log(`  Found ${files.length} markdown files`);
    if (files.length > 0) {
      console.log(`  Sample files: ${files.slice(0, 3).join(', ')}${files.length > 3 ? '...' : ''}`);
    }
  } catch (error) {
    console.error(`  Error reading directory: ${error.message}`);
  }
});
