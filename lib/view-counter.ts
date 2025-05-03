/**
 * View counter service to track unique visitors
 */

// In a production app, this would connect to a real database
// For now, we'll use a simple file-based approach for demonstration
import fs from 'fs';
import path from 'path';
import { cache } from 'react';

interface ViewCountData {
  totalViews: number;
  uniqueIPs: string[];
  lastUpdated: string;
}

const VIEW_COUNT_FILE = path.join(process.cwd(), 'data', 'view-count.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize view count file if it doesn't exist
const initViewCountFile = () => {
  ensureDataDir();
  if (!fs.existsSync(VIEW_COUNT_FILE)) {
    const initialData: ViewCountData = {
      totalViews: 0,
      uniqueIPs: [],
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(VIEW_COUNT_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Get the current view count data
const getViewCountData = (): ViewCountData => {
  initViewCountFile();
  try {
    const data = fs.readFileSync(VIEW_COUNT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading view count data:', error);
    return {
      totalViews: 0,
      uniqueIPs: [],
      lastUpdated: new Date().toISOString(),
    };
  }
};

// Save the view count data
const saveViewCountData = (data: ViewCountData) => {
  try {
    fs.writeFileSync(VIEW_COUNT_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving view count data:', error);
  }
};

// List of IPs to exclude (localhost and your IP)
const EXCLUDED_IPS = [
  '127.0.0.1',
  'localhost',
  '::1',
  // Add your IP address here
  // '123.456.789.012',
];

// Increment view count for a specific IP
export const incrementViewCount = (ip: string): number => {
  // Don't count excluded IPs
  if (EXCLUDED_IPS.includes(ip)) {
    return getViewCountData().totalViews;
  }

  const data = getViewCountData();
  
  // Check if this IP has already been counted
  if (!data.uniqueIPs.includes(ip)) {
    data.totalViews += 1;
    data.uniqueIPs.push(ip);
    data.lastUpdated = new Date().toISOString();
    saveViewCountData(data);
  }
  
  return data.totalViews;
};

// Get the current view count (cached for 5 minutes)
export const getViewCount = cache((): number => {
  const data = getViewCountData();
  return data.totalViews;
});
