const fs = require('fs');
const path = require('path');

// Format date in YYYY-MM-DD format
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Content type templates
const templates = {
  log: (title, tags) => `---
title: "${title}"
date: "${formatDate(new Date())}"
published: true
tags: [${tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]
---

## Project Goals

-   [ ] Goal 1: Brief description of the first project goal.
-   [ ] Goal 2: Brief description of the second project goal.
-   [ ] Goal 3: Brief description of the third project goal.

## Log - ${formatDate(new Date())}

-   **Top of mind:** What's the main thing you're thinking about with this project?
-   **Made today great:** What was your biggest achievement or breakthrough today?
-   **One Thing:** What's the most important thing you accomplished or learned?

## Challenges

-   Challenge 1: Brief description of a challenge you faced.
-   Challenge 2: Brief description of another challenge.

## Resources

-   [Resource Name](URL_HERE) - Brief description of how this resource helped.

## Next Steps

-   Next step 1: What you plan to do next.
-   Next step 2: Another planned action.
`,
  note: (title, tags) => `---
title: "${title}"
tags: 
${tags.split(',').map(tag => `  - ${tag.trim()}`).join('\n')}
date: ${formatDate(new Date())}
image: 
publish: true
--- 

Write your note content here...
`,
  writing: (title, tags) => `---
title: "${title}"
date: ${formatDate(new Date())}
excerpt: Brief description of this writing.
published: true
slug: ${title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}
tags:
${tags.split(',').map(tag => `  - ${tag.trim()}`).join('\n')}
---

## ${title}

Write your content here...
`,
  bookmark: (title, tags) => `---
title: "${title}"
link: "URL_HERE"
cover: ""
tags: [${tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]
type: "website"
created: "${new Date().toISOString()}"
---
`
};

// Get command line arguments
const [,, contentType, title, tags = ''] = process.argv;

if (!contentType || !title) {
  console.error('Usage: node create-content.js <type> "Title" "tag1,tag2,tag3"');
  process.exit(1);
}

// Determine directory and file extension based on content type
const contentTypeConfig = {
  log: { dir: 'Content/logs', ext: 'mdx' },
  note: { dir: 'Content/notes', ext: 'md' },
  writing: { dir: 'Content/essays', ext: 'md' },
  bookmark: { dir: 'Content/bookmarks', ext: 'md' },
};

const config = contentTypeConfig[contentType];
if (!config) {
  console.error(`Unknown content type: ${contentType}`);
  process.exit(1);
}

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^\w\s]/g, '')
  .replace(/\s+/g, '-');

// Get next file number for numbered content
const getNextFileNumber = (dir) => {
  const files = fs.readdirSync(dir);
  const numbers = files
    .filter(file => /^\d+\.(md|mdx)$/.test(file))
    .map(file => parseInt(file.split('.')[0], 10));
  
  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
};

// Create the file
const createFile = () => {
  const { dir, ext } = config;
  let fileName;
  
  // For logs, use numbered files
  if (contentType === 'log') {
    const nextNum = getNextFileNumber(dir);
    fileName = `${String(nextNum).padStart(3, '0')}.${ext}`;
  } else {
    fileName = `${slug}.${ext}`;
  }
  
  const filePath = path.join(process.cwd(), dir, fileName);
  const content = templates[contentType](title, tags);
  
  fs.writeFileSync(filePath, content);
  console.log(`Created ${contentType}: ${filePath}`);
};

createFile();
