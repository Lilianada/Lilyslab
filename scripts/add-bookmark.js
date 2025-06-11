#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const matter = require('gray-matter');

// Configuration
const BOOKMARKS_DIR = path.join(process.cwd(), 'Content/bookmarks');
const CATEGORIES = ['article', 'website', 'video', 'misc'];

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask a question and return a promise with the answer
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Function to add a new bookmark
async function addBookmark() {
  console.log('📚 Add a New Bookmark 📚\n');
  
  // Get bookmark details
  const title = await askQuestion('Title: ');
  const url = await askQuestion('URL: ');
  console.log('\nCategories:');
  CATEGORIES.forEach((cat, i) => {
    console.log(`${i + 1}. ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
  });
  const categoryIndex = parseInt(await askQuestion('Select category (number): '), 10) - 1;
  const category = CATEGORIES[categoryIndex] || 'misc';
  
  const tagsInput = await askQuestion('Tags (comma-separated): ');
  const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
  
  const dateInput = await askQuestion('CreatedAt (YYYY-MM-DD, leave blank for today): ');
  const createdAt = dateInput || new Date().toISOString().split('T')[0];
  const lastUpdated = createdAt; // Initially lastUpdated is the same as createdAt
  
  // Generate ID
  let id;
  const categoryFile = path.join(BOOKMARKS_DIR, `${category}.md`);
  
  if (fs.existsSync(categoryFile)) {
    try {
      const content = fs.readFileSync(categoryFile, 'utf-8');
      const bookmarkSections = content.split(/---\n\n---/).length;
      id = `${category}-${String(bookmarkSections + 1).padStart(3, '0')}`;
    } catch (err) {
      console.error('Error reading category file:', err);
      // Generate random ID as fallback
      id = `${category}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    }
  } else {
    // First bookmark in this category
    id = `${category}-001`;
  }
  
  // Create bookmark content
  const bookmark = {
    id,
    title,
    URL: url,
    createdAt,
    lastUpdated,
    tags,
    type: category,
    publish: true
  };
  
  const frontmatter = Object.entries(bookmark)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
      } else {
        return `${key}: ${value}`;
      }
    })
    .join('\n');
  
  const bookmarkContent = `---\n${frontmatter}\n---\n\n`;
  
  // Add to category file
  try {
    if (!fs.existsSync(BOOKMARKS_DIR)) {
      fs.mkdirSync(BOOKMARKS_DIR, { recursive: true });
    }
    
    // Check if file exists and create/append as needed
    if (fs.existsSync(categoryFile)) {
      const content = fs.readFileSync(categoryFile, 'utf-8');
      fs.writeFileSync(categoryFile, content + (content.trim() ? '\n\n---\n\n' : '') + bookmarkContent);
    } else {
      fs.writeFileSync(categoryFile, bookmarkContent);
    }
    
    console.log(`\n✅ Bookmark "${title}" added successfully to ${category}.md with ID ${id}`);
  } catch (err) {
    console.error('Error adding bookmark:', err);
  }
  
  rl.close();
}

// Run the script
addBookmark().catch(console.error);
