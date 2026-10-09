import fetch from 'node-fetch';

export async function getCryptoPrices() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&order=market_cap_desc&per_page=15&page=1&sparkline=false');
  const json = await res.json();
  if (Array.isArray(json)) {
    return json.map(c => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      priceIdr: c.current_price,
      priceChange24h: c.price_change_percentage_24h,
      image: c.image
    }));
  }
  throw new Error('Gagal mengambil harga crypto');
}

export default getCryptoPrices;
