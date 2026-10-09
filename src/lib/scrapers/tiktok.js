/**
 * lib/scrapers/src/tiktok.js
 */

import { writeFile, unlink, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
];

function getRandomUserAgent() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export function isLink(text) {
    return text?.match(/https?:\/\/\S+/gi) || null;
}

/**
 * Ambil data TikTok dari TikWM (GET & POST mirror fallback + AbortSignal timeout)
 * @param {string} url
 * @returns {{ author: { nickname, unique_id }, title: string, play: string, music: string, images: string[]|null }}
 */
export async function tiktok(url) {
    const link = isLink(url);
    if (!link) throw new Error('URL TikTok tidak valid');

    const targetUrl = link[0];

    const endpoints = [
        { url: `https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}&hd=1`, method: 'GET' },
        { url: `https://tikwm.com/api/?url=${encodeURIComponent(targetUrl)}&hd=1`, method: 'GET' },
        { url: 'https://www.tikwm.com/api/', method: 'POST', body: JSON.stringify({ url: targetUrl, count: 12, cursor: 0, web: 1, hd: 1 }) },
        { url: 'https://tikwm.com/api/', method: 'POST', body: JSON.stringify({ url: targetUrl, count: 12, cursor: 0, web: 1, hd: 1 }) }
    ];

    let lastError = null;

    for (let attempt = 0; attempt < 2; attempt++) {
        for (const ep of endpoints) {
            try {
                const headers = {
                    'User-Agent': getRandomUserAgent(),
                    'Accept': 'application/json, text/plain, */*'
                };

                const opts = {
                    method: ep.method,
                    headers,
                    signal: AbortSignal.timeout(8000)
                };

                if (ep.method === 'POST') {
                    opts.headers['Content-Type'] = 'application/json';
                    opts.body = ep.body;
                }

                const res = await fetch(ep.url, opts);
                if (!res.ok) continue;

                const json = await res.json().catch(() => null);
                if (json && json.code === 0 && json.data) {
                    return json.data;
                } else if (json && json.msg) {
                    lastError = new Error(`TikWM: ${json.msg}`);
                }
            } catch (err) {
                lastError = err;
            }
        }
        await new Promise(r => setTimeout(r, 500));
    }

    throw new Error(
        lastError?.name === 'TimeoutError' || lastError?.message?.includes('timeout')
            ? 'Koneksi ke server TikWM mengalami timeout. Silakan coba lagi.'
            : (lastError?.message || 'Gagal mengambil data TikTok.')
    );
}

/**
 * Pastikan URL video absolut
 * @param {string} url
 * @returns {string}
 */
function normalizeVideoUrl(url) {
    if (!url) throw new Error('URL video kosong atau tidak tersedia');
    if (/^https?:\/\//i.test(url)) return url;
    return `https://www.tikwm.com${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Download video TikTok lalu naikkan volume 4x, return Buffer hasil
 * @param {string} videoUrl
 * @returns {Promise<Buffer>}
 */
export async function tiktokBoostVolume(videoUrl) {
    const fixedUrl = normalizeVideoUrl(videoUrl);
    let videoBuffer = null;

    const urlsToTry = [
        fixedUrl,
        fixedUrl.replace('https://www.tikwm.com', 'https://tikwm.com')
    ];

    for (let i = 0; i < 2; i++) {
        for (const target of urlsToTry) {
            try {
                const res = await fetch(target, {
                    headers: {
                        'User-Agent': getRandomUserAgent(),
                        Referer: 'https://www.tikwm.com/'
                    },
                    signal: AbortSignal.timeout(15000)
                });
                if (res.ok) {
                    const buf = Buffer.from(await res.arrayBuffer());
                    if (buf.length > 0) {
                        videoBuffer = buf;
                        break;
                    }
                }
            } catch (e) {
                console.error(`[TikTok Boost] Download attempt failed (${target}):`, e.message);
            }
        }
        if (videoBuffer) break;
        await new Promise(r => setTimeout(r, 500));
    }

    if (!videoBuffer) {
        throw new Error('Gagal mengunduh berkas video TikTok dari server.');
    }

    const tmpIn = join(tmpdir(), `tt_in_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`);
    const tmpOut = join(tmpdir(), `tt_out_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`);

    try {
        await writeFile(tmpIn, videoBuffer);
        await execAsync(`ffmpeg -i "${tmpIn}" -filter:a "volume=4.0" -c:v copy "${tmpOut}" -y`);
        const boostedBuffer = await readFile(tmpOut);
        return boostedBuffer;
    } catch (err) {
        console.error('[TikTok Boost] FFmpeg volume boost failed, returning raw video:', err.message);
        return videoBuffer;
    } finally {
        await Promise.allSettled([unlink(tmpIn), unlink(tmpOut)]);
    }
}
