const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');
const { cpus } = require('os');
const { promisify } = require('util');

// Number of CPU cores for parallel processing
const NUM_CORES = cpus().length;

// Track stats for reporting
let totalSaved = 0;
let totalProcessed = 0;
let totalSkipped = 0;

// Function to optimize a single image
const optimizeImage = async (imagePath) => {
  try {
    const fullPath = path.join(process.cwd(), imagePath);
    const stats = fs.statSync(fullPath);
    const fileSizeInKb = stats.size / 1024;
    
    // Skip already optimized images (check for .optimized marker file)
    const optimizedMarker = `${fullPath}.optimized`;
    if (fs.existsSync(optimizedMarker)) {
      const markerDate = fs.readFileSync(optimizedMarker, 'utf8');
      const markerTime = new Date(markerDate).getTime();
      const fileTime = stats.mtime.getTime();
      
      if (markerTime > fileTime) {
        console.log(`Skipping already optimized image: ${imagePath}`);
        totalSkipped++;
        return;
      }
    }
    
    console.log(`Optimizing: ${imagePath} (${fileSizeInKb.toFixed(2)} KB)`);
    
    // Get image info
    const image = sharp(fullPath);
    const metadata = await image.metadata();
    
    // Resize large images
    if (metadata.width > 1200) {
      await image
        .resize(1200)
        .toBuffer()
        .then(data => {
          fs.writeFileSync(fullPath, data);
          console.log(`Resized ${imagePath} to max width 1200px`);
        });
    }
    
    // Compress the image based on format
    let compressedBuffer;
    
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      compressedBuffer = await image
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
    } else if (metadata.format === 'png') {
      compressedBuffer = await image
        .png({ compressionLevel: 9, progressive: true })
        .toBuffer();
    } else if (metadata.format === 'webp') {
      compressedBuffer = await image
        .webp({ quality: 80 })
        .toBuffer();
    } else {
      // For other formats, just resize if needed
      compressedBuffer = await image.toBuffer();
    }
    
    // Write the optimized image back to the file
    fs.writeFileSync(fullPath, compressedBuffer);
    
    // Mark as optimized
    fs.writeFileSync(optimizedMarker, new Date().toISOString());
    
    // Log results
    const newStats = fs.statSync(fullPath);
    const newFileSizeInKb = newStats.size / 1024;
    const savings = fileSizeInKb - newFileSizeInKb;
    
    // Update stats
    totalSaved += savings;
    totalProcessed++;
    
    console.log(`Optimized: ${imagePath} (${newFileSizeInKb.toFixed(2)} KB, saved ${savings.toFixed(2)} KB)`);
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
  }
};

// Find and optimize all images
const optimizeImages = async () => {
  const imagePatterns = [
    'public/**/*.{jpg,jpeg,png,webp,gif}',
    'Content/**/*.{jpg,jpeg,png,webp,gif}',
    'app/**/*.{jpg,jpeg,png,webp,gif}'
  ];
  
  const allImages = [];
  
  for (const pattern of imagePatterns) {
    const images = glob.sync(pattern, { cwd: process.cwd() });
    console.log(`Found ${images.length} images matching pattern: ${pattern}`);
    allImages.push(...images);
  }
  
  console.log(`Total images to process: ${allImages.length}`);
  
  // Process images in batches based on CPU cores
  const batchSize = Math.max(1, Math.ceil(allImages.length / NUM_CORES));
  const batches = [];
  
  for (let i = 0; i < allImages.length; i += batchSize) {
    batches.push(allImages.slice(i, i + batchSize));
  }
  
  console.log(`Processing in ${batches.length} batches using ${NUM_CORES} CPU cores`);
  
  // Process batches in parallel
  await Promise.all(
    batches.map(batch => {
      return Promise.all(batch.map(imagePath => optimizeImage(imagePath)));
    })
  );
  
  // Generate WebP versions for all non-WebP images
  console.log('\nGenerating WebP versions for non-WebP images...');
  const nonWebpImages = allImages.filter(img => !img.toLowerCase().endsWith('.webp'));
  
  await Promise.all(
    nonWebpImages.map(async (imagePath) => {
      try {
        const fullPath = path.join(process.cwd(), imagePath);
        const webpPath = `${fullPath.substring(0, fullPath.lastIndexOf('.'))}.webp`;
        
        // Skip if WebP already exists and is newer than original
        if (fs.existsSync(webpPath)) {
          const originalStats = fs.statSync(fullPath);
          const webpStats = fs.statSync(webpPath);
          
          if (webpStats.mtime.getTime() > originalStats.mtime.getTime()) {
            return;
          }
        }
        
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(webpPath);
          
        console.log(`Created WebP version: ${webpPath}`);
      } catch (error) {
        console.error(`Error creating WebP for ${imagePath}:`, error);
      }
    })
  );
  
  console.log('\nImage optimization complete!');
  console.log(`Total images processed: ${totalProcessed}`);
  console.log(`Total images skipped: ${totalSkipped}`);
  console.log(`Total KB saved: ${(totalSaved / 1024).toFixed(2)} MB`);
  console.log('Remember to use <picture> elements with WebP sources for optimal performance.');
};

// Run the optimization
optimizeImages().catch(err => {
  console.error('Error during image optimization:', err);
  process.exit(1);
});
