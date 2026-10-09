import { searchAnime } from '../../src/lib/scrapers/animein.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const query = params.q || params.query;
    const page = params.page ? parseInt(params.page, 10) : 0;
    if (!query) return sendError(res, 'Parameter "q" wajib diisi');

    const result = await searchAnime(query, page);
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
