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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const reply = (res, data, status = 200) => res.status(status).json({ status: true, creator: 'Zaell API', ...data });
const replyErr = (res, err, status = 400) => res.status(status).json({ status: false, creator: 'Zaell API', error: typeof err === 'string' ? err : err?.message || 'Error' });

// Serve static frontend build if dist exists
app.use(express.static('dist'));

// Endpoints
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

app.all('/api/ai/nanobanana', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.body?.prompt;
    if (!prompt) return replyErr(res, 'Parameter "prompt" wajib diisi');
    const result = await generateNanoBanana(prompt, req.body || req.query);
    return reply(res, { result });
  } catch (e) { return replyErr(res, e, 500); }
});

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Zaell REST API running on http://0.0.0.0:${PORT}`);
});
