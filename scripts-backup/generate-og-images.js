const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const puppeteer = require('puppeteer');

// Create OG image template HTML
const createOgTemplate = (title, excerpt, date) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 1200px;
        height: 630px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #1a1a1a;
        color: #ffffff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .container {
        width: 90%;
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid #333;
        padding: 40px;
      }
      .title {
        font-size: 64px;
        font-weight: bold;
        margin-bottom: 20px;
        line-height: 1.2;
      }
      .excerpt {
        font-size: 32px;
        color: #aaaaaa;
        margin-bottom: 40px;
        line-height: 1.4;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      .date {
        font-size: 24px;
        color: #888888;
      }
      .logo {
        font-size: 28px;
        font-weight: bold;
        color: #ffffff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div>
        <h1 class="title">${title}</h1>
        <p class="excerpt">${excerpt || 'Lilyslab'}</p>
      </div>
      <div class="footer">
        <div class="date">${date || new Date().toISOString().split('T')[0]}</div>
        <div class="logo">Lilyslab</div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Generate OG image for a single file
const generateOgImage = async (browser, filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    
    const title = data.title || 'Untitled';
    const excerpt = data.excerpt || '';
    const date = data.date || new Date().toISOString().split('T')[0];
    
    // Create output directory if it doesn't exist
    const ogDir = path.join(process.cwd(), 'public/og-images');
    if (!fs.existsSync(ogDir)) {
      fs.mkdirSync(ogDir, { recursive: true });
    }
    
    // Generate filename based on slug or file name
    const slug = data.slug || path.basename(filePath, path.extname(filePath));
    const outputPath = path.join(ogDir, `${slug}.png`);
    
    // Skip if OG image already exists and is newer than content file
    if (fs.existsSync(outputPath)) {
      const ogStats = fs.statSync(outputPath);
      const fileStats = fs.statSync(filePath);
      
      if (ogStats.mtime > fileStats.mtime) {
        console.log(`Skipping existing OG image for ${slug}`);
        return;
      }
    }
    
    // Create HTML template
    const html = createOgTemplate(title, excerpt, date);
    
    // Create a new page
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(html);
    
    // Wait for any fonts to load
    await page.waitForTimeout(500);
    
    // Take screenshot
    await page.screenshot({ path: outputPath });
    console.log(`Generated OG image: ${outputPath}`);
    
    // Close the page
    await page.close();
  } catch (error) {
    console.error(`Error generating OG image for ${filePath}:`, error);
  }
};

// Generate OG images for all content
const generateAllOgImages = async () => {
  const contentPatterns = [
    'Content/writings/*.md',
    'Content/notes/*.md'
  ];
  
  let allFiles = [];
  contentPatterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    files.forEach(file => {
      allFiles.push(path.join(process.cwd(), file));
    });
  });
  
  console.log(`Found ${allFiles.length} content files to process`);
  
  // Launch browser
  const browser = await puppeteer.launch();
  
  // Process each file
  for (const file of allFiles) {
    await generateOgImage(browser, file);
  }
  
  // Close browser
  await browser.close();
  
  console.log('OG image generation complete!');
};

// Run the OG image generation
generateAllOgImages().catch(err => {
  console.error('Error during OG image generation:', err);
  process.exit(1);
});
