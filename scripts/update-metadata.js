const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// Calculate reading time based on word count
const calculateReadingTime = (wordCount) => {
  return Math.max(1, Math.round(wordCount / 200));
};

// Count words in text
const countWords = (text) => {
  return text.split(/\s+/).filter(Boolean).length;
};

// Update metadata for a single file
const updateFileMetadata = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Calculate word count and reading time
    const wordCount = countWords(content);
    const readingTime = calculateReadingTime(wordCount);
    
    // Only update if values changed
    if (data.wordCount !== wordCount || data.readingTime !== readingTime) {
      // Update frontmatter
      const updatedData = {
        ...data,
        wordCount,
        readingTime
      };
      
      // Convert back to frontmatter and content
      const updatedFileContent = matter.stringify(content, updatedData);
      
      // Write back to file
      fs.writeFileSync(filePath, updatedFileContent);
      console.log(`Updated metadata for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
};

// Process all content files
const updateAllMetadata = () => {
  const contentDirs = [
    'Content/writings/*.md',
    'Content/notes/*.md',
    'Content/logs/*.mdx'
  ];
  
  contentDirs.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    files.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      updateFileMetadata(filePath);
    });
  });
};

// Run the update
updateAllMetadata();
