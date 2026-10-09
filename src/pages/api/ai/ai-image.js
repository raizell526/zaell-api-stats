export const prerender = false;

import { generateImage } from '../../../lib/scrapers/ai-image.js';
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
    let prompt = url.searchParams.get('prompt') || url.searchParams.get('q');
    let width = parseInt(url.searchParams.get('width') || '1024', 10);
    let height = parseInt(url.searchParams.get('height') || '1024', 10);

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      prompt = body.prompt || body.q || prompt;
      width = body.width ? parseInt(body.width, 10) : width;
      height = body.height ? parseInt(body.height, 10) : height;
    }

    if (!prompt) {
      return errorResponse('Parameter "prompt" wajib diisi');
    }

    const data = await generateImage(prompt, { width, height });
    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
