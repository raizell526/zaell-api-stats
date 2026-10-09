<div align="center">

<img src="./public/logogram-omnifylabs.png" alt="OmnifyLabs Logo" width="80" height="80" style="border-radius: 16px; margin-bottom: 16px;" />

# OmnifyLabs API Stats Platform

**Template dashboard modern dan berkinerja tinggi untuk analitik request API, pemantauan SLA latensi endpoint, dan telemetri infrastruktur edge secara real-time.**

[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=flat-square&logo=chart.js&logoColor=white)](https://www.chartjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Demo Langsung](https://api-stats.omnifylabs.sbs) • [Laporkan Masalah](https://github.com/omnifyproject/Omnify-API-Stats-Template/issues) • [Gabung Komunitas](https://whatsapp.com/channel/0029VbD95WTBlHpf7WV82D0M)

</div>

---

## Ringkasan Proyek

**OmnifyLabs API Stats Platform** adalah template dashboard telemetri dan analitik API kelas enterprise yang dibangun menggunakan Astro, Tailwind CSS, TypeScript, dan Chart.js. Dirancang dengan estetika *dark glassmorphism command-center*, template ini menyediakan visibilitas visual terhadap volume throughput request global, kesehatan SLA, persentil latensi, dan distribusi Point-of-Presence (POP) edge regional.

Repository ini berfungsi sebagai template siap pakai (*starter template*) untuk memvisualisasikan data API gateway, proxy, dan layanan microservice tanpa memerlukan konfigurasi backend yang rumit.

---

## Fitur Utama

- **Visualisasi Throughput Global**: Grafik garis interaktif bertenaga Chart.js dengan perbandingan periode (minggu ini vs. minggu lalu), indikator jam sibuk (*traffic peak*), dan efek gradien halus.
- **SLA & Kesehatan Endpoint Inti**: Pemantauan kesehatan per-endpoint secara langsung dengan bar segmen 16-blok, latensi rata-rata, dan tingkat keberhasilan HTTP 2xx.
- **Live Ingest Request Stream**: Feed simulasi log request API real-time yang menampilkan timestamp, metode HTTP, status kode, wilayah POP asal, penyamaran IP klien, dan preview payload.
- **Jaringan Edge Gateway Regional**: Pemantauan latensi multi-region antar-POP gateway global dengan metrik rasio *cache hit*.
- **Dokumentasi API Terintegrasi**: Portal dokumentasi interaktif 2-pane yang dilengkapi snippet cURL, skema parameter query, dan preview respon JSON.
- **100% Mock Data Ready**: Seluruh data tersentralisasi di satu file TypeScript statis (`src/data/mock.ts`), siap digunakan seketika tanpa memerlukan database atau server backend.
- **Desain Responsif & Mobile Friendly**: Tampilan layar lebar (*ultra-widescreen*) di desktop serta dilengkapi navigasi menu hamburger animasi *staggered cascade* di smartphone.
- **Optimasi SEO Lengkap**: Dilengkapi metadata OpenGraph, Twitter Cards, Canonical URL, dan Schema.org JSON-LD Structured Data.

---

## Teknologi yang Digunakan

| Teknologi | Fungsi |
| :--- | :--- |
| **Astro** | Static site generation dan arsitektur komponen modern |
| **Tailwind CSS** | Styling berbasis utilitas dengan custom dark tokens |
| **TypeScript** | Pengetikan data yang aman untuk seluruh skema telemetri |
| **Chart.js** | Visualisasi grafik volume traffic berbasis Canvas HTML5 |
| **Inter & JetBrains Mono** | Tipografi antarmuka modern dan font kode developer |

---

## Panduan Memulai

### Prasyarat

Pastikan Anda telah menginstal [Node.js](https://nodejs.org) (versi 18.17.0 atau lebih baru) atau [Bun](https://bun.sh).

### Instalasi

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/omnifyproject/Omnify-API-Stats-Template.git
   cd Omnify-API-Stats-Template
   ```

2. **Instal dependensi:**
   ```bash
   # Menggunakan Bun (Direkomendasikan)
   bun install

   # Menggunakan npm
   npm install

   # Menggunakan pnpm
   pnpm install
   ```

3. **Jalankan development server:**
   ```bash
   bun dev
   # atau
   npm run dev
   ```

4. Buka browser Anda dan akses `http://localhost:4321`.

---

## Struktur Direktori

```text
├── public/
│   ├── favicon.png                  # Ikon favicon platform
│   └── logogram-omnifylabs.png      # Aset logo resmi OmnifyLabs
├── src/
│   ├── components/
│   │   ├── CardGridPattern.astro    # Efek visual grid background
│   │   ├── DocsView.astro           # Komponen portal dokumentasi API
│   │   ├── Header.astro             # Navbar dengan mobile hamburger drawer
│   │   ├── LiveLogsTable.astro      # Tabel stream log permintaan real-time
│   │   ├── MainChart.astro          # Visualisasi grafik throughput Chart.js
│   │   ├── ProviderStatus.astro     # Monitoring SLA segmen endpoint
│   │   ├── StatCard.astro           # 5 kartu metrik KPI utama di dashboard
│   │   └── StorageView.astro        # Monitoring gateway edge regional
│   ├── data/
│   │   └── mock.ts                  # Sumber data mock dan tipe TypeScript
│   ├── layouts/
│   │   └── Layout.astro             # Shell HTML utama dengan tag SEO lengkap
│   ├── pages/
│   │   ├── index.astro              # Halaman utama dashboard
│   │   └── 404.astro                # Halaman kustom error 404
│   └── styles/
│       └── global.css               # Desain token, scrollbar, dan animasi
├── astro.config.mjs                 # Konfigurasi Astro
├── tailwind.config.mjs              # Konfigurasi Tailwind CSS
├── tsconfig.json                    # Opsi compiler TypeScript
└── package.json
```

---

## Kustomisasi Data

Seluruh data metrik, grafik, daftar endpoint, dan node edge tersimpan secara terpusat di berkas:

```text
src/data/mock.ts
```

Anda dapat menyesuaikan angka statistik, menambah daftar endpoint API baru, atau mengubah data grafik dengan mengedit objek data pada file tersebut tanpa perlu mengubah struktur komponen.

---

## Build & Deployment

### Menghasilkan Production Build

```bash
bun run build
# atau
npm run build
```

Hasil build statis yang telah dioptimasi akan tersimpan di direktori `dist/`.

### Deploy ke Cloudflare Pages / Vercel / Netlify

Project ini dapat dideploy secara langsung ke berbagai penyedia hosting statis:

- **Cloudflare Pages**: Hubungkan repository GitHub Anda, atur build command ke `bun run build` atau `npm run build`, dan output directory ke `dist`.
- **Vercel**: Pilih preset Astro dan deploy secara instan.
- **Netlify**: Atur publish directory ke `dist`.

---

## Kontribusi

Kontribusi, pelaporan bug, dan saran fitur sangat dipersilakan. Silakan buat *Issue* atau kirimkan *Pull Request* di repository ini.

---

## Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat berkas [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

<div align="center">
  <sub>Dibuat oleh <a href="https://omnifylabs.sbs">OmnifyLabs</a>. © 2026 Hak Cipta Dilindungi.</sub>
</div>
