/**
 * Script to create favicon files from logo.png
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceLogoPath = path.join(process.cwd(), 'public', 'logo.png');
const outputDir = path.join(process.cwd(), 'public');

// Favicon sizes
const sizes = [16, 32, 48, 64, 128, 192, 512];

async function createFavicons() {
  console.log('Creating favicon files from logo.png...');
  
  try {
    // Check if source file exists
    if (!fs.existsSync(sourceLogoPath)) {
      console.error('Source logo file not found:', sourceLogoPath);
      return;
    }
    
    // Create favicon.ico (multi-size ICO file)
    await sharp(sourceLogoPath)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.ico'));
    
    console.log('Created favicon.ico');
    
    // Create PNG favicons in various sizes
    for (const size of sizes) {
      await sharp(sourceLogoPath)
        .resize(size, size)
        .toFile(path.join(outputDir, `favicon-${size}x${size}.png`));
      
      console.log(`Created favicon-${size}x${size}.png`);
    }
    
    // Create apple-touch-icon.png
    await sharp(sourceLogoPath)
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    
    console.log('Created apple-touch-icon.png');
    
    // Create android-icon files
    const androidSizes = [36, 48, 72, 96, 144, 192];
    for (const size of androidSizes) {
      await sharp(sourceLogoPath)
        .resize(size, size)
        .toFile(path.join(outputDir, `android-icon-${size}x${size}.png`));
      
      console.log(`Created android-icon-${size}x${size}.png`);
    }
    
    console.log('All favicon files created successfully!');
  } catch (error) {
    console.error('Error creating favicon files:', error);
  }
}

createFavicons().catch(console.error);
