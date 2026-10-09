/**
 * lib/scrapers/src/nanobanana.js
 * Scraper Engine for Nano Banana AI (Universal Image Generator & Image Editor)
 * Base URL: https://nanobanana.io / https://nanobanana.im
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const BASE_URL = 'https://nanobanana.io';

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Origin': BASE_URL,
  'Referer': `${BASE_URL}/create`,
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Auto-provision session token via Mail.tm + NextAuth Magic Link
 * @returns {Promise<string>} authCookieString
 */
export async function autoProvisionSession() {
  const cookieJar = new Map();
  const addCookies = (arr) => {
    (arr || []).forEach((c) => {
      const parts = c.split(';')[0].split('=');
      const k = parts[0].trim();
      const v = parts.slice(1).join('=').trim();
      if (k && v) cookieJar.set(k, v);
    });
  };

  const getCookieStr = () => Array.from(cookieJar.entries()).map(([k, v]) => `${k}=${v}`).join('; ');

  // 1. Inisialisasi sesi Halaman Create
  const initRes = await axios.get(`${BASE_URL}/create`, { headers: DEFAULT_HEADERS, timeout: 15000 });
  addCookies(initRes.headers['set-cookie']);

  // 2. Ambil CSRF token
  const csrfRes = await axios.get(`${BASE_URL}/api/auth/csrf`, {
    headers: { ...DEFAULT_HEADERS, Cookie: getCookieStr() },
    timeout: 15000,
  });
  const csrfToken = csrfRes.data?.csrfToken;
  addCookies(csrfRes.headers['set-cookie']);

  if (!csrfToken) {
    throw new Error('Gagal mendapatkan CSRF Token dari NanoBanana IO.');
  }

  // 3. Buat akun email sementara via Mail.tm
  const domRes = await axios.get('https://api.mail.tm/domains', { timeout: 10000 });
  const domain = domRes.data?.['hydra:member']?.[0]?.domain || 'uberip.com';
  const username = `nano${Math.random().toString(36).slice(2, 10).replace(/[^a-z0-9]/g, '')}`;
  const email = `${username}@${domain}`;
  const password = `Pass_${Math.random().toString(36).slice(2, 8)}!`;

  await axios.post('https://api.mail.tm/accounts', { address: email, password }, { timeout: 15000 });
  const tokenRes = await axios.post('https://api.mail.tm/token', { address: email, password }, { timeout: 15000 });
  const mailToken = tokenRes.data?.token;

  if (!mailToken) {
    throw new Error('Gagal membuat temp mail untuk autentikasi NanoBanana.');
  }

  // 4. Request Magic Link ke NanoBanana
  const magicReqRes = await axios.post(
    `${BASE_URL}/api/auth/magic-link`,
    { email, callbackUrl: `${BASE_URL}/create` },
    {
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/json',
        Cookie: getCookieStr(),
      },
      timeout: 15000,
    }
  );
  addCookies(magicReqRes.headers['set-cookie']);

  // 5. Polling inbox mail.tm untuk token magic link
  let magicToken = null;
  for (let i = 1; i <= 12; i++) {
    await delay(2500);
    try {
      const inboxRes = await axios.get('https://api.mail.tm/messages', {
        headers: { Authorization: `Bearer ${mailToken}` },
        timeout: 10000,
      });
      const msgs = inboxRes.data?.['hydra:member'] || [];
      if (msgs.length > 0) {
        const detailRes = await axios.get(`https://api.mail.tm/messages/${msgs[0].id}`, {
          headers: { Authorization: `Bearer ${mailToken}` },
          timeout: 10000,
        });
        const html = detailRes.data?.html?.[0] || detailRes.data?.text || '';
        const match = html.match(/token=([a-zA-Z0-9_\-\.]+)/i);
        if (match) {
          magicToken = match[1];
          break;
        }
      }
    } catch (_) {
      // transient error ignore
    }
  }

  if (!magicToken) {
    throw new Error('Timeout saat menunggu email verifikasi NanoBanana.');
  }

  // 6. Submit Callback Sign-In ke NextAuth
  const params = new URLSearchParams();
  params.append('token', magicToken);
  params.append('csrfToken', csrfToken);
  params.append('json', 'true');

  const cbRes = await axios.post(`${BASE_URL}/api/auth/callback/magic-link`, params.toString(), {
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: getCookieStr(),
    },
    maxRedirects: 0,
    validateStatus: (s) => s >= 200 && s < 400,
    timeout: 15000,
  });

  addCookies(cbRes.headers['set-cookie']);

  return getCookieStr();
}

/**
 * Upload gambar untuk mode Image Edit / Transformation
 * @param {string|Buffer} imagePathUrlOrBuffer 
 * @param {string} cookieStr 
 * @returns {Promise<string>}
 */
