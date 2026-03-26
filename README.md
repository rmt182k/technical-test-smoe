# Instalasi Aplikasi Material Request

## 🗄️ Langkah 1: Siapkan Database
1. Buka aplikasi PostgreSQL.
2. Buat database dan table sesuai dengan fle database_scheme.sql yang ada di folder backend.
---

## Langkah 2: Menjalankan Backend (Server)
1. Buka project di **Visual Studio Code (VS Code)**.
2. Buka Folder Backend
3. Edit file main.ts ganti port menjadi 3001 (agar tidak menabrak port 3000 yang digunakan oleh frontend)
4. Edit file app.module.ts ganti password database sesuai dengan password yang kamu gunakan saat instalasi PostgreSQL
5. Buka **Terminal** di dalam VS Code (Klik menu `Terminal` di atas > `New Terminal`).
6. Ketik perintah ini untuk masuk ke folder Backend, lalu tekan Enter:
   ```bash
   cd backend
   ```
7. Ketik perintah ini untuk mendownload pustaka/alat pendukung (butuh koneksi internet & tunggu sampai selesai):
   ```bash
   npm install
   ```
8. Nyalakan mesin servernya dengan perintah ini:
   ```bash
   npm run start:dev
   ```
---

## Langkah 2: Menjalankan Frontend (Tampilan Website)
1. Buka **Terminal Baru** di VS Code (Klik lambang `+` di sebelah kanan nama terminal yang sedang berjalan).
2. Di terminal yang kosong ini, pindah ke folder frontend dengan mengetik:
   ```bash
   cd frontend
   ```
3. Sama seperti tadi, download pustaka tampilannya dengan perintah:
   ```bash
   npm install
   ```
4. Jalankan website-nya dengan perintah:
   ```bash
   npm run dev
   ```
---
