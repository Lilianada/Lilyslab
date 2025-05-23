import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Cache the git date to avoid running the command multiple times
let cachedGitDate: string | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Fallback to build time if git is not available
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
    // Check if we have a cached date that's still valid
    const now = Date.now();
    if (cachedGitDate && (now - cacheTime < CACHE_DURATION)) {
      return NextResponse.json({
        lastUpdated: cachedGitDate,
        source: 'cached'
      });
    }

    // Try to get the date from git
    let gitDate: string | null = null;
    let source = 'fallback';
    
    try {
      // First try to get the latest commit date using Git
      try {
        const gitCommand = 'git log -1 --format=%cI';
        gitDate = execSync(gitCommand, { 
          encoding: 'utf-8',
          // Use a short timeout to prevent hanging
          timeout: 1000,
          // Set a default cwd in case process.cwd() doesn't work
          cwd: process.cwd() || __dirname
        }).trim();
        
        // Validate the date format
        if (gitDate && !isNaN(new Date(gitDate).getTime())) {
          source = 'git-commit';
          console.log(`Got Git last commit date: ${gitDate}`);
        } else {
          gitDate = null;
          console.warn('Invalid date format from git log');
        }
      } catch (gitError) {
        console.warn('Error getting Git commit date:', gitError);
        gitDate = null;
      }
      
      // If git date is not available, try to get it from the .git directory
      if (!gitDate) {
        try {
          const gitDir = path.join(process.cwd(), '.git');
          const headPath = path.join(gitDir, 'FETCH_HEAD');
          
          if (fs.existsSync(headPath)) {
            const stats = fs.statSync(headPath);
            gitDate = stats.mtime.toISOString();
            source = 'git-fetch-head';
            console.log(`Got date from .git/FETCH_HEAD: ${gitDate}`);
          }
        } catch (fsError) {
          console.warn('Error reading .git directory:', fsError);
        }
      }
      
      // If still no date, fall back to build time
      if (!gitDate) {
        gitDate = getBuildTime();
        console.log(`Using build time as fallback: ${gitDate}`);
      }
      
      // Update the cache
      cachedGitDate = gitDate;
      cacheTime = now;
      
      return NextResponse.json({
        lastUpdated: gitDate,
        source
      });
      
    } catch (error) {
      console.error('Error in last-updated API:', error);
      // Return build time as final fallback
      const fallbackDate = getBuildTime();
      return NextResponse.json({
        lastUpdated: fallbackDate,
        source: 'fallback'
      });
    }
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
