const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// Find related content based on tags and keywords
const findRelatedContent = (sourceFile, allFiles) => {
  const sourcePath = path.join(process.cwd(), sourceFile);
  const sourceContent = fs.readFileSync(sourcePath, 'utf8');
  const { data: sourceFrontmatter, content: sourceText } = matter(sourceContent);
  
  const sourceTags = sourceFrontmatter.tags || [];
  const sourceTitle = sourceFrontmatter.title;
  const sourceSlug = sourceFile.split('/').pop().replace(/\.(md|mdx)$/, '');
  
  // Extract important keywords from source content
  const sourceKeywords = sourceText
    .split(/\s+/)
    .filter(word => word.length > 5)
    .map(word => word.toLowerCase())
    .filter(word => !['there', 'their', 'about', 'would', 'should'].includes(word));
  
  const relatedFiles = [];
  
  // Check each file for relationships
  allFiles.forEach(targetFile => {
    if (targetFile === sourceFile) return;
    
    const targetPath = path.join(process.cwd(), targetFile);
    const targetContent = fs.readFileSync(targetPath, 'utf8');
    const { data: targetFrontmatter, content: targetText } = matter(targetContent);
    
    const targetTags = targetFrontmatter.tags || [];
    const targetTitle = targetFrontmatter.title;
    const targetSlug = targetFile.split('/').pop().replace(/\.(md|mdx)$/, '');
    
    // Calculate relationship score
    let relationshipScore = 0;
    
    // Tag matches
    sourceTags.forEach(tag => {
      if (targetTags.includes(tag)) relationshipScore += 3;
    });
    
    // Keyword matches
    sourceKeywords.forEach(keyword => {
      if (targetText.toLowerCase().includes(keyword)) relationshipScore += 1;
    });
    
    // Title mention
    if (targetText.includes(sourceTitle)) relationshipScore += 5;
    if (sourceText.includes(targetTitle)) relationshipScore += 5;
    
    // If score is high enough, consider it related
    if (relationshipScore >= 5) {
      relatedFiles.push({
        file: targetFile,
        title: targetTitle,
        slug: targetSlug,
        score: relationshipScore
      });
    }
  });
  
  return relatedFiles.sort((a, b) => b.score - a.score).slice(0, 5);
};

// Add backlinks to a file
const addBacklinks = (filePath, relatedContent) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  // Check if content already has a Related section
  if (content.includes('## Related')) {
    console.log(`${filePath} already has a Related section. Skipping.`);
    return;
  }
  
  // Create backlinks section
  let backlinksSection = '\n\n## Related\n\n';
  relatedContent.forEach(related => {
    backlinksSection += `- [[${related.title}]]\n`;
  });
  
  // Add backlinks to content
  const updatedContent = content + backlinksSection;
  const updatedFileContent = matter.stringify(updatedContent, data);
  
  // Write back to file
  fs.writeFileSync(filePath, updatedFileContent);
  console.log(`Added backlinks to ${filePath}`);
};

// Process all content files
const generateAllBacklinks = () => {
  const contentPatterns = [
    'Content/writings/*.md',
    'Content/notes/*.md'
  ];
  
  let allFiles = [];
  contentPatterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    files.forEach(file => {
      allFiles.push(file);
    });
  });
  
  // For each file, find related content and add backlinks
  allFiles.forEach(file => {
    const relatedContent = findRelatedContent(file, allFiles);
    if (relatedContent.length > 0) {
      addBacklinks(path.join(process.cwd(), file), relatedContent);
    }
  });
};

// Run the backlink generation
generateAllBacklinks();
