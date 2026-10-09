import { googleTTS, luvvoice } from '../../src/lib/scrapers/luvvoice.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const text = params.text || params.q;
    const voice = params.voice || params.lang || 'id';
    if (!text) return sendError(res, 'Parameter "text" wajib diisi');

    let result;
    try {
      result = await luvvoice(text, voice);
    } catch (_) {
      const audioBuf = await googleTTS(text, voice);
      result = {
        audioBuffer: audioBuf.toString('base64'),
        mimeType: 'audio/mpeg',
        engine: 'Google TTS Fallback'
      };
    }
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
