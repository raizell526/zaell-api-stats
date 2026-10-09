import { tiktok } from '../../src/lib/scrapers/tiktok.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const targetUrl = params.url || params.link;
    if (!targetUrl) return sendError(res, 'Parameter "url" wajib diisi');

    const result = await tiktok(targetUrl);
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
