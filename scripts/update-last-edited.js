#!/usr/bin/env node

/**
 * This script updates the last-edited timestamp for Lily's Lab
 * It can be run manually or integrated into Git hooks or Obsidian workflows
 * 
 * Usage:
 * node scripts/update-last-edited.js [source]
 * 
 * Where [source] is optional and defaults to 'manual'
 * Other possible values: 'github', 'obsidian', etc.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Get the source from command line args or default to 'manual'
const source = process.argv[2] || 'manual';

// Path to the last-updated.json file
const lastUpdatedFile = path.join(__dirname, '..', 'last-updated.json');

// Update the file directly
function updateLocalFile() {
  const data = {
    lastUpdated: new Date().toISOString(),
    source
  };
  
  try {
    fs.writeFileSync(lastUpdatedFile, JSON.stringify(data, null, 2));
    console.log(`✅ Updated last-edited timestamp (${source})`);
  } catch (error) {
    console.error('❌ Error updating last-edited timestamp:', error);
    process.exit(1);
  }
}

// Call the API endpoint (useful when running remotely)
function callUpdateApi() {
  const data = JSON.stringify({
    source
  });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/last-updated',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  const req = https.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ Updated last-edited timestamp via API (${source})`);
    } else {
      console.error(`❌ Failed to update timestamp: HTTP ${res.statusCode}`);
      process.exit(1);
    }
  });
  
  req.on('error', (error) => {
    console.error('❌ Error calling update API:', error);
    process.exit(1);
  });
  
  req.write(data);
  req.end();
}

// Use the direct file update method by default
// You can change this to callUpdateApi() if you prefer using the API
updateLocalFile();
