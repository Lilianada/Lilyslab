import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

// Cache the git date to avoid running the command multiple times
let cachedGitDate: string | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function GET() {
  try {
    // Check if we have a cached date that's still valid
    const now = Date.now();
    if (cachedGitDate && (now - cacheTime < CACHE_DURATION)) {
      return NextResponse.json({
        lastUpdated: cachedGitDate,
        source: 'git-cached'
      });
    }

    // Get the latest commit date using Git
    let gitDate;
    try {
      // Format the date in ISO format
      const gitCommand = 'git log -1 --format=%cI';
      gitDate = execSync(gitCommand, { encoding: 'utf-8' }).trim();
      
      // Update the cache
      cachedGitDate = gitDate;
      cacheTime = now;
      
      console.log(`Got Git last commit date: ${gitDate}`);
    } catch (gitError) {
      console.error('Error getting Git commit date:', gitError);
      // Fallback to current date if Git command fails
      gitDate = new Date().toISOString();
    }
    
    return NextResponse.json({
      lastUpdated: gitDate,
      source: 'git-commit'
    });
  } catch (error) {
    console.error('Error getting last update time:', error);
    return NextResponse.json(
      { error: 'Failed to get last update time' },
      { status: 500 }
    );
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

    // With the Git-based approach, we don't need to update any files
    // We'll just invalidate the cache to force a fresh Git date lookup on next GET
    cachedGitDate = null;
    cacheTime = 0;
    
    // Get the latest Git commit date right now
    let gitDate;
    try {
      const gitCommand = 'git log -1 --format=%cI';
      gitDate = execSync(gitCommand, { encoding: 'utf-8' }).trim();
      console.log(`Refreshed Git last commit date: ${gitDate}`);
    } catch (gitError) {
      console.error('Error getting Git commit date:', gitError);
      gitDate = new Date().toISOString();
    }
    
    return NextResponse.json({
      lastUpdated: gitDate,
      source: body.source,
      refreshed: true
    });
  } catch (error) {
    console.error('Error updating last update time:', error);
    return NextResponse.json(
      { error: 'Failed to update last update time' },
      { status: 500 }
    );
  }
}
