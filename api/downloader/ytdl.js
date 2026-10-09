import { ytdl } from '../../src/lib/scrapers/ytdl.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const targetUrl = params.url || params.link;
    const type = params.type || 'audio';
    if (!targetUrl) return sendError(res, 'Parameter "url" wajib diisi');

    const result = await ytdl(type, targetUrl);
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
