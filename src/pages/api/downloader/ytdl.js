export const prerender = false;

import { ytdl } from '../../../lib/scrapers/ytdl.js';
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
    let targetUrl = url.searchParams.get('url') || url.searchParams.get('link');
    let type = url.searchParams.get('type') || 'audio';

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      targetUrl = body.url || body.link || targetUrl;
      type = body.type || type;
    }

    if (!targetUrl) {
      return errorResponse('Parameter "url" wajib diisi');
    }

    const data = await ytdl(type, targetUrl);
    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
