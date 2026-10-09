import { generateNanoBanana } from '../../src/lib/scrapers/nanobanana.js';
import { sendJson, sendError, parseParams } from '../_helper.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const params = parseParams(req);
    const prompt = params.prompt || params.q;
    if (!prompt) return sendError(res, 'Parameter "prompt" wajib diisi');

    const result = await generateNanoBanana(prompt, {
      image: params.image,
      aspectRatio: params.aspectRatio || params.ratio || '1:1',
      resolution: params.resolution || params.res || '1K',
    });
    return sendJson(res, { result });
  } catch (err) {
    return sendError(res, err.message || err, 500);
  }
}
