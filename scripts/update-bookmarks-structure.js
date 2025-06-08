const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = process.cwd();
const OLD_CATEGORY_DIR = path.join(BASE_DIR, 'Content/bookmarks-by-category');
const NEW_BOOKMARKS_DIR = path.join(BASE_DIR, 'Content/bookmarks');
const OLD_BOOKMARKS_DIR = path.join(BASE_DIR, 'Content/bookmarks');

// Rename directory function
function renameDirectory() {
  // Check if old category directory exists
  if (!fs.existsSync(OLD_CATEGORY_DIR)) {
    console.error('The bookmarks-by-category directory does not exist');
    return false;
  }

  // Create backup of old bookmarks directory if it exists
  if (fs.existsSync(OLD_BOOKMARKS_DIR)) {
    const backupDir = path.join(BASE_DIR, 'Content/bookmarks-backup-' + Date.now());
    fs.renameSync(OLD_BOOKMARKS_DIR, backupDir);
    console.log(`Backed up old bookmarks directory to ${backupDir}`);
  }

  // Rename the directory
  fs.renameSync(OLD_CATEGORY_DIR, NEW_BOOKMARKS_DIR);
  console.log('Successfully renamed bookmarks-by-category to bookmarks');
  return true;
}

// Main function
function main() {
  console.log('Starting bookmarks structure update...');
  
  const success = renameDirectory();
  if (!success) {
    console.error('Failed to update bookmarks structure');
    process.exit(1);
  }

  console.log('Bookmarks structure update completed successfully');
}

// Run the main function
main();
