# SIA-SEKOLAH (Sistem Informasi Akademik Sekolah)
> Aplikasi Web Sistem Informasi Akademik Modern, Responsif, dan Cloud-Ready berbasis Node.js, Express.js, EJS, MySQL, dan Docker.

Aplikasi ini dikembangkan sebagai proyek pembelajaran **Cloud Computing** dengan arsitektur **Model-View-Controller (MVC)** yang terstruktur, modular, dan siap dideploy menggunakan container Docker.

---

## 🌟 Fitur Utama Aplikasi

### 1. Autentikasi & Multi-Role (RBAC)
- **Role Pengguna**:
  - 👑 **Admin**: Memiliki akses penuh mengelola data Siswa, Guru, Rombel/Kelas, Mata Pelajaran, Penilaian, Jadwal, dan Pengguna.
  - 👨‍🏫 **Guru**: Mengelola penilaian akademik siswa, melihat jadwal mengajar, melihat daftar mata pelajaran diampu, dan data kelas.
  - 🎓 **Siswa**: Melihat dashboard personal, transkrip nilai/rapor hasil belajar siswa, jadwal pelajaran kelas, dan profil pribadi.
- Keamanan session berbasis `express-session` dan enkripsi password menggunakan algoritma hashing **bcrypt**.

### 2. Dashboard Modern & SaaS Style
- Kartu metrik ringkasan: Total Siswa, Total Guru, Total Kelas, Total Mata Pelajaran.
- Visualisasi grafik interaktif menggunakan **Chart.js**:
  - Distribusi Jumlah Siswa per Kelas (Bar Chart).
  - Komposisi Gender Siswa (Doughnut Chart).
- Widget personalisasi otomatis sesuai role yang sedang login.

### 3. Manajemen Siswa (CRUD Penuh)
- Registrasi siswa baru lengkap dengan NIS, NISN, nama, jenis kelamin, tanggal lahir, alamat, penempatan rombel/kelas, dan nomor telepon.
- Pilihan pembuatan akun login siswa otomatis saat registrasi.
- Fitur pencarian instan dan pagination.
- Halaman detail profil akademik siswa.
- Konfirmasi penghapusan data dengan dialog interaktif **SweetAlert2**.

### 4. Manajemen Guru (CRUD Penuh)
- Registrasi tenaga pendidik dengan NIP, nama lengkap, gelar, jenis kelamin, alamat, dan nomor telepon.
- Pilihan pembuatan akun login guru otomatis.
- Detail profil guru beserta daftar mata pelajaran yang diampu dan jadwal mengajarnya.

### 5. Manajemen Kelas (CRUD Penuh)
- Mengatur nama rombel (misal: X MIPA 1, XI IPS 2), tingkat jenjang (X, XI, XII), penugasan wali kelas, dan tahun ajaran.
- Menampilkan daftar seluruh peserta didik yang terdaftar pada kelas tersebut.
- Terintegrasi dengan jadwal pelajaran per kelas.

### 6. Manajemen Mata Pelajaran (CRUD Penuh)
- Mengatur kode mapel, nama mata pelajaran, kategori (Wajib, Peminatan, Muatan Lokal).
- Menentukan dan menugaskan guru pengampu untuk setiap mata pelajaran.

### 7. Manajemen Penilaian Akademik
- Entri nilai tugas (bobot 30%), nilai UTS (bobot 30%), dan nilai UAS (bobot 40%).
- Perhitungan otomatis nilai akhir, predikat (A, B+, B, C+, C, D), dan keterangan (Lulus/Remedial).
- Fitur filter berdasarkan kelas, mata pelajaran, dan semester.
- Tampilan Rapor Siswa khusus dengan tombol cetak langsung (*print-friendly*).

### 8. Manajemen Jadwal Pelajaran
- Penjadwalan terstruktur per hari (Senin s.d. Sabtu), jam mulai, jam selesai, kelas, mata pelajaran, guru pengampu, dan ruangan/laboratorium.
- Filter pencarian jadwal berdasarkan kelas, hari, maupun guru pengajar.

### 9. Profil & Keamanan Pengguna
- Melihat informasi akun dan biodata terhubung.
- Mengubah password akun dengan validasi password lama dan konfirmasi password baru.
- Memperbarui alamat dan nomor kontak.

---

## 👥 Akun Demo Pengujian

