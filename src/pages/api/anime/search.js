export const prerender = false;

import { searchAnime } from '../../../lib/scrapers/animein.js';
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
    let page = parseInt(url.searchParams.get('page') || '0', 10);

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      query = body.q || body.query || query;
      page = body.page !== undefined ? parseInt(body.page, 10) : page;
    }

    if (!query) {
      return errorResponse('Parameter "q" wajib diisi');
    }

    const data = await searchAnime(query, page);
    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
