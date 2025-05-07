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
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder,
          resource_type: validResourceType as 'video' | 'image' | 'raw' | 'auto',
          tags: tags ? tags.split(',') : undefined,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
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
