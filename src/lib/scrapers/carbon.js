import fetch from 'node-fetch';

export async function carbon(code, theme = 'dracula', language = 'auto') {
  if (!code) throw new Error('Kode tidak boleh kosong.');

  const res = await fetch('https://carbonara.soldev.app/api/cook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, theme, language }),
  });

  if (!res.ok) throw new Error(`Carbon API error ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  return {
    base64: buffer.toString('base64'),
    mimeType: 'image/png',
  };
}

export default carbon;
