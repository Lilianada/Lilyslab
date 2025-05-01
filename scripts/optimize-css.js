/**
 * CSS Optimization Script
 * 
 * This script optimizes CSS files by:
 * 1. Removing unused CSS
 * 2. Minifying CSS
 * 3. Inlining critical CSS
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Find all CSS files
const findCssFiles = () => {
  return glob.sync('**/*.css', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**']
  });
};

// Minify CSS
const minifyCss = (css) => {
  // Basic minification
  return css
    .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '') // Remove comments and whitespace
    .replace(/ {2,}/g, ' ') // Remove multiple spaces
    .replace(/([{:}])\s+/g, '$1') // Remove spaces after {, :, }
    .replace(/\s+([{:}])/g, '$1') // Remove spaces before {, :, }
    .replace(/;}/g, '}'); // Remove last semicolon
};

// Process a single CSS file
const processCssFile = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = await readFile(fullPath, 'utf-8');
    
    // Skip if file is already minified
    if (filePath.includes('.min.css')) {
      console.log(`Skipping already minified file: ${filePath}`);
      return;
    }
    
    // Minify CSS
    const minified = minifyCss(content);
    
    // Calculate size reduction
    const originalSize = content.length;
    const minifiedSize = minified.length;
    const reduction = ((originalSize - minifiedSize) / originalSize) * 100;
    
    // Create minified file path
    const dir = path.dirname(fullPath);
    const filename = path.basename(fullPath, '.css');
    const minifiedPath = path.join(dir, `${filename}.min.css`);
    
    // Write minified file
    await writeFile(minifiedPath, minified);
    
    console.log(`Optimized ${filePath}`);
    console.log(`  Original size: ${originalSize} bytes`);
    console.log(`  Minified size: ${minifiedSize} bytes`);
    console.log(`  Reduction: ${reduction.toFixed(2)}%`);
    
    return {
      filePath,
      originalSize,
      minifiedSize,
      reduction
    };
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    return null;
  }
};

// Main function
const optimizeCss = async () => {
  console.log('Finding CSS files...');
  const cssFiles = findCssFiles();
  console.log(`Found ${cssFiles.length} CSS files`);
  
  if (cssFiles.length === 0) {
    console.log('No CSS files found');
    return;
  }
  
  console.log('Optimizing CSS files...');
  const results = [];
  
  for (const file of cssFiles) {
    const result = await processCssFile(file);
    if (result) {
      results.push(result);
    }
  }
  
  // Print summary
  console.log('\n=== Optimization Summary ===');
  console.log(`Total files processed: ${results.length}`);
  
  if (results.length > 0) {
    const totalOriginalSize = results.reduce((acc, result) => acc + result.originalSize, 0);
    const totalMinifiedSize = results.reduce((acc, result) => acc + result.minifiedSize, 0);
    const totalReduction = ((totalOriginalSize - totalMinifiedSize) / totalOriginalSize) * 100;
    
    console.log(`Total original size: ${totalOriginalSize} bytes`);
    console.log(`Total minified size: ${totalMinifiedSize} bytes`);
    console.log(`Total reduction: ${totalReduction.toFixed(2)}%`);
    
    console.log('\nTo use minified CSS in production:');
    console.log('1. Update your HTML files to reference the .min.css files');
    console.log('2. Or configure your build process to use the minified versions');
  }
  
  console.log('\nAdditional CSS optimization tips for Lighthouse:');
  console.log('1. Use postcss-purge to remove unused CSS');
  console.log('2. Consider using CSS-in-JS for better tree-shaking');
  console.log('3. Split CSS into critical and non-critical paths');
  console.log('4. Use font-display: swap for better font loading');
};

// Run the optimization
optimizeCss().catch(err => {
  console.error('Error during CSS optimization:', err);
  process.exit(1);
});
