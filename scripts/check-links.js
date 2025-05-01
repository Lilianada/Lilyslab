const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const https = require('https');
const http = require('http');

// Check internal links in markdown content
const checkInternalLinks = () => {
  const contentPatterns = [
    'Content/writings/*.md',
    'Content/notes/*.md',
    'Content/logs/*.mdx'
  ];
  
  let allFiles = [];
  let allSlugs = new Set();
  
  // First, collect all valid slugs
  contentPatterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    files.forEach(file => {
      const slug = file.split('/').pop().replace(/\.(md|mdx)$/, '');
      allSlugs.add(slug);
      allFiles.push(file);
    });
  });
  
  console.log(`Found ${allSlugs.size} valid content slugs`);
  
  // Then check each file for broken internal links
  let brokenLinksFound = false;
  
  allFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContent);
    
    // Check for wiki-style links [[Link]]
    const wikiLinks = content.match(/\[\[(.*?)\]\]/g) || [];
    wikiLinks.forEach(link => {
      const linkText = link.slice(2, -2);
      const linkSlug = linkText.toLowerCase().replace(/\s+/g, '-');
      
      if (!allSlugs.has(linkSlug)) {
        console.error(`Broken wiki link in ${file}: ${link} (no matching slug found)`);
        brokenLinksFound = true;
      }
    });
    
    // Check for markdown links [Text](url)
    const markdownLinks = content.match(/\[.*?\]\((.*?)\)/g) || [];
    markdownLinks.forEach(link => {
      const urlMatch = link.match(/\[.*?\]\((.*?)\)/);
      if (urlMatch && urlMatch[1]) {
        const url = urlMatch[1];
        
        // Check if it's an internal link
        if (!url.startsWith('http') && !url.startsWith('#')) {
          // Remove any path segments and get the slug
          const slug = url.split('/').pop().replace(/\.(md|mdx)$/, '');
          
          if (!allSlugs.has(slug)) {
            console.error(`Broken internal link in ${file}: ${link} (no matching slug found)`);
            brokenLinksFound = true;
          }
        }
      }
    });
  });
  
  if (!brokenLinksFound) {
    console.log('✅ No broken internal links found!');
  }
  
  return brokenLinksFound;
};

// Check a single external URL
const checkExternalUrl = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      const statusCode = res.statusCode;
      
      // Consider redirects as valid
      if (statusCode >= 200 && statusCode < 400) {
        resolve({ url, valid: true, status: statusCode });
      } else {
        resolve({ url, valid: false, status: statusCode });
      }
      
      // Consume response data to free up memory
      res.resume();
    });
    
    req.on('error', (err) => {
      resolve({ url, valid: false, error: err.message });
    });
    
    req.on('timeout', () => {
      req.abort();
      resolve({ url, valid: false, error: 'Request timed out' });
    });
  });
};

// Check external links
const checkExternalLinks = async () => {
  const contentPatterns = [
    'Content/writings/*.md',
    'Content/notes/*.md',
    'Content/logs/*.mdx'
  ];
  
  let externalLinks = new Set();
  
  // Collect all external links
  contentPatterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    files.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { content } = matter(fileContent);
      
      // Find markdown links [Text](url)
      const markdownLinks = content.match(/\[.*?\]\((.*?)\)/g) || [];
      markdownLinks.forEach(link => {
        const urlMatch = link.match(/\[.*?\]\((.*?)\)/);
        if (urlMatch && urlMatch[1]) {
          const url = urlMatch[1];
          
          // Only check http/https links
          if (url.startsWith('http')) {
            externalLinks.add(url);
          }
        }
      });
    });
  });
  
  console.log(`Found ${externalLinks.size} external links to check`);
  
  // Check each external link
  const results = [];
  const links = Array.from(externalLinks);
  
  // Check links in batches to avoid overwhelming servers
  const batchSize = 5;
  for (let i = 0; i < links.length; i += batchSize) {
    const batch = links.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkExternalUrl));
    results.push(...batchResults);
    
    // Add a small delay between batches
    if (i + batchSize < links.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Output results
  let brokenLinksFound = false;
  
  results.forEach(result => {
    if (result.valid) {
      console.log(`✅ Valid link: ${result.url}`);
    } else {
      console.error(`❌ Broken link: ${result.url} (${result.status || result.error})`);
      brokenLinksFound = true;
    }
  });
  
  if (!brokenLinksFound) {
    console.log('✅ No broken external links found!');
  }
  
  return brokenLinksFound;
};

// Run both checks
const main = async () => {
  console.log('Checking internal links...');
  const internalBroken = checkInternalLinks();
  
  console.log('\nChecking external links...');
  const externalBroken = await checkExternalLinks();
  
  if (internalBroken || externalBroken) {
    console.error('\n❌ Broken links found! Please fix them before continuing.');
    process.exit(1);
  } else {
    console.log('\n✅ All links are valid!');
  }
};

main().catch(err => {
  console.error('Error during link checking:', err);
  process.exit(1);
});
