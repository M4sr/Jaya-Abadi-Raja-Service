# Panduan Deployment: Jaya Abadi Raja Service

Berikut adalah panduan lengkap menyiapkan Backend (Google Sheets & Apps Script) dan mendeploy Frontend (Website).

---

## BAGIAN 1: SETUP DATABASE GOOGLE SHEETS

1. Buka [Google Sheets](https://sheets.new/) dan buat Spreadsheet baru bernama `DB_JayaAbadiService`.
2. Buat **8 Tab Sheet** (huruf kapital) di kiri bawah, beri nama sebagai berikut:
   - `ORDERS`
   - `SERVICES`
   - `TECHNICIANS`
   - `AREAS`
   - `PAYMENTS`
   - `REPORTS`
   - `RATINGS`
   - `TRACKING`
3. Ambil **ID SPREADSHEET** dari URL pada address bar browser.
   *(Contoh: `https://docs.google.com/spreadsheets/d/1BxiMvs0XRYFgCEbTdQI.../edit` -> ID nya adalah teks panjang `1BxiMvs...`)*

---

## BAGIAN 2: DEPLOY BACKEND (APPS SCRIPT REST API)

1. Di dalam Google Sheet Anda, klik menu **Extensions > Apps Script**.
2. Hapus semua kode default (`function myFunction() {}`), lalu **copy-paste** semua isi dari file `code.gs` yang ada di folder project ini.
3. Di dalam kode tersebut, pada **baris ke-6**, ganti `SPREADSHEET_ID` dengan ID Sheet yang Anda catat pada Bagian 1.
4. Klik icon disket (Save) `Ctrl+S`.
5. Klik tombol **Deploy > New deployment** di kanan atas.
6. Pada *Select type*, klik icon Roda Gigi (⚙️) dan pilih **Web app**.
   - **Description**: `API v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Penting! agar API bisa diakses publik)*
7. Klik **Deploy**.
8. Jika muncul popup *Authorize access*, klik **Review Permissions**, pilih akun Google Anda. (Jika ada peringatan *Google hasn’t verified this app*, klik *Advanced -> Go to Untitled project (unsafe)*).
9. Anda akan mendapatkan sebuah **Web app URL** (`https://script.google.com/macros/s/.../exec`). Copy URL ini.

---

## BAGIAN 3: MENYAMBUNGKAN FRONTEND KE BACKEND

1. Buka file `script.js` menggunakan Notepad / VS Code.
2. Saat ini script frontend menggunakan mode Simulasi / Mock. Untuk menyambungkannya, Anda dapat menambahkan skrip `fetch()` ke Web App URL Anda pada fungsi `bookingForm.addEventListener('submit', ...)` menggantikan simulasi yang ada.
   
   *Contoh Integrasi POST:*
   ```javascript
    fetch('URL_WEB_APP_ANDA_DISINI', {
        method: 'POST',
        body: JSON.stringify({
            action: 'createOrder',
            payload: {
                nama: document.getElementById('nama').value,
                // ... isi data lainnya
            }
        })
    }).then(res => res.json()).then(data => console.log(data));
   ```

---

## BAGIAN 4: HOSTING WEBSITE GRATIS (VERCEL / GITHUB PAGES)

Karena aplikasi web ini murni HTML, CSS, Vanilla JS, dan PWA (Mobile Apps Offline Cache), cara terbaik mendeploynya secara gratis adalah Vercel:

1. Buat akun di **[GitHub](https://github.com/)**.
2. Download **[GitHub Desktop](https://desktop.github.com/)**, lalu upload/push folder project `Jaya Abadi Raja Service` ke sebuah repository baru (Public).
3. Buka **[Vercel](https://vercel.com/)** dan Sign In menggunakan GitHub.
4. Klik **Add New... > Project**.
5. Import repository "Jaya Abadi Raja Service" dari daftar GitHub Anda.
6. Klik **Deploy** (Tanpa perlu mengubah pengaturan apapun / abaikan framework preset karena ini Vanilla HTML).
7. Tunggu 1 menit. Website Anda akan online dan aman (HTTPS), contoh URL: `https://jaya-abadi-service.vercel.app`.

---

## BAGIAN 5: CARA MENGAKSES 3 HALAMAN BERBEDA

Karena kita memiliki 3 file HTML terpisah dalam satu folder, Vercel secara otomatis akan mengatur rutenya berdasarkan nama file. Setelah Vercel sukses melakukan *deploy* (misal domain Anda adalah `https://jaya-abadi-service.vercel.app`), ini cara mengaksesnya:

1. **Halaman Pelanggan (Booking Utama)**
   - **URL:** `https://jaya-abadi-service.vercel.app` (atau secara eksplisit `.../index.html`)
   - **Fungsi:** Tempat pelanggan melihat layanan dan melakukan booking.

2. **Halaman Dashboard Admin**
   - **URL:** `https://jaya-abadi-service.vercel.app/admin.html`
   - **Fungsi:** Tempat Anda/Admin memantau pesanan masuk, melihat statistik pendapatan, dan mengelola kalender (diakses lewat PC/Laptop lebih optimal).

3. **Halaman Panel Teknisi**
   - **URL:** `https://jaya-abadi-service.vercel.app/teknisi.html`
   - **Fungsi:** Aplikasi mobile untuk teknisi melihat daftar tugas dan menekan tombol "Mulai Berbagi Lokasi GPS". (Berikan URL ini khusus kepada teknisi lapangan).

---

## BAGIAN 5: INSTALL PWA (PROGRESSIVE WEB APP)

Setelah website ter-deploy di Vercel:
1. Buka URL website tersebut di HP Android pelanggan menggunakan **Google Chrome**.
2. Akan muncul prompt **"Add to Home Screen"** di bagian bawah. Atau klik titi 3 di pojok kanan atas Chrome, pilih **Add to Home screen** / **Install App**.
3. Aplikasi `JAC Service` akan muncul di daftar aplikasi HP Android/iOS layaknya aplikasi native (dengan icon tanpa bar browser).

---
**Selesai!** Platform on-demand service AC Anda siap digunakan.
