import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { AudioTrack } from '@/lib/audio/howler-service';

// Define folder paths for different audio types
const TRACKS_FOLDER = 'tracks';
const RECORDS_FOLDER = 'records';

// Helper function to configure Cloudinary
function configureCloudinary() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing required Cloudinary configuration');
  }
  
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  
  return { cloudName, apiKey };
}

// Add this to the top of the file with other imports
import { headers } from 'next/headers';

export async function GET(request: Request) {
  // Get the request URL for logging
  const requestUrl = request.url;
  let host = 'unknown';
  try {
    // In Next.js 13+, headers() returns a Promise in some cases
    // Use the request.headers instead which is more reliable
    const hostHeader = request.headers.get('host');
    if (hostHeader) {
      host = hostHeader;
    }
  } catch (error) {
    // Silently handle error without logging
  }
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    // Configure Cloudinary with proper error handling
    try {
      const { cloudName } = configureCloudinary();
    } catch (configError) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Failed to initialize Cloudinary configuration',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    // Get the isVoiceMemo parameter from the URL
    const { searchParams } = new URL(request.url);
    const isVoiceMemo = searchParams.get('isVoiceMemo') === 'true';
    
    // Determine which folder to search in
    const folder = isVoiceMemo ? RECORDS_FOLDER : TRACKS_FOLDER;
    
    // Add a timestamp parameter to prevent caching
    const timestamp = Date.now();
    
    let result;
    try {
      // Get a list of all resources in the folder with error handling
      result = await cloudinary.api.resources({
        resource_type: 'video', // Cloudinary uses 'video' for audio files
        type: 'upload',
        prefix: folder, // Get resources with this prefix (folder)
        max_results: 100,
        context: true, // Important: This ensures we get the contextual metadata
        metadata: true, // Get structured metadata as well
        tags: true, // Include tags for additional metadata
        image_metadata: true // Include any image metadata
      });
    } catch (error) {
      const apiError = error as Error;
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch audio from Cloudinary',
          details: apiError.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    // Define the expected resource structure
    interface CloudinaryResource {
      public_id: string;
      secure_url: string;
      duration?: number;
      context?: {
        custom?: string | {
          title?: string;
          artist?: string;
          coverImage?: string;
          category?: string;
          isPremium?: string;
        }
      };
      // Additional properties that might contain metadata
      metadata?: Record<string, any>;
      title?: string;
      artist?: string;
      category?: string;
      isPremium?: string;
      [key: string]: any; // Allow indexing with string keys
    }
    
    // Transform Cloudinary resources into AudioTrack format
    const audioTracks: AudioTrack[] = result.resources.map((resource: CloudinaryResource) => {
      // Extract basic info from Cloudinary resource
      const { public_id, secure_url, duration, context } = resource;
      
      // Initialize metadata object
      let extractedMetadata: Record<string, any> = {};
      
      // STEP 1: Extract metadata from context (this is the contextual metadata)
      // This is where Cloudinary stores custom metadata set via the API
      if (context) {
        // The context object might have different formats
        // It could be { custom: { key: value } } or { custom: "key=value|key2=value2" }
        if (context.custom) {
          // If it's a string (pipe-delimited format)
          if (typeof context.custom === 'string') {
            const customStr = context.custom as string;
            const pairs = customStr.split('|');
            
            // Process each key-value pair
            pairs.forEach(pair => {
              // Split by the first equals sign only
              const equalIndex = pair.indexOf('=');
              if (equalIndex > 0) {
                const key = pair.substring(0, equalIndex).trim();
                const value = pair.substring(equalIndex + 1).trim();
                extractedMetadata[key] = value;
              }
            });
          } 
          // If it's already an object
          else if (typeof context.custom === 'object') {
            extractedMetadata = { ...extractedMetadata, ...context.custom };
          }
        }
        
        // Some Cloudinary responses might have direct context properties
        Object.keys(context).forEach(key => {
          if (key !== 'custom' && !['resource_type', 'type'].includes(key)) {
            // Use type assertion to avoid TypeScript error
            extractedMetadata[key] = (context as Record<string, any>)[key];
          }
        });
      }
      
      // STEP 2: Check for structured metadata
      // Cloudinary also supports structured metadata which might be in a different location
      if (resource.metadata) {
        extractedMetadata = { ...extractedMetadata, ...resource.metadata };
      }
      
      // STEP 3: Check for direct properties
      // Sometimes metadata is directly on the resource object
      ['title', 'artist', 'category', 'isPremium'].forEach(key => {
        if (resource[key] !== undefined) {
          extractedMetadata[key] = resource[key];
        }
      });
      
      // STEP 4: Check for tags
      // Tags might contain useful information
      if (resource.tags) {
        // You could parse tags if they contain metadata
      }
      
      // Build the AudioTrack with the extracted metadata
      const fileName = public_id.split('/').pop() || 'Untitled';
      
      // Extract duration from various possible locations in the resource
      // Cloudinary might store duration in different places depending on the upload method
      const resourceDuration = resource.duration || 
                             resource.video?.duration || 
                             resource.audio?.duration || 
                             resource.raw_duration || 
                             extractedMetadata.duration || 
                             0;
      
      const track: AudioTrack = {
        id: public_id,
        title: extractedMetadata.title || fileName,
        artist: extractedMetadata.artist || 'Unknown Artist',
        // Make sure we're getting the duration from the right place
        // Cloudinary stores duration in seconds
        duration: resourceDuration, // Use our comprehensive duration extraction
        url: `${secure_url}?_cb=${Date.now()}`, // Add cache-busting parameter
        coverImage: extractedMetadata.coverImage || null,
        category: extractedMetadata.category || (isVoiceMemo ? 'Voice Memo' : 'Music'),
        isPremium: extractedMetadata.isPremium === 'true',
        isVoiceMemo
      };
      
      return track;
    });
    
    return NextResponse.json(audioTracks);
  } catch (error) {
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
