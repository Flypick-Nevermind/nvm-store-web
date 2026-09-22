# ✨ NEVERMIND (nvm-store-web)

> *"Too cute, too care?"*  
> **NEVERMIND** adalah platform curated cross-border fashion berbasis web client untuk Gen Z (17–27 tahun) yang mengkurasi tas-tas trendi impor dari China. Mengusung konsep **Playful Y2K & Clean Retro-Futuristic**, tampilan mobile-first, transparan, dan minim friksi: *"See it. Pick it. Get it."*

---

## 🎨 Brand Identity & Design System

Platform ini dibangun dengan design tokens resmi **NEVERMIND**:

| Token Name | Hex Code | Deskripsi & Penggunaan |
| :--- | :--- | :--- |
| **Fuchsia Rose** | `#C74375` | Core brand identity, primary CTA button, active states, progress indicators |
| **Chrome Silver** | `#C8C8C8` | Futuristic / metallic Y2K vibe, subtle borders, dividers, chrome accents |
| **Aqua Mist** | `#D8FFF7` | Fresh & playful accent, ready-stock badge, subtle highlights |
| **Pastel Yellow** | `#FDFD96` | High-visibility sticker / tag aksen (e.g. *Just Dropped*, *Trending*) |
| **Warm Cream** | `#FFF8E1` | Background warna utama (hangat, playful, non-sterile) |
| **Charcoal Noir** | `#1A1A1A` | High-contrast typography & readability |

**Typography**:
- **Display / Headings**: [Outfit](https://fonts.google.com/specimen/Outfit) (Bold, modern & high aesthetic)
- **Body / Interface**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Retro-futuristic clarity)

---

## 🌟 Fitur Utama

### 1. 🛍️ Katalog Produk & Filter Cerdas
- **Category Pills**: Filter kategori cepat (*All*, *Shoulder Bags*, *Tote Bags*, *Crossbody*, *Y2K Cyber*).
- **Stock Type Filter**: Toggle antara produk *Ready Stock* dan *Pre-Order (PO)*.
- **Product Card 3:4**: Rasio visual proporsional fashion, tag status, harga IDR, dan tombol *Quick Add to Cart*.

### 2. 🔍 Product Detail Page (PDP)
- **Product Gallery**: Foto interaktif multi-angle dengan thumbnail selector & zoom-friendly preview.
- **ETA Calculator**: Estimasi tanggal tiba pre-order otomatis yang transparan (*lead time* 14–21 hari).
- **Price Breakdown**: Rincian harga jujur tanpa biaya tersembunyi.
- **Sticky Actions**: Tombol *Beli Sekarang* dan *+ Keranjang* yang selalu dapat diakses di layar mobile.

### 3. 💳 3-Step Checkout Wizard & Cart Management
- **Interactive Cart Summary**:
  - Stepper kuantitas (`+` dan `−`) langsung di checkout.
  - Tombol hapus item (`🗑️`) sekali klik.
  - Subtotal per item & total otomatis terhitung seketika.
  - Tombol *"✏️ Ubah Item"* di step pembayaran untuk kemudahan revisi.
- **Step 1 — Data Pembeli & Alamat**: Validasi formulir pengiriman menggunakan **Zod**.
- **Step 2 — Pembayaran**:
  - Rekening bank tujuan dengan fitur **1-Click Salin Nomor Rekening**.
  - QRIS scanner placeholder.
  - Peringatan nominal transfer presisi.
- **Step 3 — Konfirmasi Bukti Transfer**:
  - Drag & drop file uploader (PNG, JPG, WebP max 5MB) dengan image preview.

### 4. 📲 Order Success & WhatsApp Auto-Redirect
- Format pesan konfirmasi otomatis yang terstruktur ke admin WhatsApp dengan Nomor Order ID, nama pembeli, rincian barang, dan total nominal.

### 5. 📦 Pelacakan Pesanan Real-Time (`/track` & `/track/[orderId]`)
- **5-Stage Animated Stepper**:
  1. *Order Dikonfirmasi*
  2. *Diproses di China*
  3. *Dalam Pengiriman Internasional*
  4. *Lolos QC & Siap Kirim Lokal*
  5. *Terkirim ke Kamu*
