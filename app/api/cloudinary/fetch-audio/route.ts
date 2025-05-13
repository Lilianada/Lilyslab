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
    
    // Use the Admin API to get resources with their contextual metadata
    // This is the proper way to fetch resources with complete metadata
    console.log(`Fetching resources from folder: ${folder}`);
    
    // Get a list of all resources in the folder
    const result = await cloudinary.api.resources({
      resource_type: 'video', // Cloudinary uses 'video' for audio files
      type: 'upload',
      prefix: folder, // Get resources with this prefix (folder)
      max_results: 100,
      context: true, // Important: This ensures we get the contextual metadata
      metadata: true // Get structured metadata as well
    });
    
    console.log(`Found ${result.resources.length} resources in folder ${folder}`);
    
    // Log the first resource for debugging
    if (result.resources.length > 0) {
      console.log('First resource details:', JSON.stringify(result.resources[0], null, 2));
      console.log('Context metadata:', JSON.stringify(result.resources[0].context, null, 2));
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
      
      // Log the raw resource for debugging
      console.log(`Processing resource: ${public_id}`);
      
      // Initialize metadata object
      let extractedMetadata: Record<string, any> = {};
      
      // STEP 1: Extract metadata from context (this is the contextual metadata)
      // This is where Cloudinary stores custom metadata set via the API
      if (context) {
        console.log(`Context for ${public_id}:`, JSON.stringify(context, null, 2));
        
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
        console.log(`Structured metadata for ${public_id}:`, JSON.stringify(resource.metadata, null, 2));
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
        console.log(`Tags for ${public_id}:`, resource.tags);
        // You could parse tags if they contain metadata
      }
      
      // Log the extracted metadata
      console.log(`Extracted metadata for ${public_id}:`, extractedMetadata);
      
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
      
      // Log duration information for debugging
      console.log(`Duration info for ${public_id}:`, {
        resourceDuration,
        extractedDuration: extractedMetadata.duration,
        rawDuration: resource.raw_duration,
        videoDuration: resource.video?.duration,
        audioDuration: resource.audio?.duration
      });
      
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
      
      // Log the final track object
      console.log(`Final track object for ${public_id}:`, track);
      
      return track;
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
