import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { AudioTrack } from '@/lib/audio/howler-service';

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

// Define folder paths for different audio types
const TRACKS_FOLDER = 'tracks';
const RECORDS_FOLDER = 'records';

export async function GET(request: Request) {
  // Validate Cloudinary configuration
  if (!process.env.NEXT_PUBLIC_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary configuration');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
  try {
    // Get the isVoiceMemo parameter from the URL
    const { searchParams } = new URL(request.url);
    const isVoiceMemo = searchParams.get('isVoiceMemo') === 'true';
    
    // Determine which folder to search in
    const folder = isVoiceMemo ? RECORDS_FOLDER : TRACKS_FOLDER;
    
    // Add a timestamp parameter to prevent caching
    const timestamp = Date.now();
    
    // Search for resources in the specified folder
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .with_field('context')
      .execute();
      
    console.log('Fetched resources with metadata:', JSON.stringify(result.resources[0]?.context, null, 2));
    
    // Define the expected resource structure
    interface CloudinaryResource {
      public_id: string;
      secure_url: string;
      duration?: number;
      context?: {
        custom?: {
          title?: string;
          artist?: string;
          coverImage?: string;
          category?: string;
          isPremium?: string;
        }
      };
    }
    
    // Transform Cloudinary resources into AudioTrack format
    const audioTracks: AudioTrack[] = result.resources.map((resource: CloudinaryResource) => {
      // Extract metadata from Cloudinary resource
      const { public_id, secure_url, duration, context } = resource;
      
      // Get metadata from context if available, or use defaults
      const metadata = context?.custom || {};
      
      // Log the metadata for debugging
      console.log(`Processing track ${public_id} with metadata:`, metadata);
      
      // Parse the metadata values correctly
      // The context.custom object contains the metadata as a string in format "key=value"
      let parsedMetadata: Record<string, string> = {};
      
      // If context.custom is a string, parse it
      if (typeof metadata === 'string') {
        const pairs = (metadata as string).split('|');
        pairs.forEach((pair: string) => {
          const [key, value] = pair.split('=');
          if (key && value) {
            parsedMetadata[key.trim()] = value.trim();
          }
        });
      } 
      // If it's already an object, use it directly
      else if (metadata && typeof metadata === 'object') {
        parsedMetadata = metadata as Record<string, string>;
      }
      
      return {
        id: public_id,
        title: parsedMetadata.title || metadata.title || public_id.split('/').pop() || 'Untitled',
        artist: parsedMetadata.artist || metadata.artist || 'Unknown Artist',
        duration: duration || 0,
        url: `${secure_url}?_cb=${Date.now()}`, // Add cache-busting parameter
        coverImage: parsedMetadata.coverImage || metadata.coverImage || null,
        category: parsedMetadata.category || metadata.category || (isVoiceMemo ? 'Voice Memo' : 'Music'),
        isPremium: parsedMetadata.isPremium === 'true' || metadata.isPremium === 'true',
        isVoiceMemo,
      };
    });
    
    // Log the first track for debugging
    if (audioTracks.length > 0) {
      console.log('First processed track:', audioTracks[0]);
    }
    
    return NextResponse.json(audioTracks);
  } catch (error) {
    console.error('Error fetching audio from Cloudinary:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to fetch audio files';
    let statusCode = 500;
    
    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Unable to connect to Cloudinary. Please check your internet connection and try again.';
        statusCode = 503; // Service Unavailable
      }
      // Authentication errors
      else if (error.message.includes('authentication') || error.message.includes('credentials')) {
        errorMessage = 'Authentication failed with Cloudinary. Please check your API credentials.';
        statusCode = 401; // Unauthorized
      }
      // Rate limiting
      else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
        statusCode = 429; // Too Many Requests
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
