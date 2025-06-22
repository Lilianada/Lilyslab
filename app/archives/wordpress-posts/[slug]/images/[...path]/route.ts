import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; path: string[] }> }
) {
  try {
    const { slug, path } = await params;
    
    if (!slug || !path || path.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    // Construct the file path
    const imagePath = join(
      process.cwd(),
      'Content',
      'archives',
      'wordpress-posts',
      slug,
      'images',
      ...path
    );
    
    // Check if file exists
    if (!existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Read the file
    const imageBuffer = await readFile(imagePath);
    
    // Determine content type based on file extension
    const fileName = path[path.length - 1];
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    let contentType = 'application/octet-stream';
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
    }
    
    // Return the image with appropriate headers
    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error) {
    console.error('Error serving WordPress post image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
