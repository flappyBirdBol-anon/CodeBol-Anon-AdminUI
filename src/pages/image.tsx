// pages/api/thumbnails/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the encoded URL from the path parameter
    const { path } = req.query;
    const encodedUrl = Array.isArray(path) ? path.join('/') : path;
    const imageUrl = decodeURIComponent(encodedUrl!);
    
    // Get the authorization token from the request headers or cookies
    const token = req.cookies.adminToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Forward the request to the actual image URL with the token
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Set the appropriate content type
    const contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType || 'image/jpeg');
    
    // Return the image data
    return res.status(200).send(Buffer.from(response.data, 'binary'));
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    return res.status(500).json({ error: 'Failed to fetch thumbnail' });
  }
}