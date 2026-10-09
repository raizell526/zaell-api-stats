let chromium = null;
try {
  const pw = await import('playwright-core');
  chromium = pw.default?.chromium || pw.chromium;
} catch (_) {}
import fetch from 'node-fetch';

const CHROMIUM_PATH = '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const LANG_MAP = {
  'id': 'id',
  'indonesia': 'id',
  'indonesian': 'id',
  'id-id': 'id',
  'ardi': 'id',
  'gadis': 'id',
  'jv': 'jw',
  'jawa': 'jw',
  'javanese': 'jw',
  'su': 'su',
  'sunda': 'su',
  'sundanese': 'su',
  'en': 'en',
  'english': 'en',
  'us': 'en',
  'jenny': 'en',
  'guy': 'en',
  'uk': 'en-uk',
  'ja': 'ja',
  'jp': 'ja',
  'japan': 'ja',
  'japanese': 'ja',
  'nanami': 'ja',
  'keita': 'ja',
  'ko': 'ko',
  'kr': 'ko',
  'korean': 'ko',
  'ar': 'ar',
  'arabic': 'ar',
  'zh': 'zh-CN',
  'chinese': 'zh-CN',
  'es': 'es',
  'spanish': 'es',
  'fr': 'fr',
  'french': 'fr',
  'de': 'de',
  'german': 'de'
};

/**
 * Fast Google Text-to-Speech Engine
 */
export async function googleTTS(text, lang = 'id') {
  if (!text || typeof text !== 'string') throw new Error('Teks tidak boleh kosong.');
  
  const cleanText = text.trim().slice(0, 2000);
  const words = cleanText.split(/\s+/);
  const chunks = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= 200) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) chunks.push(current);
      current = word;
    }
  }
  if (current) chunks.push(current);

  const targetLang = String(lang || 'id').toLowerCase();
  const buffers = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${encodeURIComponent(targetLang)}&total=${chunks.length}&idx=${i}&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error(`Google TTS gagal (${res.status})`);
    const ab = await res.arrayBuffer();
    buffers.push(Buffer.from(ab));
  }

  return Buffer.concat(buffers);
}

/**
 * Scraper for Luvvoice & High-Quality TTS Engine
 */
export async function luvvoice(text, langOrVoice = '') {
  if (!text || typeof text !== 'string') {
    throw new Error('Teks wajib diisi untuk mengonversi ke suara.');
  }

  const queryKey = String(langOrVoice || '').toLowerCase().trim();
  const langCode = LANG_MAP[queryKey] || 'id';

  // First try instant Google TTS for high speed & accuracy
  try {
    const buffer = await googleTTS(text, langCode);
    if (buffer && buffer.length > 500) {
      return {
        audioUrl: `https://translate.google.com/translate_tts?client=tw-ob&tl=${langCode}`,
        buffer,
        langUsed: langCode
      };
    }
  } catch (err) {
    // Fallback to Playwright if needed
  }

  // Playwright Headless Fallback for Luvvoice
  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://luvvoice.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1000);

    await page.fill('textarea', text.slice(0, 3000));

    const generateBtn = page.locator('button:has-text("Generate")');
    await generateBtn.click();

    await page.waitForSelector('audio[src]', { state: 'attached', timeout: 15000 });

    const audioUrl = await page.evaluate(() => {
      const audios = Array.from(document.querySelectorAll('audio'));
      // Filter out demo/sample audio files on homepage
      const realAudio = audios.find(a => a.src && !a.src.includes('clara-vale') && !a.src.includes('featured-voice'));
      return realAudio ? realAudio.src : null;
    });

    await browser.close();

    if (audioUrl) {
      const res = await fetch(audioUrl);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        return {
          audioUrl,
          buffer: Buffer.from(arrayBuffer),
          langUsed: langCode
        };
      }
    }
  } catch (_) {
    await browser.close().catch(() => {});
  }

  // Final fallback to Google TTS
  const buffer = await googleTTS(text, langCode);
  return {
    audioUrl: `https://translate.google.com/translate_tts?client=tw-ob&tl=${langCode}`,
    buffer,
    langUsed: langCode
  };
}

export default luvvoice;