export async function uploadImageToNanoBanana(imagePathUrlOrBuffer, cookieStr) {
  if (typeof imagePathUrlOrBuffer === 'string') {
    if (imagePathUrlOrBuffer.startsWith('http://') || imagePathUrlOrBuffer.startsWith('https://')) {
      return imagePathUrlOrBuffer;
    }
    if (fs.existsSync(imagePathUrlOrBuffer)) {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(path.resolve(imagePathUrlOrBuffer)));

      const res = await axios.post(`${BASE_URL}/api/image/upload`, formData, {
        headers: {
          ...DEFAULT_HEADERS,
          ...formData.getHeaders(),
          Cookie: cookieStr,
        },
        timeout: 30000,
      });

      return res.data?.url || res.data?.data?.url;
    }
  }

  if (Buffer.isBuffer(imagePathUrlOrBuffer)) {
    const formData = new FormData();
    formData.append('file', imagePathUrlOrBuffer, { filename: 'input.png', contentType: 'image/png' });

    const res = await axios.post(`${BASE_URL}/api/image/upload`, formData, {
      headers: {
        ...DEFAULT_HEADERS,
        ...formData.getHeaders(),
        Cookie: cookieStr,
      },
      timeout: 30000,
    });

    return res.data?.url || res.data?.data?.url;
  }

  throw new Error('Format gambar tidak valid atau berkas tidak ditemukan.');
}

/**
 * Generate AI image via NanoBanana.io (Text-to-Image & Image Edit)
 * 
 * @param {string} prompt - Deskripsi prompt gambar
 * @param {Object} [options] - Opsi generasi
 * @param {string|Buffer} [options.image] - Path berkas, Buffer, atau URL gambar untuk mode edit
 * @param {string} [options.aspectRatio='1:1'] - Rasio aspek ('1:1' | '16:9' | '9:16' | '4:3' | '3:4')
 * @param {string} [options.resolution='1K'] - Resolusi ('1K' | '2K')
 * @param {string} [options.cookie] - Sesi cookie khusus jika ada
 * @returns {Promise<Object>}
 */
export async function generateNanoBanana(prompt, options = {}) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Parameter prompt deskripsi gambar wajib diisi.');
  }

  const cleanPrompt = prompt.trim();
  let cookieStr = options.cookie || process.env.NANOBANANA_COOKIE || null;

  if (!cookieStr) {
    cookieStr = await autoProvisionSession();
  }

  let inputImages = null;
  if (options.image) {
    const uploadedUrl = await uploadImageToNanoBanana(options.image, cookieStr);
    if (uploadedUrl) {
      inputImages = [uploadedUrl];
    }
  }

  const aspectRatio = options.aspectRatio || options.ratio || '1:1';
  const resolution = options.resolution || options.res || '1K';

  const payload = {
    model: 'nano-banana',
    prompt: cleanPrompt,
    params: {
      aspect_ratio: aspectRatio,
      max_images: 1,
      resolution: resolution,
      images: inputImages,
    },
  };

  const createRes = await axios.post(`${BASE_URL}/api/task/create`, payload, {
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json',
      Cookie: cookieStr,
    },
    timeout: 20000,
  });

  if (createRes.data?.code !== 0 && createRes.data?.code !== 200) {
    throw new Error(createRes.data?.message || 'Gagal membuat task di NanoBanana.');
  }

  const predictionId =
    createRes.data?.data?.predictionId ||
    createRes.data?.predictionId ||
    createRes.data?.data?.taskId ||
    createRes.data?.taskId;

  if (!predictionId) {
    throw new Error('Tidak menerima Prediction ID dari server NanoBanana.');
  }

  let finalResults = [];
  const maxAttempts = 35; // ~140 detik max
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await delay(4000);

    const checkRes = await axios.post(
      `${BASE_URL}/api/task/check`,
      { predictionId },
      {
        headers: {
          ...DEFAULT_HEADERS,
          'Content-Type': 'application/json',
          Cookie: cookieStr,
        },
        timeout: 15000,
      }
    );

    const checkData = checkRes.data?.data;
    if (checkData && checkData.result && Array.isArray(checkData.result) && checkData.result.length > 0) {
      finalResults = checkData.result;
      break;
    }

    if (checkData && (checkData.state === 'failed' || checkData.status === 'failed')) {
      throw new Error(checkData.failMsg || checkData.errorMessage || 'Generasi gambar gagal.');
    }
  }

  if (finalResults.length === 0) {
    throw new Error('Timeout saat menunggu hasil gambar dari NanoBanana.');
  }

  const primaryUrl = typeof finalResults[0] === 'string' ? finalResults[0] : finalResults[0].url;

  return {
    status: 'success',
    engine: 'Nano Banana AI',
    prompt: cleanPrompt,
    mode: inputImages ? 'image-edit' : 'text-to-image',
    aspectRatio,
    resolution,
    predictionId,
    imageUrl: primaryUrl,
    allImages: finalResults.map((r) => (typeof r === 'string' ? r : r.url)),
    timestamp: new Date().toISOString(),
  };
}

export default generateNanoBanana;
