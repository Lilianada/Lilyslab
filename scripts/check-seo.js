/**
 * SEO Checker Script
 * 
 * This script checks for common SEO issues in the codebase
 * and provides suggestions for improvement to achieve a perfect Lighthouse score.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define patterns to search for
const seoPatterns = [
  {
    pattern: /<title>(?!.*\{\{.*\}\}.*)[^<]{1,60}<\/title>/g,
    message: 'Title tag with appropriate length (good)',
    severity: 'info',
    fix: 'Keep title tags between 50-60 characters'
  },
  {
    pattern: /<title>[^<]{61,}<\/title>/g,
    message: 'Title tag too long',
    severity: 'medium',
    fix: 'Keep title tags between 50-60 characters'
  },
  {
    pattern: /<title>[^<]{1,30}<\/title>/g,
    message: 'Title tag too short',
    severity: 'low',
    fix: 'Consider a more descriptive title (aim for 50-60 characters)'
  },
  {
    pattern: /<meta\s+name="description"[^>]*content="[^"]{1,160}"[^>]*>/g,
    message: 'Meta description with appropriate length (good)',
    severity: 'info',
    fix: 'Keep meta descriptions between 120-160 characters'
  },
  {
    pattern: /<meta\s+name="description"[^>]*content="[^"]{161,}"[^>]*>/g,
    message: 'Meta description too long',
    severity: 'medium',
    fix: 'Keep meta descriptions between 120-160 characters'
  },
  {
    pattern: /<meta\s+name="description"[^>]*content="[^"]{1,80}"[^>]*>/g,
    message: 'Meta description too short',
    severity: 'low',
    fix: 'Consider a more descriptive meta description (aim for 120-160 characters)'
  },
  {
    pattern: /<h1[^>]*>[^<]+<\/h1>/g,
    message: 'H1 tag found (good)',
    severity: 'info',
    fix: 'Each page should have exactly one H1 tag'
  },
  {
    pattern: /<img[^>]*alt="[^"]*"[^>]*>/g,
    message: 'Image with alt attribute (good)',
    severity: 'info',
    fix: 'All images should have descriptive alt attributes'
  },
  {
    pattern: /<img(?![^>]*alt=)[^>]*>/g,
    message: 'Image without alt attribute',
    severity: 'high',
    fix: 'Add descriptive alt text to all images'
  },
  {
    pattern: /<a[^>]*href="[^"]*"[^>]*rel="[^"]*nofollow[^"]*"[^>]*>/g,
    message: 'Link with nofollow (good for external links)',
    severity: 'info',
    fix: 'External links should have rel="nofollow" or rel="noopener noreferrer"'
  },
  {
    pattern: /<a[^>]*href="https?:\/\/[^"]*"(?![^>]*rel=)[^>]*>/g,
    message: 'External link without rel attribute',
    severity: 'medium',
    fix: 'Add rel="noopener noreferrer" to external links'
  },
  {
    pattern: /<link[^>]*rel="canonical"[^>]*>/g,
    message: 'Canonical link found (good)',
    severity: 'info',
    fix: 'Each page should have a canonical link'
  }
];

// File extensions to check
const fileExtensions = ['tsx', 'jsx', 'js', 'ts', 'html'];

// Find all files to check
const findFiles = () => {
  const files = [];
  
  for (const ext of fileExtensions) {
    const pattern = `**/*.${ext}`;
    const matches = glob.sync(pattern, { 
      cwd: process.cwd(),
      ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**', '**/scripts/**'] 
    });
    files.push(...matches);
  }
  
  return files;
};

// Check a single file for SEO issues
const checkFile = (filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const issues = [];
  
  for (const { pattern, message, severity, fix } of seoPatterns) {
    const matches = content.match(pattern);
    
    if (matches) {
      issues.push({
        file: filePath,
        message,
        severity,
        fix,
        count: matches.length
      });
    }
  }
  
  return issues;
};

// Main function
const checkSeo = async () => {
  console.log('Checking for SEO issues...');
  
  const files = findFiles();
  console.log(`Found ${files.length} files to check`);
  
  let allIssues = [];
  
  for (const file of files) {
    const issues = checkFile(file);
    allIssues = [...allIssues, ...issues];
  }
  
  // Group issues by severity
  const issuesBySeverity = {
    high: allIssues.filter(issue => issue.severity === 'high'),
    medium: allIssues.filter(issue => issue.severity === 'medium'),
    low: allIssues.filter(issue => issue.severity === 'low'),
    info: allIssues.filter(issue => issue.severity === 'info')
  };
  
  // Print summary
  console.log('\n=== SEO Check Summary ===');
  console.log(`High severity issues: ${issuesBySeverity.high.length}`);
  console.log(`Medium severity issues: ${issuesBySeverity.medium.length}`);
  console.log(`Low severity issues: ${issuesBySeverity.low.length}`);
  console.log(`Good practices found: ${issuesBySeverity.info.length}`);
  
  // Print detailed report
  if (allIssues.length > 0) {
    console.log('\n=== Detailed Report ===');
    
    for (const severity of ['high', 'medium', 'low']) {
      const issues = issuesBySeverity[severity];
      
      if (issues.length > 0) {
        console.log(`\n${severity.toUpperCase()} SEVERITY ISSUES:`);
        
        for (const issue of issues) {
          console.log(`- ${issue.file}: ${issue.message} (${issue.count} occurrences)`);
          console.log(`  Fix: ${issue.fix}`);
        }
      }
    }
    
    console.log('\nGOOD PRACTICES:');
    for (const issue of issuesBySeverity.info) {
      console.log(`- ${issue.file}: ${issue.message} (${issue.count} occurrences)`);
    }
    
    console.log('\nTo achieve a perfect Lighthouse SEO score:');
    console.log('1. Fix all high and medium severity issues');
    console.log('2. Review low severity issues and fix where appropriate');
    console.log('3. Implement the following additional optimizations:');
    console.log('   - Ensure all pages have a unique title and meta description');
    console.log('   - Create a comprehensive XML sitemap');
    console.log('   - Implement structured data (JSON-LD) for rich snippets');
    console.log('   - Ensure mobile-friendly design with appropriate viewport settings');
    console.log('   - Optimize URL structure for readability and SEO');
  } else {
    console.log('\nNo SEO issues found! 🎉');
  }
};

// Run the check
checkSeo().catch(err => {
  console.error('Error during SEO check:', err);
  process.exit(1);
});
