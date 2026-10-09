import search from '../../src/lib/scrapers/ytsearch.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const query = params.q || params.query;
    if (!query) return sendError(res, 'Parameter "q" wajib diisi');

    const result = await new Promise((resolve, reject) => {
      search(query, (err, r) => {
        if (err) reject(err);
        else resolve(r);
      });
    });
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
