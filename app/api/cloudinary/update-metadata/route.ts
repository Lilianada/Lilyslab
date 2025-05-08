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
    // Prepare the metadata in the correct format for Cloudinary
    // The format should be: "custom=key1=value1|key2=value2"
    const contextString = `title=${metadata.title}|artist=${metadata.artist}|category=${metadata.category}|isPremium=${metadata.isPremium ? 'true' : 'false'}`;
    
    console.log('Updating metadata with context string:', contextString);
    
    // First attempt: Try updating with the explicit method and context parameter
    const result = await cloudinary.uploader.explicit(publicId, {
      resource_type: 'video', // Cloudinary uses 'video' for audio files
      type: 'upload',
      context: `custom=${contextString}`
    });
    
    // Second attempt: If the first attempt doesn't work, try updating with the update method
    // This is an alternative approach that sometimes works better
    if (!result.context || !result.context.custom) {
      console.log('First update attempt did not set context properly, trying alternative method');
      
      // Create an object with the metadata values
      const contextObj = {
        title: metadata.title,
        artist: metadata.artist,
        category: metadata.category,
        isPremium: metadata.isPremium ? 'true' : 'false'
      };
      
      // Update using the update API
      await cloudinary.api.update(publicId, {
        resource_type: 'video',
        context: { custom: contextObj }
      });
    }
    
    console.log('Cloudinary update result:', JSON.stringify(result, null, 2));
    
    // Verify the update was successful by fetching the resource
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: 'video',
      context: true
    });
    
    console.log('Resource after update:', JSON.stringify(resource, null, 2));
    console.log('Updated context:', JSON.stringify(resource.context, null, 2));
    
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
