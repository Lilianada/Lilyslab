const { join } = require('path');
const fs = require('fs');
const matter = require('gray-matter');

async function testArchives() {
  try {
    console.log('Testing archives API logic...');
    
    const notesArchivesDirectory = join(process.cwd(), 'Content', 'archives', 'notes');
    const essaysArchivesDirectory = join(process.cwd(), 'Content', 'archives', 'essays');
    
    const items = [];
    
    console.log('Notes directory exists:', fs.existsSync(notesArchivesDirectory));
    console.log('Essays directory exists:', fs.existsSync(essaysArchivesDirectory));
    
    // Process notes
    if (fs.existsSync(notesArchivesDirectory)) {
      const notesFiles = fs.readdirSync(notesArchivesDirectory);
      console.log('Notes files:', notesFiles);
      
      for (const fileName of notesFiles) {
        if (!fileName.endsWith('.md') || fileName === 'README.md') continue;
        
        console.log(`Processing notes file: ${fileName}`);
        const slug = fileName.replace(/\.md$/, '');
        const filePath = join(notesArchivesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        
        try {
          const { data } = matter(fileContents);
          console.log(`  - Parsed successfully, title: ${data.title}`);
          
          items.push({
            slug,
            title: data.title || fileName.replace(/\.md$/, ''),
            category: "notes",
            createdAt: data.createdAt || data.date || '',
          });
        } catch (parseError) {
          console.error(`  - Parse error in ${fileName}:`, parseError.message);
          throw parseError;
        }
      }
    }
    
    // Process essays
    if (fs.existsSync(essaysArchivesDirectory)) {
      const essaysFiles = fs.readdirSync(essaysArchivesDirectory);
      console.log('Essays files:', essaysFiles);
      
      for (const fileName of essaysFiles) {
        if (!fileName.endsWith('.md') || fileName === 'README.md') continue;
        
        console.log(`Processing essays file: ${fileName}`);
        const slug = fileName.replace(/\.md$/, '');
        const filePath = join(essaysArchivesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        
        try {
          const { data } = matter(fileContents);
          console.log(`  - Parsed successfully, title: ${data.title}`);
          
          items.push({
            slug,
            title: data.title || fileName.replace(/\.md$/, '').replace(/-/g, ' '),
            category: "essays",
            createdAt: data.createdAt || data.date || '',
          });
        } catch (parseError) {
          console.error(`  - Parse error in ${fileName}:`, parseError.message);
          throw parseError;
        }
      }
    }
    
    console.log('Total items processed:', items.length);
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testArchives();
