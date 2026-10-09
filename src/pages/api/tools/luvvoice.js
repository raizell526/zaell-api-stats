export const prerender = false;

import { googleTTS, luvvoice } from '../../../lib/scrapers/luvvoice.js';
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
    let voice = url.searchParams.get('voice') || url.searchParams.get('lang') || 'id';

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      text = body.text || body.q || text;
      voice = body.voice || body.lang || voice;
    }

    if (!text) {
      return errorResponse('Parameter "text" wajib diisi');
    }

    let data;
    try {
      data = await luvvoice(text, voice);
    } catch (_) {
      // Fallback to googleTTS buffer link
      const audioBuf = await googleTTS(text, voice);
      data = {
        audioBuffer: audioBuf.toString('base64'),
        mimeType: 'audio/mpeg',
        engine: 'Google TTS Fallback'
      };
    }

    return jsonResponse({ result: data });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
