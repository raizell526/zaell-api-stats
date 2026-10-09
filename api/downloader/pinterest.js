import { pinterest } from '../../src/lib/scrapers/pinterest.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const query = params.q || params.url || params.query;
    if (!query) return sendError(res, 'Parameter "q" atau "url" wajib diisi');

    let result;
    if (/https?:\/\//i.test(query)) {
      result = await pinterest.download(query);
    } else {
      result = await pinterest.search(query);
    }
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
