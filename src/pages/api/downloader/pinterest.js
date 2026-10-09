export const prerender = false;

import { pinterest } from '../../../lib/scrapers/pinterest.js';
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
    let query = url.searchParams.get('q') || url.searchParams.get('url') || url.searchParams.get('query');

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      query = body.q || body.url || body.query || query;
    }

    if (!query) {
      return errorResponse('Parameter "q" atau "url" wajib diisi');
    }

    let data;
    if (/https?:\/\//i.test(query)) {
      data = await pinterest.download(query);
    } else {
      data = await pinterest.search(query);
    }

    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
