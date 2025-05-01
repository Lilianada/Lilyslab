/**
 * Accessibility Checker Script
 * 
 * This script checks for common accessibility issues in the codebase
 * and provides suggestions for improvement.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define patterns to search for
const accessibilityPatterns = [
  {
    pattern: /<img(?!.*alt=["'].*["']).*?>/g,
    message: 'Image without alt attribute',
    severity: 'high',
    fix: 'Add descriptive alt text to images (or empty alt="" for decorative images)'
  },
  {
    pattern: /<a(?!.*aria-label=["'].*["'])(?!.*>(?:(?!\<\/a\>).)+<\/a>).*?>/g,
    message: 'Link may be missing accessible text or aria-label',
    severity: 'medium',
    fix: 'Add descriptive text within the link or an aria-label attribute'
  },
  {
    pattern: /<button(?!.*aria-label=["'].*["'])(?!.*>(?:(?!\<\/button\>).)+<\/button>).*?>/g,
    message: 'Button may be missing accessible text or aria-label',
    severity: 'medium',
    fix: 'Add descriptive text within the button or an aria-label attribute'
  },
  {
    pattern: /className=["'].*?text-\[.*?px\].*?["']/g,
    message: 'Font size defined in pixels may not scale properly',
    severity: 'low',
    fix: 'Use relative units like rem or em instead of px for text sizes'
  },
  {
    pattern: /style=["'].*?font-size:\s*\d+px.*?["']/g,
    message: 'Inline font-size in pixels may not scale properly',
    severity: 'low',
    fix: 'Use relative units like rem or em instead of px for text sizes'
  },
  {
    pattern: /<div(?!.*role=["'].*["']).*?onClick/g,
    message: 'Interactive div without semantic role',
    severity: 'medium',
    fix: 'Add appropriate role attribute or use a semantic element like button'
  },
  {
    pattern: /<div(?!.*role=["'].*["']).*?onKeyDown/g,
    message: 'Interactive div without semantic role',
    severity: 'medium',
    fix: 'Add appropriate role attribute or use a semantic element like button'
  },
  {
    pattern: /tabIndex=["']\d+["']/g,
    message: 'Non-zero tabIndex can create unpredictable tab order',
    severity: 'medium',
    fix: 'Use tabIndex="0" for interactive elements or remove tabIndex'
  },
  {
    pattern: /color:.*?(#[0-9a-f]{3,6}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))/gi,
    message: 'Check color contrast',
    severity: 'info',
    fix: 'Ensure text has sufficient contrast with its background'
  },
  {
    pattern: /aria-hidden=["']true["'](?!.*tabIndex=["']-1["'])/g,
    message: 'aria-hidden element may still be focusable',
    severity: 'medium',
    fix: 'Add tabIndex="-1" to elements with aria-hidden="true"'
  }
];

// File extensions to check
const fileExtensions = ['tsx', 'jsx', 'js', 'ts'];

// Find all files to check
const findFiles = () => {
  const files = [];
  
  for (const ext of fileExtensions) {
    const pattern = `**/*.${ext}`;
    const matches = glob.sync(pattern, { 
      cwd: process.cwd(),
      ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**'] 
    });
    files.push(...matches);
  }
  
  return files;
};

// Check a single file for accessibility issues
const checkFile = (filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const issues = [];
  
  for (const { pattern, message, severity, fix } of accessibilityPatterns) {
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
const checkAccessibility = async () => {
  console.log('Checking for accessibility issues...');
  
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
  console.log('\n=== Accessibility Check Summary ===');
  console.log(`High severity issues: ${issuesBySeverity.high.length}`);
  console.log(`Medium severity issues: ${issuesBySeverity.medium.length}`);
  console.log(`Low severity issues: ${issuesBySeverity.low.length}`);
  console.log(`Informational: ${issuesBySeverity.info.length}`);
  
  // Print detailed report
  if (allIssues.length > 0) {
    console.log('\n=== Detailed Report ===');
    
    for (const severity of ['high', 'medium', 'low', 'info']) {
      const issues = issuesBySeverity[severity];
      
      if (issues.length > 0) {
        console.log(`\n${severity.toUpperCase()} SEVERITY ISSUES:`);
        
        for (const issue of issues) {
          console.log(`- ${issue.file}: ${issue.message} (${issue.count} occurrences)`);
          console.log(`  Fix: ${issue.fix}`);
        }
      }
    }
    
    console.log('\nTo achieve a perfect Lighthouse accessibility score:');
    console.log('1. Fix all high and medium severity issues');
    console.log('2. Review low severity issues and fix where appropriate');
    console.log('3. Manually check color contrast issues');
  } else {
    console.log('\nNo accessibility issues found! 🎉');
  }
};

// Run the check
checkAccessibility().catch(err => {
  console.error('Error during accessibility check:', err);
  process.exit(1);
});
