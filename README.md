# 🍱 Lugh Finance - Warteg Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

**Lugh Finance** adalah aplikasi manajemen keuangan mobile yang dirancang khusus untuk kebutuhan operasional Warteg. Aplikasi ini memungkinkan pemilik bisnis untuk memantau saldo, mencatat pemasukan (penjualan), dan pengeluaran (belanja stok/operasional) secara real-time dengan antarmuka yang modern dan premium.

## ✨ Fitur Utama

*   **🔐 Autentikasi Keamanan**: Sistem Login & Register menggunakan JWT (JSON Web Token) dengan fitur *Auto-Seed* (otomatis membuat dompet & kategori default saat pertama kali mendaftar).
*   **📊 Dashboard Finansial**: Visualisasi saldo total, total pemasukan harian, dan pengeluaran harian yang terupdate secara instan.
*   **➕ Pencatatan Transaksi Full-Page**: Alur input transaksi yang lega dan intuitif, lengkap dengan pemisah ribuan (thousand separator) saat mengetik nominal.
*   **🏷️ Manajemen Kategori Dinamis**: Tambah kategori baru langsung dari halaman transaksi. Filter kategori di riwayat transaksi otomatis menyesuaikan dengan data yang ada.
*   **💳 Multi-Wallet Support**: Mendukung metode pembayaran **Cash** dan **QRIS** untuk sinkronisasi arus kas yang akurat.
*   **⚡ High Performance Caching**: Menggunakan **TanStack Query** untuk manajemen state server yang efisien, mengurangi penggunaan kuota internet, dan memberikan pengalaman pengguna yang sangat responsif.
*   **📱 Native Mobile Experience**: Dibangun dengan **Capacitor** untuk performa aplikasi native di Android dan iOS.

## 🚀 Teknologi yang Digunakan

### Frontend (Mobile App)
*   **React + Vite**: Framework utama untuk performa tinggi.
*   **Tailwind CSS (v4)**: Untuk styling UI yang modern dan responsif.
*   **TanStack Query (React Query)**: Untuk sinkronisasi data server & caching.
*   **Framer Motion**: Untuk animasi transisi dan modal yang halus.
*   **Lucide React**: Set ikon premium.

### Backend (API)
*   **Golang (Gin Framework)**: Bahasa backend yang cepat dan stabil.
*   **MySQL**: Database utama untuk penyimpanan data keuangan.
*   **Vercel**: Platform hosting API yang andal.

## 🛠️ Instalasi & Persiapan

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/rizkyfauzi-git/lugh-mobile-app.git
    cd lugh-mobile-app
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Ubah URL API di `src/services/api.ts` jika Anda menggunakan server lokal:
    ```typescript
    const BASE_URL = 'https://lugh-mobile-backend-v1.vercel.app/api';
    ```

4.  **Jalankan Mode Development**
    ```bash
    npm run dev
    ```

5.  **Build untuk Mobile (Capacitor)**
    ```bash
    npm run build
    npx cap sync
    ```

## 📁 Struktur Folder

```text
src/
├── assets/         # Aset gambar & logo
├── components/     # Komponen reusable (BottomNav, TransactionList, dll)
├── pages/          # Halaman utama (Home, History, AddTransaction, dll)
├── services/       # Integrasi API (TanStack Query hooks)
└── App.tsx         # Root component & Navigasi
```

## 🤝 Kontribusi

Kontribusi selalu terbuka! Silakan lakukan **Fork** pada repositori ini dan kirimkan **Pull Request** untuk perbaikan atau penambahan fitur baru.

---

Dibuat dengan ❤️ oleh **Rizky Fauzi** untuk kemajuan UMKM Indonesia.
