export const prerender = false;

import search from '../../../lib/scrapers/ytsearch.js';
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
    let query = url.searchParams.get('q') || url.searchParams.get('query');

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      query = body.q || body.query || query;
    }

    if (!query) {
      return errorResponse('Parameter "q" wajib diisi');
    }

    const res = await new Promise((resolve, reject) => {
      search(query, (err, r) => {
        if (err) reject(err);
        else resolve(r);
      });
    });

    return jsonResponse({ result: res });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
