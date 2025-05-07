import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to proxy audio requests to Cloudinary
 * This helps bypass Content Security Policy (CSP) restrictions
 * by serving the audio through our own domain
 */
export async function GET(request: NextRequest) {
  try {
    // Get the publicId from the URL
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    
    // Validate publicId
    if (!publicId) {
      return NextResponse.json(
        { error: 'Missing publicId parameter' },
        { status: 400 }
      );
    }
    
    // Construct the Cloudinary URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
    if (!cloudName) {
      return NextResponse.json(
        { error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }
    
    // Create the Cloudinary URL with fl_attachment to force download/streaming
    // Note: We explicitly specify the format as mp3 to ensure proper codec detection
    const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/video/upload/fl_attachment/${publicId}.mp3`;
    
    console.log('Proxying audio from Cloudinary:', cloudinaryUrl);
    
    // Fetch the audio from Cloudinary
    const response = await fetch(cloudinaryUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch audio: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Get the audio data
    const audioData = await response.arrayBuffer();
    
    // Create a new response with the audio data
    const audioResponse = new NextResponse(audioData);
    
    // Set appropriate headers for audio playback
    audioResponse.headers.set('Content-Type', 'audio/mpeg');
    audioResponse.headers.set('Content-Disposition', 'inline; filename="audio.mp3"');
    audioResponse.headers.set('Content-Length', audioData.byteLength.toString());
    audioResponse.headers.set('Accept-Ranges', 'bytes');
    
    return audioResponse;
  } catch (error) {
    console.error('Error proxying audio from Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to proxy audio' },
      { status: 500 }
    );
  }
}