Aplikasi telah dilengkapi dengan data dummy siap pakai. Anda dapat masuk langsung menggunakan akun berikut atau mengklik tombol cepat (*quick fill*) pada halaman login:

| Role | Username | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin@sekolah.sch.id` | `admin123` |
| **Guru** | `budi_santoso` | `budi.santoso@sekolah.sch.id` | `guru123` |
| **Siswa** | `ahmad_fauzi` | `ahmad.fauzi@siswa.sch.id` | `siswa123` |

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js (v4.21)
- **Template Engine**: EJS (Embedded JavaScript Templates)
- **Database**: MySQL 8.0 / MariaDB (Driver `mysql2/promise`)
- **Frontend Framework**: Bootstrap 5.3 & Custom Modern SaaS CSS
- **Icons**: Font Awesome 6
- **Data Visualization**: Chart.js 4.4
- **Modal & Alert**: SweetAlert2
- **Containerization**: Docker & Docker Compose

---

## 🚀 Panduan Menjalankan Aplikasi

Anda dapat menjalankan aplikasi ini melalui **Docker Compose** (Rekomendasi untuk Cloud Computing) atau secara **Lokal (Node.js + XAMPP/MySQL)**.

### Metode A: Menjalankan dengan Docker Compose (Direkomendasikan)

Pastikan Docker Desktop sudah terpasang dan berjalan di komputer Anda.

1. **Jalankan Container**:
   Buka terminal pada direktori proyek, lalu ketik perintah:
   ```bash
   docker compose up --build -d
   ```

2. **Verifikasi Container**:
   Periksa status container yang sedang berjalan:
   ```bash
   docker compose ps
   ```
   Terdapat dua service:
   - `sia_mysql` (Database MySQL 8.0 dengan healthcheck & volume persisten)
   - `sia_web` (Aplikasi Node.js Express)

3. **Buka Aplikasi di Browser**:
   Akses melalui browser di: [http://localhost:3000](http://localhost:3000)

4. **Menghentikan Container**:
   ```bash
   docker compose down
   ```
   *(Data MySQL tetap tersimpan aman di volume `mysql_data`)*

---

### Metode B: Menjalankan Secara Lokal (Node.js & XAMPP / MySQL)

Jika ingin menjalankan tanpa Docker:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment (`.env`)**:
   Pastikan file `.env` telah disesuaikan dengan konfigurasi MySQL lokal Anda (misalnya XAMPP MySQL):
   ```ini
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=sia_sekolah_super_secret_key_2025

   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=sia_sekolah
   DB_PORT=3306
   ```

3. **Inisialisasi Database & Data Dummy**:
   Jalankan script otomatis untuk membuat database `sia_sekolah`, tabel, relasi foreign key, dan data dummy:
   ```bash
   npm run init-db
   ```

4. **Jalankan Server**:
   ```bash
   npm start
   ```
   *(Atau `npm run dev` untuk hot reload saat pengembangan)*

5. **Akses Aplikasi**:
   Buka browser di: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Menjalankan Pengujian Otomatis

Aplikasi dilengkapi dengan rangkaian pengujian unit & integrasi otomatis untuk memvalidasi koneksi DB, verifikasi bcrypt, role auth, dan seluruh fungsionalitas CRUD:

```bash
node tests/testApp.js
```
*Hasil pengujian mencakup 32 skenario uji (PASS 100%).*

---

## 📁 Struktur Folder Proyek (MVC Architecture)

```
SIA-SEKOLAH/
├── config/
│   └── database.js             # Pool koneksi MySQL2 (Promise-based)
├── controllers/
│   ├── authController.js       # Logika login, logout, sesi pengguna
│   ├── dashboardController.js  # Agregasi statistik, chart data, widget role
│   ├── siswaController.js      # CRUD Siswa, pagination, filter
│   ├── guruController.js       # CRUD Guru
│   ├── kelasController.js      # CRUD Rombel/Kelas & relasi peserta didik
│   ├── mapelController.js      # CRUD Mata Pelajaran & penugasan guru
│   ├── nilaiController.js      # CRUD Penilaian, kalkulasi bobot & rapor
│   ├── jadwalController.js     # CRUD Jadwal belajar mengajar mingguan
│   └── profileController.js    # Pengelolaan biodata & ganti password
├── database/
│   ├── initDb.js               # Script runner inisialisasi database
│   └── sia_sekolah.sql         # Schema DDL + Data Dummy terenkripsi
├── middleware/
│   └── auth.js                 # Proteksi rute session & RBAC (Role-Based)
├── models/
│   ├── User.js                 # Model query pengguna & bcrypt helper
│   ├── Siswa.js                # Model query data siswa
│   ├── Guru.js                 # Model query data guru
│   ├── Kelas.js                # Model query rombel/kelas
│   ├── Mapel.js                # Model query mata pelajaran
│   ├── Nilai.js                # Model query penilaian & kalkulasi KKM
│   └── Jadwal.js               # Model query jadwal mingguan
├── public/
│   ├── css/
│   │   └── style.css           # Desain modern SaaS, responsive layout
│   └── js/
│       └── main.js             # Script SweetAlert konfirmasi hapus, toggle, calculator
├── routes/
│   ├── authRoutes.js           # Rute /auth
│   ├── dashboardRoutes.js      # Rute /dashboard
│   ├── siswaRoutes.js          # Rute /siswa
│   ├── guruRoutes.js           # Rute /guru
│   ├── kelasRoutes.js          # Rute /kelas
│   ├── mapelRoutes.js          # Rute /mapel
│   ├── nilaiRoutes.js          # Rute /nilai
│   ├── jadwalRoutes.js         # Rute /jadwal
│   └── profileRoutes.js        # Rute /profile
├── tests/
│   ├── testApp.js              # Script pengujian fitur otomatis (32 tests)
│   └── testHttp.js             # Script probe HTTP server endpoint
├── views/
│   ├── auth/login.ejs          # Tampilan login dengan tombol demo
│   ├── dashboard/index.ejs     # Tampilan dashboard & visualisasi chart
│   ├── error/
│   │   ├── 403.ejs             # Akses ditolak (Forbidden)
│   │   └── 404.ejs             # Halaman tidak ditemukan
│   ├── guru/                   # Views data guru (index, create, edit, detail)
│   ├── jadwal/                 # Views jadwal pelajaran (index, create, edit)
│   ├── kelas/                  # Views kelas (index, create, edit, detail)
│   ├── layouts/
│   │   ├── footer.ejs          # Script CDN Chart.js, SweetAlert, Bootstrap
│   │   ├── header.ejs          # Meta tags & CSS bundle
│   │   ├── navbar.ejs          # Topbar breadcrumb & user avatar menu
│   │   └── sidebar.ejs         # Navigasi kiri SaaS dinamis sesuai role
│   ├── mapel/                  # Views mapel (index, create, edit)
│   ├── nilai/                  # Views penilaian & rapor siswa
│   ├── profile/index.ejs       # Views profil akun & ganti password
│   └── siswa/                  # Views data siswa (index, create, edit, detail)
├── .dockerignore               # Berkas yang diabaikan saat build Docker
├── .env.example                # Template variabel lingkungan
├── .env                        # Variabel lingkungan aktif
├── .gitignore                  # Berkas yang diabaikan oleh Git
├── Dockerfile                  # Spesifikasi image container Node.js
├── docker-compose.yml          # Multi-container orchestration (App + MySQL)
├── package.json                # Manifest dependensi & script proyek
└── server.js                   # Entry point aplikasi Express.js
```

---

## 🔒 Konfigurasi Keamanan & Best Practices

1. **Password Hashing**: Menggunakan `bcryptjs` dengan salt rounds standar industri. Password plain-text tidak pernah disimpan ke basis data.
2. **Prepared Statements**: Seluruh query SQL menggunakan parameterized queries (`?`) melalui pool `mysql2/promise` untuk mencegah celah **SQL Injection**.
3. **Role-Based Access Control (RBAC)**: Rute-rute sensitif (seperti penambahan guru/siswa/kelas) dilindungi middleware `hasRole(['admin'])`. Jika peran tidak sesuai, sistem merender halaman `403 Forbidden`.
4. **Environment Variables**: Seluruh kredensial database dan session secret disimpan di `.env` dan tidak di-*hardcode*.
5. **Data Protection**: Konfirmasi modal SweetAlert2 sebelum menghapus data untuk mencegah penghapusan data secara tidak sengaja.

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan akademik dan pembelajaran Cloud Computing dengan Docker. Bebas digunakan dan dikembangkan lebih lanjut.

