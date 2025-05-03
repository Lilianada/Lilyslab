/**
 * Instagram API integration for fetching photos
 */
import { cache } from 'react';

interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

interface InstagramResponse {
  data: InstagramMedia[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

// Cache the fetch to avoid unnecessary API calls
export const getInstagramFeed = cache(async (limit: number = 12): Promise<InstagramMedia[]> => {
  // Instagram requires an access token
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('Instagram access token not found. Please set INSTAGRAM_ACCESS_TOKEN in your environment variables.');
    return [];
  }
  
  try {
    // API endpoint for Instagram Basic Display API
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${accessToken}&limit=${limit}`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    
    if (!response.ok) {
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    const data: InstagramResponse = await response.json();
    
    // Filter to only include photos and videos
    return data.data.filter(item => 
      item.media_type === 'IMAGE' || 
      item.media_type === 'CAROUSEL_ALBUM' || 
      item.media_type === 'VIDEO'
    );
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return [];
  }
});

// Function to get a single Instagram post by ID
export const getInstagramPost = cache(async (mediaId: string): Promise<InstagramMedia | null> => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('Instagram access token not found');
    return null;
  }
  
  try {
    const url = `https://graph.instagram.com/${mediaId}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${accessToken}`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Instagram post ${mediaId}:`, error);
    return null;
  }
});
