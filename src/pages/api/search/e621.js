export const prerender = false;

import e621 from '../../../lib/scrapers/e621.js';
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
    let query = url.searchParams.get('q') || url.searchParams.get('query') || 'order:score';

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      query = body.q || body.query || query;
    }

    const data = await e621.search(query);
    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
