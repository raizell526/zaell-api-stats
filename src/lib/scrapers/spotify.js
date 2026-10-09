import fetch from 'node-fetch';

export async function spotify(urlOrQuery) {
  if (!urlOrQuery) throw new Error('Query atau URL Spotify tidak boleh kosong.');

  let query = urlOrQuery;
  const isUrl = /https?:\/\/(open\.spotify\.com|spotify\.link)/i.test(urlOrQuery);

  const searchRes = await fetch(`https://api.vreden.web.id/api/spotify?url=${encodeURIComponent(query)}`);
  const json = await searchRes.json().catch(() => null);

  if (json && json.result) {
    return json.result;
  }

  // Fallback via Spotify API endpoint
  const res2 = await fetch(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(query)}`);
  const json2 = await res2.json().catch(() => null);

  if (json2 && (json2.data || json2.result)) {
    return json2.data || json2.result;
  }

  throw new Error('Gagal mengambil data Spotify.');
}

export default spotify;
