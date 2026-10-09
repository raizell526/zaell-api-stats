export const prerender = false;

import axios from 'axios';
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
    let fullPage = url.searchParams.get('fullPage') === 'true';

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      targetUrl = body.url || body.link || targetUrl;
      fullPage = body.fullPage !== undefined ? Boolean(body.fullPage) : fullPage;
    }

    if (!targetUrl) {
      return errorResponse('Parameter "url" wajib diisi');
    }

    const ssUrl = `https://image.thum.io/get/width/1280/crop/800/${fullPage ? 'fullpage/' : ''}${targetUrl}`;
    return jsonResponse({ result: { url: ssUrl, targetUrl } });
  } catch (err) {
    return errorResponse(err.message || err, 500);
  }
}
