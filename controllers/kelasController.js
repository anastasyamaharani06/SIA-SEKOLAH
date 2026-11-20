const Kelas = require('../models/Kelas');
const Guru = require('../models/Guru');
const Siswa = require('../models/Siswa');
const Jadwal = require('../models/Jadwal');

const kelasController = {
  async index(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';

      const [kelasList, totalCount] = await Promise.all([
        Kelas.getAll({ search, limit, offset }),
        Kelas.count({ search })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.render('kelas/index', {
        title: 'Manajemen Data Kelas',
        kelasList,
        currentPage: page,
        totalPages,
        totalCount,
        search
      });
    } catch (error) {
      console.error('[Kelas Index Error]', error);
      req.flash('error', 'Gagal memuat data kelas.');
      res.redirect('/dashboard');
    }
  },

  async showCreate(req, res) {
    try {
      const guruList = await Guru.getAllSimple();
      res.render('kelas/create', {
        title: 'Tambah Kelas Baru',
        guruList,
        formData: {}
      });
    } catch (error) {
      console.error('[Kelas Create Error]', error);
      req.flash('error', 'Gagal memuat form tambah kelas.');
      res.redirect('/kelas');
    }
  },

  async create(req, res) {
    try {
      const { nama_kelas, tingkat, wali_kelas_id, tahun_ajaran } = req.body;

      if (!nama_kelas || !tingkat || !tahun_ajaran) {
        req.flash('error', 'Nama Kelas, Tingkat, dan Tahun Ajaran wajib diisi.');
        const guruList = await Guru.getAllSimple();
        return res.render('kelas/create', {
          title: 'Tambah Kelas Baru',
          guruList,
          formData: req.body
        });
      }

      await Kelas.create({
        nama_kelas,
        tingkat,
        wali_kelas_id: wali_kelas_id || null,
        tahun_ajaran
      });

      req.flash('success', `Kelas '${nama_kelas}' berhasil ditambahkan.`);
      res.redirect('/kelas');
    } catch (error) {
      console.error('[Kelas Store Error]', error);
      req.flash('error', 'Gagal menyimpan data kelas.');
      const guruList = await Guru.getAllSimple();
      res.render('kelas/create', {
        title: 'Tambah Kelas Baru',
        guruList,
        formData: req.body
      });
    }
  },

  async showEdit(req, res) {
    try {
      const { id } = req.params;
      const [kelas, guruList] = await Promise.all([
        Kelas.getById(id),
        Guru.getAllSimple()
      ]);

      if (!kelas) {
        req.flash('error', 'Data kelas tidak ditemukan.');
        return res.redirect('/kelas');
      }

      res.render('kelas/edit', {
        title: `Edit Kelas - ${kelas.nama_kelas}`,
        kelas,
        guruList
      });
    } catch (error) {
      console.error('[Kelas Edit Error]', error);
      req.flash('error', 'Gagal memuat data kelas.');
      res.redirect('/kelas');
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nama_kelas, tingkat, wali_kelas_id, tahun_ajaran } = req.body;

      if (!nama_kelas || !tingkat || !tahun_ajaran) {
        req.flash('error', 'Nama Kelas, Tingkat, dan Tahun Ajaran wajib diisi.');
        return res.redirect(`/kelas/edit/${id}`);
      }

      await Kelas.update(id, {
        nama_kelas,
        tingkat,
        wali_kelas_id: wali_kelas_id || null,
        tahun_ajaran
      });

      req.flash('success', `Kelas '${nama_kelas}' berhasil diperbarui.`);
      res.redirect('/kelas');
    } catch (error) {
      console.error('[Kelas Update Error]', error);
      req.flash('error', 'Gagal memperbarui data kelas.');
      res.redirect(`/kelas/edit/${req.params.id}`);
    }
  },

  async showDetail(req, res) {
    try {
      const { id } = req.params;
      const [kelas, siswaList, jadwalList] = await Promise.all([
        Kelas.getById(id),
        Kelas.getStudentsByKelasId(id),
        Jadwal.getByKelasId(id)
      ]);

      if (!kelas) {
        req.flash('error', 'Data kelas tidak ditemukan.');
        return res.redirect('/kelas');
      }

      res.render('kelas/detail', {
        title: `Detail Kelas - ${kelas.nama_kelas}`,
        kelas,
        siswaList,
        jadwalList
      });
    } catch (error) {
      console.error('[Kelas Detail Error]', error);
      req.flash('error', 'Gagal memuat detail kelas.');
      res.redirect('/kelas');
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const kelas = await Kelas.getById(id);
      if (!kelas) {
        req.flash('error', 'Data kelas tidak ditemukan.');
        return res.redirect('/kelas');
      }

      await Kelas.delete(id);
      req.flash('success', `Kelas '${kelas.nama_kelas}' berhasil dihapus.`);
      res.redirect('/kelas');
    } catch (error) {
      console.error('[Kelas Delete Error]', error);
      req.flash('error', 'Gagal menghapus data kelas.');
      res.redirect('/kelas');
    }
  }
};

module.exports = kelasController;

