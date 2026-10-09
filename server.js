import express from 'express';
import cors from 'cors';
import { tiktok } from './src/lib/scrapers/tiktok.js';
import { instagram } from './src/lib/scrapers/ig.js';
import { facebook } from './src/lib/scrapers/facebook.js';
import { twitter } from './src/lib/scrapers/x.js';
import { ytdl } from './src/lib/scrapers/ytdl.js';
import { pinterest } from './src/lib/scrapers/pinterest.js';
import search from './src/lib/scrapers/ytsearch.js';
import e621 from './src/lib/scrapers/e621.js';
import { searchAnime, getDetail, getEpisodes, getStream } from './src/lib/scrapers/animein.js';
import { generateNanoBanana } from './src/lib/scrapers/nanobanana.js';
import { googleTTS, luvvoice } from './src/lib/scrapers/luvvoice.js';
import { generateBratImage, generateBratVideo } from './src/lib/scrapers/brat.js';
import { deepseek, gpt4, gemini } from './src/lib/scrapers/ai-chat.js';
import spotify from './src/lib/scrapers/spotify.js';
import carbon from './src/lib/scrapers/carbon.js';
import { getSurah, listSurah } from './src/lib/scrapers/quran.js';
import getCryptoPrices from './src/lib/scrapers/crypto.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const reply = (res, data, status = 200) => res.status(status).json({ status: true, creator: 'Zaell API', ...data });
const replyErr = (res, err, status = 400) => res.status(status).json({ status: false, creator: 'Zaell API', error: typeof err === 'string' ? err : err?.message || 'Error' });

app.use(express.static('dist'));

// Endpoints Downloader
app.all('/api/downloader/tiktok', async (req, res) => {
  try {
    const url = req.query.url || req.body?.url;
    if (!url) return replyErr(res, 'Parameter "url" wajib diisi');
    const result = await tiktok(url);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/downloader/instagram', async (req, res) => {
  try {
    const url = req.query.url || req.body?.url;
    if (!url) return replyErr(res, 'Parameter "url" wajib diisi');
    const result = await instagram(url);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/downloader/facebook', async (req, res) => {
  try {
    const url = req.query.url || req.body?.url;
    if (!url) return replyErr(res, 'Parameter "url" wajib diisi');
    const result = await facebook(url);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/downloader/twitter', async (req, res) => {
  try {
    const url = req.query.url || req.body?.url;
    if (!url) return replyErr(res, 'Parameter "url" wajib diisi');
    const result = await twitter(url);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/downloader/ytdl', async (req, res) => {
  try {
    const url = req.query.url || req.body?.url;
    const type = req.query.type || req.body?.type || 'audio';
    if (!url) return replyErr(res, 'Parameter "url" wajib diisi');
    const result = await ytdl(type, url);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/downloader/pinterest', async (req, res) => {
  try {
    const query = req.query.q || req.query.url || req.body?.q || req.body?.url;
    if (!query) return replyErr(res, 'Parameter "q" atau "url" wajib diisi');
    let result = /https?:\/\//i.test(query) ? await pinterest.download(query) : await pinterest.search(query);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/downloader/spotify', async (req, res) => {
  try {
    const query = req.query.url || req.query.q || req.body?.url || req.body?.q;
    if (!query) return replyErr(res, 'Parameter "url" atau "q" wajib diisi');
    const result = await spotify(query);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

// Endpoints AI
app.all('/api/ai/nanobanana', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.body?.prompt;
    if (!prompt) return replyErr(res, 'Parameter "prompt" wajib diisi');
    const result = await generateNanoBanana(prompt, req.body || req.query);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/ai/deepseek', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.query.q || req.body?.prompt || req.body?.q;
    if (!prompt) return replyErr(res, 'Parameter "prompt" wajib diisi');
    const result = await deepseek(prompt);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/ai/gpt4', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.query.q || req.body?.prompt || req.body?.q;
    if (!prompt) return replyErr(res, 'Parameter "prompt" wajib diisi');
    const result = await gpt4(prompt);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/ai/gemini', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.query.q || req.body?.prompt || req.body?.q;
    if (!prompt) return replyErr(res, 'Parameter "prompt" wajib diisi');
    const result = await gemini(prompt);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

// Endpoints Tools
app.all('/api/tools/luvvoice', async (req, res) => {
  try {
    const text = req.query.text || req.body?.text;
    const voice = req.query.voice || req.body?.voice || 'id';
    if (!text) return replyErr(res, 'Parameter "text" wajib diisi');
    let result;
    try { result = await luvvoice(text, voice); }
    catch (_) {
      const buf = await googleTTS(text, voice);
      result = { audioBuffer: buf.toString('base64'), mimeType: 'audio/mpeg' };
    }
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/tools/brat', async (req, res) => {
  try {
    const text = req.query.text || req.body?.text;
    const mode = req.query.mode || req.body?.mode || 'image';
    if (!text) return replyErr(res, 'Parameter "text" wajib diisi');
    const r = mode === 'video' ? await generateBratVideo(text) : await generateBratImage(text);
    return reply(res, { result: { base64: r.buffer ? r.buffer.toString('base64') : null } });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/tools/carbon', async (req, res) => {
  try {
    const code = req.query.code || req.body?.code || req.query.text || req.body?.text;
    if (!code) return replyErr(res, 'Parameter "code" wajib diisi');
    const result = await carbon(code, req.query.theme, req.query.language);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

// Endpoints Search
app.all('/api/search/ytsearch', async (req, res) => {
  try {
    const q = req.query.q || req.body?.q;
    if (!q) return replyErr(res, 'Parameter "q" wajib diisi');
    search(q, (err, result) => {
      if (err) return replyErr(res, err, 500);
      return reply(res, { result });
    });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/search/quran', async (req, res) => {
  try {
    const surah = req.query.surah || req.query.id || req.body?.surah;
    const result = surah ? await getSurah(parseInt(surah, 10)) : await listSurah();
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.all('/api/search/crypto', async (req, res) => {
  try {
    const result = await getCryptoPrices();
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Zaell REST API running on http://0.0.0.0:${PORT}`);
});
