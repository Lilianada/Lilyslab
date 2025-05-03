import { NextRequest, NextResponse } from 'next/server';
import { incrementViewCount, getViewCount } from '@/lib/view-counter';

export async function GET(request: NextRequest) {
  try {
    // Get the visitor's IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    // Increment the view count for this IP
    const viewCount = incrementViewCount(ip.split(',')[0].trim());
    
    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error('Error handling view count:', error);
    return NextResponse.json({ error: 'Failed to process view count' }, { status: 500 });
  }
}
