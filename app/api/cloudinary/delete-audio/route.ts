import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function DELETE(request: Request) {
  try {
    // Get the publicId from the request body
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the resource from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video', // Cloudinary uses 'video' for audio files
    });
    
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete resource: ${result.result}`);
    }
    
    return NextResponse.json({ result: 'ok', publicId });
  } catch (error) {
    console.error('Error deleting audio from Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to delete audio file' },
      { status: 500 }
    );
  }
}
