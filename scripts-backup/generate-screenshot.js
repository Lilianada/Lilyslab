const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateScreenshot() {
  console.log('Generating screenshot for PWA manifest...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to your local development server
    // Change this URL if your development server runs on a different port
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
    });
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('main', { timeout: 5000 });
    
    // Take a screenshot
    const screenshotPath = path.join(process.cwd(), 'public', 'screenshot1.jpg');
    await page.screenshot({
      path: screenshotPath,
      type: 'jpeg',
      quality: 80,
    });
    
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Error generating screenshot:', error);
  } finally {
    await browser.close();
  }
}

generateScreenshot().catch(console.error);
