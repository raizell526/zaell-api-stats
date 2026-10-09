import fetch from 'node-fetch';

export async function getSurah(surahNumber = 1) {
  const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
  const json = await res.json();
  if (json.code === 200 && json.data) {
    return json.data;
  }
  throw new Error('Surah tidak ditemukan');
}

export async function listSurah() {
  const res = await fetch('https://equran.id/api/v2/surat');
  const json = await res.json();
  if (json.code === 200 && json.data) {
    return json.data;
  }
  throw new Error('Gagal mengambil daftar surah');
}

export default { getSurah, listSurah };
