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
  const headersList = headers();
  let host = 'unknown';
  try {
    // In Next.js 13+, headers() returns a Promise in some cases
    const hostHeader = headersList.get('host');
    if (hostHeader) {
      host = hostHeader;
    }
  } catch (error) {
    console.warn('Could not get host from headers:', error);
  }
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log(`[${new Date().toISOString()}] Fetching audio from Cloudinary (${isProduction ? 'production' : 'development'})`);
  console.log(`Request URL: ${requestUrl}`);
  console.log(`Host: ${host}`);
  
  try {
    // Configure Cloudinary with proper error handling
    try {
      const { cloudName } = configureCloudinary();
      console.log(`Successfully configured Cloudinary with cloud name: ${cloudName}`);
    } catch (configError) {
      console.error('Failed to configure Cloudinary:', configError);
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
    
    console.log(`Fetching ${isVoiceMemo ? 'voice memos' : 'music tracks'} from folder: ${folder}`);
    
    // Add a timestamp parameter to prevent caching
    const timestamp = Date.now();
    
    // Use the Admin API to get resources with their contextual metadata
    console.log(`[${new Date().toISOString()}] Fetching resources from Cloudinary folder: ${folder}`);
    
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
      
      console.log(`[${new Date().toISOString()}] Successfully retrieved ${result.resources?.length || 0} resources from folder ${folder}`);
    } catch (error) {
      const apiError = error as Error;
      console.error('Cloudinary API Error:', {
        message: apiError.message,
        error: apiError,
        stack: apiError.stack,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch audio from Cloudinary',
          details: apiError.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    // Log the first resource for debugging
    if (result?.resources?.length > 0) {
      try {
        console.log('First resource details:', JSON.stringify({
          public_id: result.resources[0].public_id,
          format: result.resources[0].format,
          duration: result.resources[0].duration,
          bytes: result.resources[0].bytes,
          created_at: result.resources[0].created_at,
          secure_url: result.resources[0].secure_url ? '***URL_REDACTED***' : null,
          context: result.resources[0].context ? '***CONTEXT_PRESENT***' : null,
          metadata: result.resources[0].metadata ? '***METADATA_PRESENT***' : null
        }, null, 2));
      } catch (logError) {
        console.error('Error logging resource details:', logError);
      }
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
