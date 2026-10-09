export const prerender = false;

import upload from '../../../lib/scrapers/upload.js';
import { jsonResponse, errorResponse, optionsResponse } from '../../../lib/api-response.js';

export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') || formData.get('media');
      if (!file) {
        return errorResponse('Berkas "file" tidak ditemukan dalam form-data');
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await upload(buffer, file.name || 'file.png');
      return jsonResponse({ result: { url } });
    }

    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      if (body.base64) {
        const buffer = Buffer.from(body.base64, 'base64');
        const url = await upload(buffer, body.filename || 'file.png');
        return jsonResponse({ result: { url } });
      }
      if (body.url) {
        return jsonResponse({ result: { url: body.url } });
      }
    }

    return errorResponse('Content-Type harus multipart/form-data atau application/json (base64)');
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