- **QC Trust Card**: Status inspeksi fisik tas (*Jahitan & Ritsleting*, *Bahan & Warna*, *Aksesoris & Tali*).
- **WhatsApp Support Floating Button (FAB)**: Akses chat bantuan cepat dari halaman mana pun.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan inline `@theme` tokens
- **Animations**: [Framer Motion](https://motion.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) dengan `persist` middleware (`localStorage`)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 📁 Struktur Direktori

```text
nvm-store-web/
├── public/
│   └── assets/                # Aset statis (logo.svg, qris.png, icons)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── checkout/          # Halaman Checkout 3-step wizard
│   │   │   └── success/       # Halaman Order Success & WA redirect
│   │   ├── products/[slug]/   # Dynamic PDP (Product Detail Page)
│   │   ├── track/             # Pencarian order
│   │   │   └── [orderId]/     # Halaman tracking visual 5-stage
│   │   ├── globals.css        # Tailwind v4 theme tokens & custom animations
│   │   ├── layout.tsx         # Root layout, fonts & metadata
│   │   ├── page.tsx           # Home catalog & product listing
│   │   └── providers.tsx      # TanStack Query Client provider
│   ├── components/
│   │   ├── atoms/             # Button, Badge, Input, Checkbox, Logo
│   │   ├── molecules/         # ProductCard, CategoryPill, StepperProgress, BankCard, dll.
│   │   ├── organisms/         # Navbar, Footer, WhatsAppFAB, ProductGallery
│   │   └── layouts/           # PageShell (mobile-first container)
│   ├── constants/             # Brand tokens, kategori, rekening pembayaran, stages
│   ├── lib/
│   │   ├── api/               # Mock data & API hooks (ready for real backend)
│   │   ├── schemas/           # Zod validation schemas
│   │   └── utils/             # Format IDR, format ETA, clipboard helper
│   ├── store/                 # Zustand stores (cartStore & checkoutStore)
│   └── types/                 # TypeScript interfaces & DTOs
└── next.config.ts
```

---

## 🚀 Panduan Menjalankan Project

### 1. Prerequisites
- Node.js versi 18.18+ atau 20+
- npm, pnpm, atau yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka browser di **[http://localhost:3000](http://localhost:3000)**.

### 4. Build untuk Production
```bash
npm run build
npm run start
```

---

## ⚙️ Panduan Kustomisasi & Konfigurasi

### 1. Mengganti Logo Brand
Komponen `Logo` didesain modular. Kamu cukup menaruh file logo final di folder `public/assets/`:
- Format SVG: `public/assets/logo.svg` *(direkomendasikan)*
- Format PNG: `public/assets/logo.png`
*(Jika file belum tersedia, komponen otomatis menampilkan logo tipografi Y2K beraksen)*.

### 2. Mengganti QRIS Pembayaran
Taruh gambar QRIS toko di:
- `public/assets/qris.png`

### 3. Mengatur Nomor WhatsApp & Info Toko
Edit file [`src/constants/brand.ts`](src/constants/brand.ts):
```ts
export const BRAND = {
  name: 'NEVERMIND',
  tagline: 'Too cute, too care?',
  whatsappNumber: '6281234567890', // Ubah dengan nomor WhatsApp tokomu (format internasional tanpa +)
  instagramHandle: 'nevermind.store',
  supportEmail: 'hello@nevermind.id',
};
```

### 4. Mengatur Rekening Bank Tujuan
Edit daftar rekening di file [`src/constants/payment.ts`](src/constants/payment.ts):
```ts
export const BANK_ACCOUNTS = [
  {
    bankName: 'BCA',
    accountNumber: '1234567890',
    accountHolder: 'NEVERMIND STORE',
  },
  // Tambahkan atau ubah rekening lainnya di sini...
];
```

### 5. Menghubungkan ke Backend / Database Asli
Saat ini aplikasi menggunakan mock data lokal dengan delay simulasi. Untuk mengintegrasikan ke REST API atau GraphQL asli:
- Buka [`src/lib/api/orders.ts`](src/lib/api/orders.ts).
- Ganti fungsi `mockCreateOrder` dan `mockFetchOrder` dengan panggilan `fetch()` / `axios` ke endpoint backend kamu. Model data TypeScript sudah siap di [`src/types/api.ts`](src/types/api.ts).

---

## 🌐 Deploy ke Vercel

Project ini siap di-deploy langsung ke **[Vercel](https://vercel.com)**:
1. Hubungkan repository GitHub [`Flypick-Nevermind/nvm-store-web`](https://github.com/Flypick-Nevermind/nvm-store-web).
2. Framework preset akan otomatis terdeteksi sebagai **Next.js**.
3. Klik **Deploy**.

---

<p align="center">
  Dibuat dengan 💖 untuk <b>NEVERMIND</b>
</p>
