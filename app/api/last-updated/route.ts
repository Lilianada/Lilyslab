import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This file will store the last update timestamp
const LAST_UPDATE_FILE = path.join(process.cwd(), 'last-updated.json');

export async function GET() {
  try {
    // Check if the file exists
    if (!fs.existsSync(LAST_UPDATE_FILE)) {
      // If not, create it with current timestamp
      const initialData = {
        lastUpdated: new Date().toISOString(),
        source: 'initial'
      };
      fs.writeFileSync(LAST_UPDATE_FILE, JSON.stringify(initialData, null, 2));
      return NextResponse.json(initialData);
    }

    // Read the last update data
    const data = JSON.parse(fs.readFileSync(LAST_UPDATE_FILE, 'utf8'));
    return NextResponse.json(data);
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

    // Update the last update time
    const updateData = {
      lastUpdated: new Date().toISOString(),
      source: body.source
    };

    fs.writeFileSync(LAST_UPDATE_FILE, JSON.stringify(updateData, null, 2));
    return NextResponse.json(updateData);
  } catch (error) {
    console.error('Error updating last update time:', error);
    return NextResponse.json(
      { error: 'Failed to update last update time' },
      { status: 500 }
    );
  }
}
