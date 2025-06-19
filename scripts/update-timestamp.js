#!/usr/bin/env node

/**
 * Script to update the last-updated.json file with the current date and time
 * This is designed to be used as a Git pre-push hook
 */

const fs = require('fs');
const path = require('path');

// Path to the last-updated.json file
const lastUpdatedPath = path.join(__dirname, '..', 'last-updated.json');

// Update the last-updated.json file
try {
  // Read the current file content - handle any comments at the top of the file
  let fileContent = fs.readFileSync(lastUpdatedPath, 'utf-8');
  
  // Remove all comment lines at the top of the file
  while (fileContent.trim().startsWith('//')) {
    const lines = fileContent.split('\n');
    lines.shift(); // Remove comment line
    fileContent = lines.join('\n');
  }
  
  const data = JSON.parse(fileContent);
  
  // Update the timestamp with the current date and time
  data.lastUpdated = new Date().toISOString();
  data.source = "git-push"; // Update the source to indicate it was updated by a git push
  
  // Write back to the file with pretty formatting and a single comment
  const updatedContent = `// filepath: ${lastUpdatedPath}\n${JSON.stringify(data, null, 2)}`;
  fs.writeFileSync(lastUpdatedPath, updatedContent);
  
  console.log('✅ Successfully updated last-updated.json with current timestamp');
} catch (error) {
  console.error('❌ Error updating last-updated.json:', error.message);
  process.exit(1);
}
