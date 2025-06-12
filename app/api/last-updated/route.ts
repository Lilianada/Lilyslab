import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache the data to avoid reading the file multiple times
let cachedData: { lastUpdated: string; source: string } | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60000; // 1 minute in milliseconds (short cache for fresh data)

// Fallback to build time if JSON file is not available
const getBuildTime = (): string => {
  // Try to get build time from environment variable
  if (process.env.NEXT_PUBLIC_BUILD_TIME) {
    return process.env.NEXT_PUBLIC_BUILD_TIME;
  }
  
  // Fallback to current time
  return new Date().toISOString();
};

export async function GET() {
  try {
    // Check if we have a cached data that's still valid
    const now = Date.now();
    if (cachedData && (now - cacheTime < CACHE_DURATION)) {
      return NextResponse.json({
        lastUpdated: cachedData.lastUpdated,
        source: cachedData.source
      });
    }

    // Path to the last-updated.json file
    const lastUpdatedPath = path.join(process.cwd(), 'last-updated.json');
    
    // Check if the file exists
    if (fs.existsSync(lastUpdatedPath)) {
      try {
        // Read the file content
        const fileContent = fs.readFileSync(lastUpdatedPath, 'utf-8');
        
        // Parse the JSON (handling potential multiple comments at the start)
        let jsonContent = fileContent;
        while (jsonContent.trim().startsWith('//')) {
          const lines = jsonContent.split('\n');
          lines.shift(); // Remove comment line
          jsonContent = lines.join('\n');
        }
        
        const data = JSON.parse(jsonContent);
        
        // Validate the date format
        if (data.lastUpdated && !isNaN(new Date(data.lastUpdated).getTime())) {
          // Update the cache
          cachedData = {
            lastUpdated: data.lastUpdated,
            source: data.source || 'last-updated.json'
          };
          cacheTime = now;
          
          console.log(`Got last updated date from JSON: ${data.lastUpdated}`);
          
          return NextResponse.json(cachedData);
        }
      } catch (error) {
        console.warn('Error reading or parsing last-updated.json:', error);
      }
    }
    
    // If we reach here, use the build time as fallback
    const fallbackDate = getBuildTime();
    console.log(`Using build time as fallback: ${fallbackDate}`);
    
    return NextResponse.json({
      lastUpdated: fallbackDate,
      source: 'build-time'
    });
  } catch (error) {
    console.error('Unexpected error in last-updated API:', error);
    // Return current time as last resort
    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      source: 'error-fallback'
    }, { status: 200 }); // Still return 200 to prevent UI errors
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.source) {
      return NextResponse.json(
        { error: 'Source is required' },
        { status: 400 }
      );
    }

    // For POST requests, we can directly update the last-updated.json file
    // This is useful for manual updates or webhook-triggered updates
    try {
      // Path to the last-updated.json file
      const lastUpdatedPath = path.join(process.cwd(), 'last-updated.json');
      
      // Create the new data
      const newData = {
        lastUpdated: body.lastUpdated || new Date().toISOString(),
        source: body.source
      };
      
      // Add a file header comment
      const fileContent = `// filepath: ${lastUpdatedPath}\n${JSON.stringify(newData, null, 2)}`;
      
      // Write the file
      fs.writeFileSync(lastUpdatedPath, fileContent);
      
      // Clear cache to force fresh read on next GET
      cachedData = null;
      cacheTime = 0;
      
      console.log(`Updated last-updated.json with source: ${body.source}`);
      
      return NextResponse.json({
        ...newData,
        updated: true
      });
    } catch (error) {
      console.error('Error writing to last-updated.json:', error);
      return NextResponse.json(
        { error: 'Failed to update last-updated.json file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
