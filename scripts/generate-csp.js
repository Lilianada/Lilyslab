/**
 * Content Security Policy Generator
 * 
 * This script generates a Content Security Policy (CSP) for the website
 * to improve security and best practices scores in Lighthouse.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Find all JavaScript files
const findJsFiles = () => {
  return glob.sync('**/*.{js,jsx,ts,tsx}', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**', '**/scripts/**']
  });
};

// Find all CSS files
const findCssFiles = () => {
  return glob.sync('**/*.css', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**']
  });
};

// Find all image files
const findImageFiles = () => {
  return glob.sync('**/*.{png,jpg,jpeg,gif,svg,webp,avif}', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**']
  });
};

// Find all font files
const findFontFiles = () => {
  return glob.sync('**/*.{woff,woff2,ttf,otf,eot}', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**']
  });
};

// Extract domains from JavaScript files
const extractDomains = async (files) => {
  const domains = new Set();
  
  for (const file of files) {
    try {
      const content = await readFile(path.join(process.cwd(), file), 'utf-8');
      
      // Extract URLs
      const urlRegex = /https?:\/\/([^/\s"']+)/g;
      let match;
      
      while ((match = urlRegex.exec(content)) !== null) {
        const domain = match[1];
        if (!domain.includes('localhost') && !domain.includes('127.0.0.1')) {
          domains.add(domain);
        }
      }
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  }
  
  return Array.from(domains);
};

// Generate CSP
const generateCsp = async () => {
  console.log('Finding files...');
  const jsFiles = findJsFiles();
  const cssFiles = findCssFiles();
  const imageFiles = findImageFiles();
  const fontFiles = findFontFiles();
  
  console.log(`Found ${jsFiles.length} JS files, ${cssFiles.length} CSS files, ${imageFiles.length} image files, and ${fontFiles.length} font files`);
  
  console.log('Extracting domains...');
  const domains = await extractDomains([...jsFiles, ...cssFiles]);
  
  console.log(`Found ${domains.length} external domains`);
  
  // Build CSP
  const csp = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:"],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'"],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", "blob:"],
    'manifest-src': ["'self'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'upgrade-insecure-requests': []
  };
  
  // Add domains to appropriate directives
  for (const domain of domains) {
    if (domain.includes('fonts.googleapis.com') || domain.includes('fonts.gstatic.com')) {
      csp['font-src'].push(`https://${domain}`);
      csp['style-src'].push(`https://${domain}`);
    } else if (domain.includes('cdn') || domain.includes('jsdelivr') || domain.includes('unpkg')) {
      csp['script-src'].push(`https://${domain}`);
      csp['style-src'].push(`https://${domain}`);
    } else if (domain.includes('googleusercontent') || domain.includes('unsplash') || domain.includes('imgur')) {
      csp['img-src'].push(`https://${domain}`);
    } else if (domain.includes('googleapis.com') || domain.includes('api.')) {
      csp['connect-src'].push(`https://${domain}`);
    } else if (domain.includes('youtube') || domain.includes('vimeo')) {
      csp['frame-src'].push(`https://${domain}`);
      csp['media-src'].push(`https://${domain}`);
    } else {
      csp['connect-src'].push(`https://${domain}`);
    }
  }
  
  // Format CSP string
  const cspString = Object.entries(csp)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
  
  // Generate meta tag
  const metaTag = `<meta http-equiv="Content-Security-Policy" content="${cspString}">`;
  
  // Generate Next.js config
  const nextJsConfig = `
// Add this to your next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "${cspString.replace(/"/g, '\\"')}",
          },
        ],
      },
    ];
  },
};
`;
  
  // Write to files
  await writeFile(path.join(process.cwd(), 'csp-meta-tag.txt'), metaTag);
  await writeFile(path.join(process.cwd(), 'csp-next-config.txt'), nextJsConfig);
  
  console.log('\n=== Content Security Policy Generated ===');
  console.log('CSP meta tag saved to csp-meta-tag.txt');
  console.log('Next.js configuration saved to csp-next-config.txt');
  
  console.log('\nTo implement the CSP:');
  console.log('1. Add the meta tag to your <head> section in app/layout.tsx');
  console.log('2. Or update your next.config.js with the generated configuration');
  console.log('3. Test your CSP with the CSP Evaluator: https://csp-evaluator.withgoogle.com/');
  
  console.log('\nAdditional security tips for perfect Lighthouse scores:');
  console.log('1. Ensure all resources are served over HTTPS');
  console.log('2. Add rel="noopener" to external links');
  console.log('3. Implement Subresource Integrity (SRI) for external scripts and stylesheets');
  console.log('4. Add X-Content-Type-Options: nosniff header');
  console.log('5. Add X-Frame-Options: DENY header to prevent clickjacking');
};

// Run the generator
generateCsp().catch(err => {
  console.error('Error generating CSP:', err);
  process.exit(1);
});
