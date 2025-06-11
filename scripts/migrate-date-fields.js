#!/usr/bin/env node
/**
 * This script migrates date fields to createdAt in content files
 * and ensures all date formats are standardized to ISO format.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Content directories to process
const CONTENT_DIRS = [
  'Content/notes',
  'Content/writings',
  'Content/bookmarks',
  // Add other content directories as needed
];

// Count stats
const stats = {
  total: 0,
  migrated: 0,
  alreadyMigrated: 0,
  errors: 0
};

/**
 * Safely format date string to ISO format
 */
function safeFormatDate(dateValue) {
  if (!dateValue) return new Date().toISOString();
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date value: ${dateValue}, using current date instead`);
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.warn(`Error parsing date ${dateValue}: ${error}`);
    return new Date().toISOString();
  }
}

/**
 * Process a content file to standardize its date fields
 */
function processFile(filePath) {
  try {
    stats.total++;
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: fileContent } = matter(content);
    
    let modified = false;
    
    // Check if we need to add createdAt (migrate from date)
    if (!data.createdAt && data.date) {
      data.createdAt = safeFormatDate(data.date);
      modified = true;
      stats.migrated++;
    } 
    // If createdAt exists but is not in proper format
    else if (data.createdAt) {
      const formattedDate = safeFormatDate(data.createdAt);
      if (formattedDate !== data.createdAt) {
        data.createdAt = formattedDate;
        modified = true;
        stats.migrated++;
      } else {
        stats.alreadyMigrated++;
      }
    }
    
    // Handle lastUpdated if present
    if (data.lastUpdated) {
      const formattedDate = safeFormatDate(data.lastUpdated);
      if (formattedDate !== data.lastUpdated) {
        data.lastUpdated = formattedDate;
        modified = true;
      }
    } else if (data.createdAt) {
      // Add lastUpdated if not present
      data.lastUpdated = data.createdAt;
      modified = true;
    }
    
    // Write back the file if modified
    if (modified) {
      const updatedFileContent = matter.stringify(fileContent, data);
      fs.writeFileSync(filePath, updatedFileContent);
      console.log(`✅ Updated ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    stats.errors++;
  }
}

/**
 * Process all files in a directory
 */
function processDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory not found: ${dirPath}`);
      return;
    }
    
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        processFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}: ${error.message}`);
    stats.errors++;
  }
}

// Main execution
console.log('🔄 Starting date migration process...');
const rootDir = process.cwd();

for (const dir of CONTENT_DIRS) {
  const fullPath = path.join(rootDir, dir);
  console.log(`\nProcessing ${dir}...`);
  processDirectory(fullPath);
}

// Print summary
console.log('\n📊 Migration Summary:');
console.log(`Total files processed: ${stats.total}`);
console.log(`Files migrated/standardized: ${stats.migrated}`);
console.log(`Files already in correct format: ${stats.alreadyMigrated}`);
console.log(`Errors: ${stats.errors}`);
console.log('\n✨ Migration complete!');
