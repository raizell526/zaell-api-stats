import { generateBratImage, generateBratVideo } from '../../src/lib/scrapers/brat.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const text = params.text || params.q;
    const mode = params.mode || 'image';
    if (!text) return sendError(res, 'Parameter "text" wajib diisi');

    let result;
    if (mode === 'video' || mode === 'vid') {
      const resData = await generateBratVideo(text);
      result = {
        base64: resData.buffer ? resData.buffer.toString('base64') : null,
        mimeType: 'image/webp'
      };
    } else {
      const resData = await generateBratImage(text);
      result = {
        base64: resData.buffer ? resData.buffer.toString('base64') : null,
        mimeType: 'image/png'
      };
    }
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
