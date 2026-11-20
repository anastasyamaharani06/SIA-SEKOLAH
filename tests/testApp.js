require('dotenv').config();
const { pool } = require('../config/database');
const User = require('../models/User');
const Siswa = require('../models/Siswa');
const Guru = require('../models/Guru');
const Kelas = require('../models/Kelas');
const Mapel = require('../models/Mapel');
const Nilai = require('../models/Nilai');
const Jadwal = require('../models/Jadwal');

async function runTests() {
  console.log('========================================================');
  console.log('🧪 MEMULAI PENGUJIAN OTOMATIS FITUR SIA SEKOLAH');
  console.log('========================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Test Database Connectivity
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    assert(rows[0].solution === 2, 'Koneksi database aktif dan merespon query');

    // 2. Test User Authentication
    const adminUser = await User.findByUsernameOrEmail('admin');
    assert(adminUser !== null, 'Pengguna admin ditemukan di database');
    const isAdminMatch = await User.comparePassword('admin123', adminUser.password);
    assert(isAdminMatch === true, 'Verifikasi password bcrypt untuk admin (admin123) berhasil');

    const guruUser = await User.findByUsernameOrEmail('budi_santoso');
    assert(guruUser !== null && guruUser.role === 'guru', 'Pengguna guru ditemukan dengan role guru');
    const isGuruMatch = await User.comparePassword('guru123', guruUser.password);
    assert(isGuruMatch === true, 'Verifikasi password bcrypt untuk guru (guru123) berhasil');

    const siswaUser = await User.findByUsernameOrEmail('ahmad_fauzi');
    assert(siswaUser !== null && siswaUser.role === 'siswa', 'Pengguna siswa ditemukan dengan role siswa');
    const isSiswaMatch = await User.comparePassword('siswa123', siswaUser.password);
    assert(isSiswaMatch === true, 'Verifikasi password bcrypt untuk siswa (siswa123) berhasil');

    const invalidMatch = await User.comparePassword('salahPassword', adminUser.password);
    assert(invalidMatch === false, 'Password salah berhasil ditolak oleh sistem autentikasi');

    // 3. Test Dashboard Statistics
    const totalSiswa = await Siswa.count();
    const totalGuru = await Guru.count();
    const totalKelas = await Kelas.count();
    const totalMapel = await Mapel.count();
    assert(totalSiswa >= 5, `Total siswa terhitung (${totalSiswa} siswa)`);
    assert(totalGuru >= 4, `Total guru terhitung (${totalGuru} guru)`);
    assert(totalKelas >= 4, `Total kelas terhitung (${totalKelas} kelas)`);
    assert(totalMapel >= 5, `Total mapel terhitung (${totalMapel} mapel)`);

    // 4. Test CRUD Siswa
    console.log('\n--- Uji CRUD Siswa ---');
    const newSiswaId = await Siswa.create({
      nis: '999001',
      nisn: '0099999001',
      nama: 'Testing Siswa Baru',
      jenis_kelamin: 'L',
      tanggal_lahir: '2008-01-01',
      alamat: 'Jl. Testing No. 123',
      kelas_id: 1,
      no_telp: '0899999999'
    });
    assert(newSiswaId > 0, `Berhasil membuat siswa baru (ID: ${newSiswaId})`);

    const fetchedSiswa = await Siswa.getById(newSiswaId);
    assert(fetchedSiswa && fetchedSiswa.nama === 'Testing Siswa Baru', 'Data siswa berhasil dibaca dari DB');

    await Siswa.update(newSiswaId, {
      nis: '999001',
      nisn: '0099999001',
      nama: 'Testing Siswa Updated',
      jenis_kelamin: 'L',
      tanggal_lahir: '2008-01-01',
      alamat: 'Jl. Testing No. 123 Baru',
      kelas_id: 2,
      no_telp: '0899999999'
    });
    const updatedSiswa = await Siswa.getById(newSiswaId);
    assert(updatedSiswa.nama === 'Testing Siswa Updated' && updatedSiswa.kelas_id === 2, 'Data siswa berhasil diperbarui');

    await Siswa.delete(newSiswaId);
    const deletedSiswa = await Siswa.getById(newSiswaId);
    assert(deletedSiswa === null, 'Data siswa berhasil dihapus');

    // 5. Test CRUD Guru
    console.log('\n--- Uji CRUD Guru ---');
    const newGuruId = await Guru.create({
      nip: '199501012022011099',
      nama: 'Testing Guru Baru, S.Kom.',
      jenis_kelamin: 'L',
      alamat: 'Jl. Pengajar No. 1',
      no_telp: '0811111199'
    });
    assert(newGuruId > 0, `Berhasil membuat guru baru (ID: ${newGuruId})`);

    await Guru.update(newGuruId, {
      nip: '199501012022011099',
      nama: 'Testing Guru Updated, M.Kom.',
      jenis_kelamin: 'L',
      alamat: 'Jl. Pengajar No. 1 Updated',
      no_telp: '0811111199'
    });
    const updatedGuru = await Guru.getById(newGuruId);
    assert(updatedGuru.nama === 'Testing Guru Updated, M.Kom.', 'Data guru berhasil diperbarui');

    await Guru.delete(newGuruId);
    const deletedGuru = await Guru.getById(newGuruId);
    assert(deletedGuru === null, 'Data guru berhasil dihapus');

    // 6. Test CRUD Kelas
    console.log('\n--- Uji CRUD Kelas ---');
    const newKelasId = await Kelas.create({
      nama_kelas: 'XII MIPA 3',
      tingkat: 'XII',
      wali_kelas_id: 1,
      tahun_ajaran: '2024/2025'
    });
    assert(newKelasId > 0, `Berhasil membuat kelas baru (ID: ${newKelasId})`);

    const studentsInClass = await Kelas.getStudentsByKelasId(1);
    assert(Array.isArray(studentsInClass), 'Berhasil mengambil daftar siswa berdasarkan kelas');

    await Kelas.delete(newKelasId);
    const deletedKelas = await Kelas.getById(newKelasId);
    assert(deletedKelas === null, 'Data kelas berhasil dihapus');

    // 7. Test CRUD Mapel
    console.log('\n--- Uji CRUD Mata Pelajaran ---');
    const newMapelId = await Mapel.create({
      kode_mapel: 'MP-TEST-99',
      nama_mapel: 'Cloud Computing & DevOps',
      kategori: 'Peminatan',
      guru_id: 3
    });
    assert(newMapelId > 0, `Berhasil membuat mata pelajaran baru (ID: ${newMapelId})`);

    await Mapel.delete(newMapelId);
    const deletedMapel = await Mapel.getById(newMapelId);
    assert(deletedMapel === null, 'Data mata pelajaran berhasil dihapus');

    // 8. Test Nilai Calculation & CRUD
    console.log('\n--- Uji Perhitungan dan CRUD Nilai ---');
    // Test formula: 80 * 0.3 + 90 * 0.3 + 85 * 0.4 = 24 + 27 + 34 = 85.00
    const calc = Nilai.calculateGrade(80, 90, 85);
    assert(calc.nilai_akhir === 85.00, `Perhitungan nilai akhir tepat (85.00): ${calc.nilai_akhir}`);
    assert(calc.predikat === 'B+', `Predikat tepat (B+): ${calc.predikat}`);
    assert(calc.keterangan === 'Sangat Baik (Lulus)', `Keterangan tepat: ${calc.keterangan}`);

    const newNilaiId = await Nilai.create({
      siswa_id: 1,
      mapel_id: 4,
      semester: 'Ganjil',
      tahun_ajaran: '2024/2025',
      nilai_tugas: 80,
      nilai_uts: 90,
      nilai_uas: 85
    });
    assert(newNilaiId > 0, `Berhasil menyimpan nilai siswa (ID: ${newNilaiId})`);

    const fetchedNilai = await Nilai.getById(newNilaiId);
    assert(fetchedNilai && parseFloat(fetchedNilai.nilai_akhir) === 85.00, 'Nilai tersimpan dan dihitung di database dengan benar');

    await Nilai.delete(newNilaiId);
    const deletedNilai = await Nilai.getById(newNilaiId);
    assert(deletedNilai === null, 'Data nilai berhasil dihapus');

    // 9. Test CRUD Jadwal
    console.log('\n--- Uji CRUD Jadwal Pelajaran ---');
    const newJadwalId = await Jadwal.create({
      kelas_id: 1,
      mapel_id: 1,
      guru_id: 1,
      hari: 'Jumat',
      jam_mulai: '08:00:00',
      jam_selesai: '09:30:00',
      ruangan: 'Lab Cloud 2'
    });
    assert(newJadwalId > 0, `Berhasil menambahkan jadwal pelajaran (ID: ${newJadwalId})`);

    await Jadwal.delete(newJadwalId);
    const deletedJadwal = await Jadwal.getById(newJadwalId);
    assert(deletedJadwal === null, 'Data jadwal berhasil dihapus');

    console.log('\n========================================================');
    console.log(`🎉 PENGUJIAN SELESAI: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Error saat menjalankan pengujian:', error);
    process.exit(1);
  }
}

runTests();

