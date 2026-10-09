import { facebook } from '../../src/lib/scrapers/facebook.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const targetUrl = params.url || params.link;
    if (!targetUrl) return sendError(res, 'Parameter "url" wajib diisi');

    const resData = await facebook(targetUrl);
    if (resData && resData.status === false) {
      return sendError(res, resData.error || 'Gagal mengunduh Facebook media', 400);
    }
    return sendJson(res, { result: resData.result || resData });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
