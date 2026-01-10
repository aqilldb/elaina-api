# 🧹 Elaina's API — The Wandering Interface

<div align="center">
  <img src="https://cdn.nefusoft.cloud/92zVH.jpg" width="100%" alt="Elaina Banner" style="border: 2px solid #000; box-shadow: 10px 10px 0px #000;">
  
  <p align="center">
    <br>
    <b>Perpustakaan API RESTful berperforma tinggi dengan desain minimalis "Hard-Edge".</b><br>
    <i>Terinspirasi dari perjalanan sang penyihir pengembara, Elaina.</i>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  </p>
</div>

---

## 📖 Tentang Projek

**Elaina's API** adalah solusi backend terintegrasi yang menyediakan berbagai layanan mulai dari Kecerdasan Buatan (Multi-Model AI), pencarian data anime melalui Anilist, hingga pengunduh media sosial. Projek ini dibangun dengan fokus pada **latensi rendah**, **skalabilitas modular**, dan **estetika desain modern-jejepangan**.

### 🛠️ Teknologi Utama (Stack)
- **Runtime:** Node.js (Versi 16+ atau terbaru).
- **Web Framework:** Express.js (Fast & Minimalist).
- **Database:** Upstash Redis (Serverless database untuk analitik & tracking).
- **Frontend:** Tailwind CSS (Tanpa Next.js untuk menjaga kesederhanaan aset statis).
- **Analytics:** Chart.js (Visualisasi trafik real-time).
- **AI Engine:** Google Gemini, Cerebras SDK, & Groq Cloud.
- **Scraper:** Axios & Cheerio (Parsing data web yang stabil).

---

## 🚀 Memulai (Instalasi Cepat)

Pastikan Anda sudah menginstal Node.js dan Git di sistem Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/alip-jmbd/elaina-api.git
cd elaina-api
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di folder utama dan lengkapi kredensial berikut:
```env
# Koneksi Database (Upstash Redis)
REDIS_URL="rediss://default:xxxxxx@fit-griffon-21539.upstash.io:6379"

# API Keys AI
CEREBRAS_KEY="csk-xxxxxxxxxx"
GROQ_KEY="gsk_xxxxxxxxxx"

# Port Server
PORT=3000
```

### 4. Jalankan Server
```bash
npm start
```
Akses di browser: `http://localhost:3000`

---

## 🛠️ Panduan Developer: Menambah Endpoint Baru

Arsitektur projek ini dibuat sangat modular. Anda dapat menambah fitur baru tanpa harus menyentuh kode UI atau logika server utama.

### Langkah 1: Buat Logic di Folder `lib/`
Buat file baru, misal `lib/downloader.js`.
```javascript
const axios = require('axios');

class MyDownloader {
    async fetch(url) {
        // Logika scraping atau pemanggilan API pihak ketiga
        return { result: "Data dari " + url };
    }
}
module.exports = new MyDownloader();
```

### Langkah 2: Daftarkan di `lib/index.js`
Tambahkan modul Anda ke objek export agar dapat diakses secara global.
```javascript
module.exports = {
    // ... endpoint yang sudah ada
    myDownloader: require('./downloader')
};
```

### Langkah 3: Registrasi di `routes/endpoints.js`
Tambahkan objek konfigurasi ke dalam array `list`. Sidebar dan UI Docs akan otomatis terbuat.
```javascript
{
  category: "Download", // Nama kategori baru akan muncul otomatis di sidebar
  name: "Video Downloader",
  path: "/api/download/video",
  method: "GET",
  params: [
    { name: "url", required: true, placeholder: "https://..." }
  ],
  handler: async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: 400 });
    try {
      const result = await scrap.myDownloader.fetch(url);
      res.json({ status: 200, creator: "elaina", data: result });
    } catch (e) {
      res.status(500).json({ status: 500, message: e.message });
    }
  }
}
```

---

## 🎨 Identitas Visual
Projek ini menggunakan filosofi **Hard-Edge Design**:
- **Border Tegas:** Garis hitam solid 2px tanpa sudut melengkung (*rounded*).
- **Shadow Tajam:** Menggunakan bayangan keras untuk kesan brutal namun bersih.
- **Grid Background:** Pola kotak teknis yang memudar di tepian.
- **Visual Responsif:** Navigasi menimpa konten (*overlay*) untuk pengalaman seluler yang sempurna.

---

## 👤 Kontributor & Kredit
- **Lead Developer:** [LippWangsaff / Alip](https://github.com/alip-jmbd)
- **Infrastructure:** Upstash Redis
- **Character Design:** Wandering Witch: The Journey of Elaina (Majo no Tabitabi)

---

<div align="center">
  <sub>Copyright © 2024 - 2025 Elaina's API.</sub>
</div>
