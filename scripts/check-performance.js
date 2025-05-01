/**
 * Performance Checker Script
 * 
 * This script checks for common performance issues in the codebase
 * and provides suggestions for improvement to achieve a perfect Lighthouse score.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define patterns to search for
const performancePatterns = [
  {
    pattern: /import\s+{[^}]*}\s+from\s+["']@\/components\/ui\/[^"']*["']/g,
    message: 'Potential for component tree-shaking optimization',
    severity: 'medium',
    fix: 'Consider importing individual components directly instead of from barrel files'
  },
  {
    pattern: /<img(?!.*loading=["']lazy["']).*?>/g,
    message: 'Image without lazy loading',
    severity: 'medium',
    fix: 'Add loading="lazy" to images below the fold'
  },
  {
    pattern: /<img(?!.*width=["'].*["']).*?>/g,
    message: 'Image without explicit width',
    severity: 'medium',
    fix: 'Add explicit width and height attributes to images to prevent layout shifts'
  },
  {
    pattern: /<img(?!.*height=["'].*["']).*?>/g,
    message: 'Image without explicit height',
    severity: 'medium',
    fix: 'Add explicit width and height attributes to images to prevent layout shifts'
  },
  {
    pattern: /import\s+{[^}]*}\s+from\s+["']lucide-react["']/g,
    message: 'Potential large icon import',
    severity: 'medium',
    fix: 'Consider using individual imports for icons to reduce bundle size'
  },
  {
    pattern: /className=["'].*?animate-.*?["']/g,
    message: 'Animation that might cause performance issues',
    severity: 'low',
    fix: 'Ensure animations are optimized and consider using will-change for complex animations'
  },
  {
    pattern: /useEffect\(\s*\(\)\s*=>\s*{\s*window\./g,
    message: 'Direct window access in useEffect',
    severity: 'medium',
    fix: 'Add proper cleanup in useEffect to prevent memory leaks'
  },
  {
    pattern: /new\s+Array\([0-9]+\)/g,
    message: 'Large array initialization',
    severity: 'low',
    fix: 'Consider using more efficient data structures or lazy loading for large arrays'
  },
  {
    pattern: /style=["'].*?background-image:\s*url\(.*?\).*?["']/g,
    message: 'Inline background image',
    severity: 'low',
    fix: 'Consider using CSS classes for background images to enable better caching'
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
      ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**', '**/scripts/**'] 
    });
    files.push(...matches);
  }
  
  return files;
};

// Check a single file for performance issues
const checkFile = (filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const issues = [];
  
  for (const { pattern, message, severity, fix } of performancePatterns) {
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
const checkPerformance = async () => {
  console.log('Checking for performance issues...');
  
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
    low: allIssues.filter(issue => issue.severity === 'low')
  };
  
  // Print summary
  console.log('\n=== Performance Check Summary ===');
  console.log(`High severity issues: ${issuesBySeverity.high.length}`);
  console.log(`Medium severity issues: ${issuesBySeverity.medium.length}`);
  console.log(`Low severity issues: ${issuesBySeverity.low.length}`);
  
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
    
    console.log('\nTo achieve a perfect Lighthouse performance score:');
    console.log('1. Fix all high and medium severity issues');
    console.log('2. Review low severity issues and fix where appropriate');
    console.log('3. Consider implementing the following additional optimizations:');
    console.log('   - Use Next.js Image component for automatic optimization');
    console.log('   - Implement proper font loading strategy with font-display: swap');
    console.log('   - Minimize main thread work by optimizing JavaScript execution');
    console.log('   - Implement code splitting for large components');
    console.log('   - Use dynamic imports for components not needed on initial load');
  } else {
    console.log('\nNo performance issues found! 🎉');
  }
};

// Run the check
checkPerformance().catch(err => {
  console.error('Error during performance check:', err);
  process.exit(1);
});
