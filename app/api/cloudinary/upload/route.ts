import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

// Log configuration for debugging (remove in production)
console.log('Cloudinary config:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Not set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Not set'
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'tracks';
    
    // Extract metadata from formData
    const title = formData.get('title') as string || '';
    const artist = formData.get('artist') as string || '';
    const category = formData.get('category') as string || '';
    const isPremium = formData.get('isPremium') as string || 'false';
    
    console.log('Received metadata for upload:', { title, artist, category, isPremium });
    
    // Ensure resourceType is one of the valid types for Cloudinary
    const resourceType = formData.get('resourceType') as string;
    // Default to 'auto' if not specified, or use 'video' for audio files and 'image' for images
    const validResourceType = resourceType === 'image' ? 'image' : 
                             resourceType === 'video' ? 'video' : 
                             resourceType === 'raw' ? 'raw' : 'auto';
    const tags = formData.get('tags') as string || '';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64
    const base64Data = buffer.toString('base64');
    const fileType = file.type;
    const dataURI = `data:${fileType};base64,${base64Data}`;
    
    // Prepare context metadata
    // We need to ensure all metadata is stored consistently
    // There are two approaches we can use:
    
    // APPROACH 1: Store everything in the custom field (recommended by Cloudinary)
    const customMetadata: Record<string, string> = {};
    if (title) customMetadata.title = title;
    if (artist) customMetadata.artist = artist;
    if (category) customMetadata.category = category;
    customMetadata.isPremium = isPremium;
    
    // Format the context string properly
    const contextString = Object.entries(customMetadata)
      .map(([key, value]) => `${key}=${value}`)
      .join('|');
    
    const contextMetadata = contextString ? `custom=${contextString}` : '';
    console.log('Setting context metadata:', contextMetadata);
    
    // Upload to Cloudinary with metadata
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder,
          resource_type: validResourceType as 'video' | 'image' | 'raw' | 'auto',
          tags: tags ? tags.split(',') : undefined,
          context: contextMetadata || undefined, // Add context metadata if available
          use_filename: true, // Use the original filename
          unique_filename: true, // Make sure filename is unique
          overwrite: false, // Don't overwrite existing files
          eager_async: false, // Process synchronously to ensure duration is available immediately
          eager: [ // Generate metadata like duration
            { audio_codec: 'none' } // This triggers audio analysis without transcoding
          ],
          notification_url: undefined // Don't wait for notifications
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Upload successful with metadata:', result?.context);
            console.log('Duration from upload:', result?.duration);
            resolve(result);
          }
        }
      );
    });
    
    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
