import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function PUT(request: Request) {
  try {
    // Get the publicId and metadata from the request body
    const { publicId, metadata } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }
    
    if (!metadata || typeof metadata !== 'object') {
      return NextResponse.json(
        { error: 'Valid metadata object is required' },
        { status: 400 }
      );
    }
    
    console.log('Updating metadata for:', publicId, metadata);
    
    // Update the metadata in Cloudinary
    const result = await cloudinary.uploader.explicit(publicId, {
      resource_type: 'video', // Cloudinary uses 'video' for audio files
      type: 'upload',
      context: `custom|title=${metadata.title}|artist=${metadata.artist}|category=${metadata.category}|isPremium=${metadata.isPremium ? 'true' : 'false'}`
    });
    
    console.log('Cloudinary update result:', result);
    
    return NextResponse.json({ 
      result: 'ok', 
      publicId,
      metadata: result.context?.custom || {}
    });
  } catch (error) {
    console.error('Error updating metadata in Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to update metadata' },
      { status: 500 }
    );
  }
}
