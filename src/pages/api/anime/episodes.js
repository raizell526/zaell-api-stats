export const prerender = false;

import { getEpisodes } from '../../../lib/scrapers/animein.js';
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
    let id = url.searchParams.get('id');

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      id = body.id || id;
    }

    if (!id) {
      return errorResponse('Parameter "id" wajib diisi');
    }

    const data = await getEpisodes(id);
    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
