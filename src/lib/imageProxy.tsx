// pages/api/images.ts (for Pages Router)
// or app/api/images/route.ts (for App Router)

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const token = searchParams.get('token');
  
  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  try {
    // Base URL for your API
    const baseUrl = 'https://codebolanon.commesr.io/api/';
    
    // Full image URL
    const imageUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;
    
    console.log(`Fetching image from: ${imageUrl}`);
    
    // Make request with token
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    // Return the image with proper content type
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': response.headers['content-type'],
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    // Redirect to default image
    return NextResponse.redirect(new URL('/Image/blank.jpg', request.url));
  }
}