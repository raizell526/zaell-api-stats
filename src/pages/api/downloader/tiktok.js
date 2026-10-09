export const prerender = false;

import { tiktok } from '../../../lib/scrapers/tiktok.js';
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

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      targetUrl = body.url || body.link || targetUrl;
    }

    if (!targetUrl) {
      return errorResponse('Parameter "url" wajib diisi');
    }

    const data = await tiktok(targetUrl);
    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
