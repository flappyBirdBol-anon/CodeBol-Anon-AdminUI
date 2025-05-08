/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/imageProxy/route.ts
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
    // Set up headers
    const headers: Record<string, string> = {};
    if (token && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Construct the full URL
    const baseUrl = 'https://codebolanon.commesr.io/api/';
    const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;
    
    console.log(`Fetching image from: ${fullUrl}`);
    console.log(`Using token: ${token ? 'Yes' : 'No'}`);
    
    const response = await axios.get(fullUrl, {
      responseType: 'arraybuffer',
      headers: headers
    });
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);
    
    // Create response with the image data
    const contentType = response.headers['content-type'];
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType
      }
    });
  } catch (error: any) {
    console.error('Error fetching image:', error.message);
    
    // For debugging purposes
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
    }
    
    // Redirect to default image
    return NextResponse.redirect(new URL('/Image/blank.jpg', request.url));
  }
}