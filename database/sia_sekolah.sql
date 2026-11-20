-- ========================================================
-- Database: sia_sekolah
-- Sistem Informasi Akademik Sekolah (SIA)
-- ========================================================

CREATE DATABASE IF NOT EXISTS sia_sekolah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sia_sekolah;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'guru', 'siswa') NOT NULL DEFAULT 'siswa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Guru
CREATE TABLE IF NOT EXISTS guru (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL UNIQUE,
  nip VARCHAR(30) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  jenis_kelamin ENUM('L', 'P') NOT NULL,
  alamat TEXT,
  no_telp VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_guru_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. Tabel Kelas
CREATE TABLE IF NOT EXISTS kelas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kelas VARCHAR(50) NOT NULL,
  tingkat VARCHAR(10) NOT NULL,
  wali_kelas_id INT NULL,
  tahun_ajaran VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kelas_wali FOREIGN KEY (wali_kelas_id) REFERENCES guru(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Tabel Siswa
CREATE TABLE IF NOT EXISTS siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL UNIQUE,
  nis VARCHAR(20) NOT NULL UNIQUE,
  nisn VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  jenis_kelamin ENUM('L', 'P') NOT NULL,
  tanggal_lahir DATE NOT NULL,
  alamat TEXT,
  kelas_id INT NULL,
  no_telp VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_siswa_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_siswa_kelas FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Tabel Mata Pelajaran
CREATE TABLE IF NOT EXISTS mata_pelajaran (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_mapel VARCHAR(20) NOT NULL UNIQUE,
  nama_mapel VARCHAR(100) NOT NULL,
  kategori ENUM('Wajib', 'Peminatan', 'Muatan Lokal') DEFAULT 'Wajib',
  guru_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mapel_guru FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Tabel Nilai
CREATE TABLE IF NOT EXISTS nilai (
  id INT AUTO_INCREMENT PRIMARY KEY,
  siswa_id INT NOT NULL,
  mapel_id INT NOT NULL,
  semester ENUM('Ganjil', 'Genap') NOT NULL,
  tahun_ajaran VARCHAR(20) NOT NULL,
  nilai_tugas DECIMAL(5,2) DEFAULT 0.00,
  nilai_uts DECIMAL(5,2) DEFAULT 0.00,
  nilai_uas DECIMAL(5,2) DEFAULT 0.00,
  nilai_akhir DECIMAL(5,2) DEFAULT 0.00,
  predikat VARCHAR(5) DEFAULT '-',
  keterangan VARCHAR(100) DEFAULT '-',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_nilai_siswa FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_nilai_mapel FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. Tabel Jadwal Pelajaran
CREATE TABLE IF NOT EXISTS jadwal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kelas_id INT NOT NULL,
  mapel_id INT NOT NULL,
  guru_id INT NOT NULL,
  hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  ruangan VARCHAR(50) DEFAULT 'Ruang Kelas',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_jadwal_kelas FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_jadwal_mapel FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_jadwal_guru FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ========================================================
-- DATA DUMMY (SEEDS)
-- Password untuk admin : admin123
-- Password untuk guru  : guru123
-- Password untuk siswa : siswa123
-- ========================================================

-- Insert Users
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@sekolah.sch.id', '$2a$10$B7NMuvsWx8pMVQQc1yYWaOPefydQjKj49v3i0jReH6v8H/Jq9o9fO', 'admin'),
(2, 'budi_santoso', 'budi.santoso@sekolah.sch.id', '$2a$10$dCGclZERPjSEGUdz5NeBWui92cD9g0Sm43GwisM3UtWLml3kphGb.', 'guru'),
(3, 'siti_aminah', 'siti.aminah@sekolah.sch.id', '$2a$10$dCGclZERPjSEGUdz5NeBWui92cD9g0Sm43GwisM3UtWLml3kphGb.', 'guru'),
(4, 'hendra_wijaya', 'hendra.wijaya@sekolah.sch.id', '$2a$10$dCGclZERPjSEGUdz5NeBWui92cD9g0Sm43GwisM3UtWLml3kphGb.', 'guru'),
(5, 'dewi_lestari', 'dewi.lestari@sekolah.sch.id', '$2a$10$dCGclZERPjSEGUdz5NeBWui92cD9g0Sm43GwisM3UtWLml3kphGb.', 'guru'),
(6, 'ahmad_fauzi', 'ahmad.fauzi@siswa.sch.id', '$2a$10$/D0IOrf7KVwic6PjzBK8hewZmNoEo4iMOEC5Iy1iUqRubbkaLNLq2', 'siswa'),
(7, 'nur_hidayah', 'nur.hidayah@siswa.sch.id', '$2a$10$/D0IOrf7KVwic6PjzBK8hewZmNoEo4iMOEC5Iy1iUqRubbkaLNLq2', 'siswa'),
(8, 'rizky_pratama', 'rizky.pratama@siswa.sch.id', '$2a$10$/D0IOrf7KVwic6PjzBK8hewZmNoEo4iMOEC5Iy1iUqRubbkaLNLq2', 'siswa'),
(9, 'anisa_rahma', 'anisa.rahma@siswa.sch.id', '$2a$10$/D0IOrf7KVwic6PjzBK8hewZmNoEo4iMOEC5Iy1iUqRubbkaLNLq2', 'siswa'),
(10, 'dimas_anggar', 'dimas.anggar@siswa.sch.id', '$2a$10$/D0IOrf7KVwic6PjzBK8hewZmNoEo4iMOEC5Iy1iUqRubbkaLNLq2', 'siswa')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Insert Guru
INSERT INTO guru (id, user_id, nip, nama, jenis_kelamin, alamat, no_telp) VALUES
(1, 2, '198501152010011001', 'Drs. Budi Santoso, M.Pd.', 'L', 'Jl. Merdeka No. 12, Bandung', '081234567890'),
(2, 3, '198807202012022003', 'Siti Aminah, S.Pd.', 'P', 'Jl. Diponegoro No. 45, Bandung', '081234567891'),
(3, 4, '199003122015031005', 'Hendra Wijaya, M.Kom.', 'L', 'Jl. Cempaka No. 8, Cimahi', '081234567892'),
(4, 5, '199205182018022004', 'Dewi Lestari, S.Pd.', 'P', 'Jl. Sukajadi No. 99, Bandung', '081234567893')
ON DUPLICATE KEY UPDATE nama=VALUES(nama);

-- Insert Kelas
INSERT INTO kelas (id, nama_kelas, tingkat, wali_kelas_id, tahun_ajaran) VALUES
(1, 'X MIPA 1', 'X', 1, '2024/2025'),
(2, 'X MIPA 2', 'X', 2, '2024/2025'),
(3, 'XI MIPA 1', 'XI', 3, '2024/2025'),
(4, 'XII MIPA 1', 'XII', 4, '2024/2025')
ON DUPLICATE KEY UPDATE nama_kelas=VALUES(nama_kelas);

-- Insert Siswa
INSERT INTO siswa (id, user_id, nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id, no_telp) VALUES
(1, 6, '240101', '0071234561', 'Ahmad Fauzi', 'L', '2008-04-12', 'Jl. Gatsu No. 15, Bandung', 1, '085712345671'),
(2, 7, '240102', '0071234562', 'Nur Hidayah', 'P', '2008-08-25', 'Jl. Riau No. 40, Bandung', 1, '085712345672'),
(3, 8, '240103', '0071234563', 'Rizky Pratama', 'L', '2008-02-14', 'Jl. Asia Afrika No. 7, Bandung', 1, '085712345673'),
(4, 9, '240104', '0071234564', 'Anisa Rahmawati', 'P', '2008-11-03', 'Jl. Buah Batu No. 88, Bandung', 2, '085712345674'),
(5, 10, '240105', '0071234565', 'Dimas Anggara', 'L', '2008-06-19', 'Jl. Soekarno Hatta No. 120, Bandung', 2, '085712345675')
ON DUPLICATE KEY UPDATE nama=VALUES(nama);

-- Insert Mata Pelajaran
INSERT INTO mata_pelajaran (id, kode_mapel, nama_mapel, kategori, guru_id) VALUES
(1, 'MP-MAT-01', 'Matematika Wajib', 'Wajib', 1),
(2, 'MP-BIN-01', 'Bahasa Indonesia', 'Wajib', 2),
(3, 'MP-TIK-01', 'Informatika & Cloud', 'Peminatan', 3),
(4, 'MP-ENG-01', 'Bahasa Inggris', 'Wajib', 4),
(5, 'MP-FIS-01', 'Fisika Dasar', 'Peminatan', 1)
ON DUPLICATE KEY UPDATE nama_mapel=VALUES(nama_mapel);

-- Insert Nilai
INSERT INTO nilai (id, siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir, predikat, keterangan) VALUES
(1, 1, 1, 'Ganjil', '2024/2025', 85.00, 80.00, 88.00, 84.70, 'B+', 'Sangat Baik (Lulus)'),
(2, 1, 2, 'Ganjil', '2024/2025', 90.00, 85.00, 92.00, 89.30, 'A', 'Istimewa (Lulus)'),
(3, 1, 3, 'Ganjil', '2024/2025', 95.00, 90.00, 95.00, 93.50, 'A', 'Istimewa (Lulus)'),
(4, 2, 1, 'Ganjil', '2024/2025', 78.00, 75.00, 80.00, 77.90, 'B', 'Baik (Lulus)'),
(5, 2, 3, 'Ganjil', '2024/2025', 88.00, 85.00, 90.00, 87.90, 'A-', 'Sangat Baik (Lulus)'),
(6, 3, 1, 'Ganjil', '2024/2025', 70.00, 68.00, 72.00, 70.20, 'C+', 'Cukup (Lulus)'),
(7, 4, 2, 'Ganjil', '2024/2025', 92.00, 88.00, 90.00, 90.00, 'A', 'Istimewa (Lulus)'),
(8, 5, 3, 'Ganjil', '2024/2025', 84.00, 82.00, 86.00, 84.20, 'B+', 'Sangat Baik (Lulus)')
ON DUPLICATE KEY UPDATE nilai_akhir=VALUES(nilai_akhir);

-- Insert Jadwal
INSERT INTO jadwal (id, kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan) VALUES
(1, 1, 1, 1, 'Senin', '07:30:00', '09:00:00', 'Lab Komputer 1'),
(2, 1, 2, 2, 'Senin', '09:15:00', '10:45:00', 'Ruang Kelas X-1'),
(3, 1, 3, 3, 'Selasa', '08:00:00', '10:00:00', 'Lab Cloud Server'),
(4, 1, 4, 4, 'Rabu', '07:30:00', '09:00:00', 'Ruang Bahasa'),
(5, 2, 1, 1, 'Selasa', '10:15:00', '11:45:00', 'Ruang Kelas X-2'),
(6, 2, 3, 3, 'Kamis', '08:00:00', '10:00:00', 'Lab Cloud Server')
ON DUPLICATE KEY UPDATE ruangan=VALUES(ruangan);

