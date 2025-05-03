/**
 * YouTube API integration for fetching recently played music
 */
import { cache } from 'react';

interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
}

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
  };
}

interface YouTubeResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
}

// Cache the fetch to avoid unnecessary API calls
export const getRecentlyPlayedMusic = cache(async (limit: number = 1): Promise<YouTubeVideo[]> => {
  // YouTube requires an API key and a playlist ID for "Liked Videos" or a custom playlist
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID; // This could be your "Liked Videos" or a custom playlist
  
  if (!apiKey || !playlistId) {
    console.warn('YouTube API key or playlist ID not found. Please set YOUTUBE_API_KEY and YOUTUBE_PLAYLIST_ID in your environment variables.');
    return [];
  }
  
  try {
    // API endpoint for YouTube Data API v3
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${limit}&playlistId=${playlistId}&key=${apiKey}`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    
    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }
    
    const data: YouTubeResponse = await response.json();
    
    // Transform the response into our YouTubeVideo format
    return data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
});

// Function to get a single YouTube video by ID
export const getYouTubeVideo = cache(async (videoId: string): Promise<YouTubeVideo | null> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('YouTube API key not found');
    return null;
  }
  
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    const video = data.items[0];
    
    return {
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt
    };
  } catch (error) {
    console.error(`Error fetching YouTube video ${videoId}:`, error);
    return null;
  }
});
