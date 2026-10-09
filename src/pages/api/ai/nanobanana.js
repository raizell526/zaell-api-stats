export const prerender = false;

import { generateNanoBanana } from '../../../lib/scrapers/nanobanana.js';
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
    let aspectRatio = url.searchParams.get('aspectRatio') || url.searchParams.get('ratio') || '1:1';
    let resolution = url.searchParams.get('resolution') || url.searchParams.get('res') || '1K';
    let image = url.searchParams.get('image');

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      prompt = body.prompt || body.q || prompt;
      aspectRatio = body.aspectRatio || body.ratio || aspectRatio;
      resolution = body.resolution || body.res || resolution;
      image = body.image || image;
    }

    if (!prompt) {
      return errorResponse('Parameter "prompt" wajib diisi');
    }

    const data = await generateNanoBanana(prompt, {
      image,
      aspectRatio,
      resolution,
    });

    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
