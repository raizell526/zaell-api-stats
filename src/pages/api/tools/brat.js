export const prerender = false;

import { generateBratImage, generateBratVideo } from '../../../lib/scrapers/brat.js';
import { jsonResponse, errorResponse, optionsResponse } from '../../../lib/api-response.js';

export async function GET({ request }) {
  return handle(request);
}

export async function POST({ request }) {
  return handle(request);
}

export async function OPTIONS() {
  return optionsResponse();
}

async function handle(request) {
  try {
    const url = new URL(request.url);
    let text = url.searchParams.get('text') || url.searchParams.get('q');
    let mode = url.searchParams.get('mode') || 'image';

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      text = body.text || body.q || text;
      mode = body.mode || mode;
    }

    if (!text) {
      return errorResponse('Parameter "text" wajib diisi');
    }

    let data;
    if (mode === 'video' || mode === 'vid') {
      const res = await generateBratVideo(text);
      data = {
        base64: res.buffer ? res.buffer.toString('base64') : null,
        mimeType: 'image/webp'
      };
    } else {
      const res = await generateBratImage(text);
      data = {
        base64: res.buffer ? res.buffer.toString('base64') : null,
        mimeType: 'image/png'
      };
    }

    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
