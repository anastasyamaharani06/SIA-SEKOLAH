const Nilai = require('../models/Nilai');
const Siswa = require('../models/Siswa');
const Mapel = require('../models/Mapel');
const Kelas = require('../models/Kelas');
const Guru = require('../models/Guru');

const nilaiController = {
  async index(req, res) {
    try {
      const user = req.session.user;

      // If logged in as siswa, redirect to their personal grades view
      if (user.role === 'siswa') {
        return res.redirect('/nilai/saya');
      }

      const page = parseInt(req.query.page, 10) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const search = req.query.search || '';
      const mapel_id = req.query.mapel_id || '';
      const kelas_id = req.query.kelas_id || '';
      const semester = req.query.semester || '';
      const tahun_ajaran = req.query.tahun_ajaran || '';

      const [nilaiList, totalCount, mapelList, kelasList, summaryStats] = await Promise.all([
        Nilai.getAll({ search, mapel_id, kelas_id, semester, tahun_ajaran, limit, offset }),
        Nilai.count({ search, mapel_id, kelas_id, semester, tahun_ajaran }),
        Mapel.getAllSimple(),
        Kelas.getAllSimple(),
        Nilai.getSummaryStats()
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.render('nilai/index', {
        title: 'Manajemen Penilaian Akademik',
        nilaiList,
        mapelList,
        kelasList,
        summaryStats,
        currentPage: page,
        totalPages,
        totalCount,
        filters: { search, mapel_id, kelas_id, semester, tahun_ajaran }
      });
    } catch (error) {
      console.error('[Nilai Index Error]', error);
      req.flash('error', 'Gagal memuat data nilai.');
      res.redirect('/dashboard');
    }
  },

  async showCreate(req, res) {
    try {
      const [siswaList, mapelList, kelasList] = await Promise.all([
        Siswa.getAll({ limit: 100 }),
        Mapel.getAllSimple(),
        Kelas.getAllSimple()
      ]);

      res.render('nilai/create', {
        title: 'Input Nilai Siswa',
        siswaList,
        mapelList,
        kelasList,
        formData: {}
      });
    } catch (error) {
      console.error('[Nilai Create Error]', error);
      req.flash('error', 'Gagal memuat form input nilai.');
      res.redirect('/nilai');
    }
  },

  async create(req, res) {
    try {
      const { siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas } = req.body;

      if (!siswa_id || !mapel_id || !semester || !tahun_ajaran) {
        req.flash('error', 'Siswa, Mata Pelajaran, Semester, dan Tahun Ajaran wajib diisi.');
        return res.redirect('/nilai/create');
      }

      await Nilai.create({
        siswa_id,
        mapel_id,
        semester,
        tahun_ajaran,
        nilai_tugas: parseFloat(nilai_tugas) || 0,
        nilai_uts: parseFloat(nilai_uts) || 0,
        nilai_uas: parseFloat(nilai_uas) || 0
      });

      req.flash('success', 'Data nilai berhasil disimpan.');
      res.redirect('/nilai');
    } catch (error) {
      console.error('[Nilai Store Error]', error);
      req.flash('error', 'Gagal menyimpan nilai.');
      res.redirect('/nilai/create');
    }
  },

  async showEdit(req, res) {
    try {
      const { id } = req.params;
      const [nilai, siswaList, mapelList] = await Promise.all([
        Nilai.getById(id),
        Siswa.getAll({ limit: 100 }),
        Mapel.getAllSimple()
      ]);

      if (!nilai) {
        req.flash('error', 'Data nilai tidak ditemukan.');
        return res.redirect('/nilai');
      }

      res.render('nilai/edit', {
        title: 'Edit Nilai Siswa',
        nilai,
        siswaList,
        mapelList
      });
    } catch (error) {
      console.error('[Nilai Edit Error]', error);
      req.flash('error', 'Gagal memuat form edit nilai.');
      res.redirect('/nilai');
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas } = req.body;

      if (!siswa_id || !mapel_id || !semester || !tahun_ajaran) {
        req.flash('error', 'Siswa, Mata Pelajaran, Semester, dan Tahun Ajaran wajib diisi.');
        return res.redirect(`/nilai/edit/${id}`);
      }

      await Nilai.update(id, {
        siswa_id,
        mapel_id,
        semester,
        tahun_ajaran,
        nilai_tugas: parseFloat(nilai_tugas) || 0,
        nilai_uts: parseFloat(nilai_uts) || 0,
        nilai_uas: parseFloat(nilai_uas) || 0
      });

      req.flash('success', 'Data nilai berhasil diperbarui.');
      res.redirect('/nilai');
    } catch (error) {
      console.error('[Nilai Update Error]', error);
      req.flash('error', 'Gagal memperbarui nilai.');
      res.redirect(`/nilai/edit/${req.params.id}`);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const nilai = await Nilai.getById(id);
      if (!nilai) {
        req.flash('error', 'Data nilai tidak ditemukan.');
        return res.redirect('/nilai');
      }

      await Nilai.delete(id);
      req.flash('success', 'Data nilai berhasil dihapus.');
      res.redirect('/nilai');
    } catch (error) {
      console.error('[Nilai Delete Error]', error);
      req.flash('error', 'Gagal menghapus nilai.');
      res.redirect('/nilai');
    }
  },

  async siswaView(req, res) {
    try {
      const user = req.session.user;
      let siswaId = null;

      if (user.role === 'siswa') {
        const siswa = await Siswa.getByUserId(user.id);
        if (!siswa) {
          req.flash('error', 'Profil siswa tidak ditemukan untuk akun ini.');
          return res.redirect('/dashboard');
        }
        siswaId = siswa.id;
      } else {
        // Admin or teacher checking a specific student
        siswaId = req.query.siswa_id;
        if (!siswaId) {
          return res.redirect('/nilai');
        }
      }

      const semester = req.query.semester || '';
      const tahun_ajaran = req.query.tahun_ajaran || '';

      const [siswa, nilaiList] = await Promise.all([
        Siswa.getById(siswaId),
        Nilai.getBySiswaId(siswaId, { semester, tahun_ajaran })
      ]);

      // Calculate GPA / summary
      let totalAkhir = 0;
      nilaiList.forEach(n => {
        totalAkhir += parseFloat(n.nilai_akhir || 0);
      });
      const rataRata = nilaiList.length > 0 ? (totalAkhir / nilaiList.length).toFixed(2) : 0;

      res.render('nilai/siswa_view', {
        title: `Rapor & Nilai - ${siswa.nama}`,
        siswa,
        nilaiList,
        rataRata,
        filters: { semester, tahun_ajaran }
      });
    } catch (error) {
      console.error('[Siswa View Error]', error);
      req.flash('error', 'Gagal memuat rapor siswa.');
      res.redirect('/dashboard');
    }
  }
};

module.exports = nilaiController;

