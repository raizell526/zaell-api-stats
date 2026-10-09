import { tiktok } from '../src/lib/scrapers/tiktok.js';
import { instagram } from '../src/lib/scrapers/ig.js';
import { facebook } from '../src/lib/scrapers/facebook.js';
import { twitter } from '../src/lib/scrapers/x.js';
import { ytdl } from '../src/lib/scrapers/ytdl.js';
import { pinterest } from '../src/lib/scrapers/pinterest.js';
import search from '../src/lib/scrapers/ytsearch.js';
import e621 from '../src/lib/scrapers/e621.js';
import { searchAnime, getDetail, getEpisodes, getStream } from '../src/lib/scrapers/animein.js';
import { generateNanoBanana } from '../src/lib/scrapers/nanobanana.js';
import { googleTTS, luvvoice } from '../src/lib/scrapers/luvvoice.js';
import { generateBratImage, generateBratVideo } from '../src/lib/scrapers/brat.js';
import { deepseek, gpt4, gemini } from '../src/lib/scrapers/ai-chat.js';
import spotify from '../src/lib/scrapers/spotify.js';
import carbon from '../src/lib/scrapers/carbon.js';
import { getSurah, listSurah } from '../src/lib/scrapers/quran.js';
import getCryptoPrices from '../src/lib/scrapers/crypto.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/^\/api/, '');

  let query = req.query || {};
  let body = {};
  if (req.body) {
    if (typeof req.body === 'string') {
      try { body = JSON.parse(req.body); } catch (_) {}
    } else if (typeof req.body === 'object') {
      body = req.body;
    }
  }
  const params = { ...query, ...body };

  const sendSuccess = (data) => res.status(200).json({ status: true, creator: 'Zaell API', ...data });
  const sendFail = (err, code = 400) => res.status(code).json({ status: false, creator: 'Zaell API', error: typeof err === 'string' ? err : err?.message || 'Error' });

  try {
    switch (pathname) {
      case '/downloader/tiktok': {
        const targetUrl = params.url || params.link;
        if (!targetUrl) return sendFail('Parameter "url" wajib diisi');
        return sendSuccess({ result: await tiktok(targetUrl) });
      }
      case '/downloader/instagram': {
        const targetUrl = params.url || params.link;
        if (!targetUrl) return sendFail('Parameter "url" wajib diisi');
        return sendSuccess({ result: await instagram(targetUrl) });
      }
      case '/downloader/facebook': {
        const targetUrl = params.url || params.link;
        if (!targetUrl) return sendFail('Parameter "url" wajib diisi');
        return sendSuccess({ result: await facebook(targetUrl) });
      }
      case '/downloader/twitter': {
        const targetUrl = params.url || params.link;
        if (!targetUrl) return sendFail('Parameter "url" wajib diisi');
        return sendSuccess({ result: await twitter(targetUrl) });
      }
      case '/downloader/ytdl': {
        const targetUrl = params.url || params.link;
        if (!targetUrl) return sendFail('Parameter "url" wajib diisi');
        return sendSuccess({ result: await ytdl(params.type || 'audio', targetUrl) });
      }
      case '/downloader/pinterest': {
        const q = params.q || params.url;
        if (!q) return sendFail('Parameter "q" atau "url" wajib diisi');
        const result = /https?:\/\//i.test(q) ? await pinterest.download(q) : await pinterest.search(q);
        return sendSuccess({ result });
      }
      case '/downloader/spotify': {
        const q = params.url || params.q;
        if (!q) return sendFail('Parameter "url" atau "q" wajib diisi');
        return sendSuccess({ result: await spotify(q) });
      }
      case '/ai/nanobanana': {
        const prompt = params.prompt || params.q;
        if (!prompt) return sendFail('Parameter "prompt" wajib diisi');
        return sendSuccess({ result: await generateNanoBanana(prompt, params) });
      }
      case '/ai/deepseek': {
        const prompt = params.prompt || params.q;
        if (!prompt) return sendFail('Parameter "prompt" wajib diisi');
        return sendSuccess({ result: await deepseek(prompt) });
      }
      case '/ai/gpt4': {
        const prompt = params.prompt || params.q;
        if (!prompt) return sendFail('Parameter "prompt" wajib diisi');
        return sendSuccess({ result: await gpt4(prompt) });
      }
      case '/ai/gemini': {
        const prompt = params.prompt || params.q;
        if (!prompt) return sendFail('Parameter "prompt" wajib diisi');
        return sendSuccess({ result: await gemini(prompt) });
      }
      case '/tools/luvvoice': {
        const text = params.text || params.q;
        if (!text) return sendFail('Parameter "text" wajib diisi');
        let result;
        try { result = await luvvoice(text, params.voice || params.lang || 'id'); }
        catch (_) {
          const buf = await googleTTS(text, params.voice || params.lang || 'id');
          result = { audioBuffer: buf.toString('base64'), mimeType: 'audio/mpeg' };
        }
        return sendSuccess({ result });
      }
      case '/tools/brat': {
        const text = params.text || params.q;
        if (!text) return sendFail('Parameter "text" wajib diisi');
        const mode = params.mode || 'image';
        const r = mode === 'video' ? await generateBratVideo(text) : await generateBratImage(text);
        return sendSuccess({ result: { base64: r.buffer ? r.buffer.toString('base64') : null, mimeType: mode === 'video' ? 'image/webp' : 'image/png' } });
      }
      case '/tools/carbon': {
        const code = params.code || params.text;
        if (!code) return sendFail('Parameter "code" wajib diisi');
        return sendSuccess({ result: await carbon(code, params.theme, params.language) });
      }
      case '/search/ytsearch': {
        const q = params.q;
        if (!q) return sendFail('Parameter "q" wajib diisi');
        return new Promise((resolve) => {
          search(q, (err, result) => {
            if (err) resolve(sendFail(err, 500));
            else resolve(sendSuccess({ result }));
          });
        });
      }
      case '/search/quran': {
        const surah = params.surah || params.id;
        const result = surah ? await getSurah(parseInt(surah, 10)) : await listSurah();
        return sendSuccess({ result });
      }
      case '/search/crypto': {
        return sendSuccess({ result: await getCryptoPrices() });
      }
      default:
        return sendFail(`Route API "${pathname}" tidak ditemukan.`, 404);
    }
  } catch (err) {
    return sendFail(err.message || err, 500);
  }
}
