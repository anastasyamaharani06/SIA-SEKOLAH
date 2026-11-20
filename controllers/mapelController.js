const Mapel = require('../models/Mapel');
const Guru = require('../models/Guru');

const mapelController = {
  async index(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';

      const [mapelList, totalCount] = await Promise.all([
        Mapel.getAll({ search, limit, offset }),
        Mapel.count({ search })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.render('mapel/index', {
        title: 'Manajemen Mata Pelajaran',
        mapelList,
        currentPage: page,
        totalPages,
        totalCount,
        search
      });
    } catch (error) {
      console.error('[Mapel Index Error]', error);
      req.flash('error', 'Gagal memuat data mata pelajaran.');
      res.redirect('/dashboard');
    }
  },

  async showCreate(req, res) {
    try {
      const guruList = await Guru.getAllSimple();
      res.render('mapel/create', {
        title: 'Tambah Mata Pelajaran Baru',
        guruList,
        formData: {}
      });
    } catch (error) {
      console.error('[Mapel Create Error]', error);
      req.flash('error', 'Gagal memuat form tambah mata pelajaran.');
      res.redirect('/mapel');
    }
  },

  async create(req, res) {
    try {
      const { kode_mapel, nama_mapel, kategori, guru_id } = req.body;

      if (!kode_mapel || !nama_mapel) {
        req.flash('error', 'Kode Mapel dan Nama Mata Pelajaran wajib diisi.');
        const guruList = await Guru.getAllSimple();
        return res.render('mapel/create', {
          title: 'Tambah Mata Pelajaran Baru',
          guruList,
          formData: req.body
        });
      }

      await Mapel.create({
        kode_mapel: kode_mapel.toUpperCase().trim(),
        nama_mapel: nama_mapel.trim(),
        kategori: kategori || 'Wajib',
        guru_id: guru_id || null
      });

      req.flash('success', `Mata pelajaran '${nama_mapel}' berhasil ditambahkan.`);
      res.redirect('/mapel');
    } catch (error) {
      console.error('[Mapel Store Error]', error);
      let errMsg = 'Gagal menyimpan mata pelajaran.';
      if (error.code === 'ER_DUP_ENTRY') {
        errMsg = 'Kode Mata Pelajaran sudah terdaftar.';
      }
      req.flash('error', errMsg);
      const guruList = await Guru.getAllSimple();
      res.render('mapel/create', {
        title: 'Tambah Mata Pelajaran Baru',
        guruList,
        formData: req.body
      });
    }
  },

  async showEdit(req, res) {
    try {
      const { id } = req.params;
      const [mapel, guruList] = await Promise.all([
        Mapel.getById(id),
        Guru.getAllSimple()
      ]);

      if (!mapel) {
        req.flash('error', 'Data mata pelajaran tidak ditemukan.');
        return res.redirect('/mapel');
      }

      res.render('mapel/edit', {
        title: `Edit Mata Pelajaran - ${mapel.nama_mapel}`,
        mapel,
        guruList
      });
    } catch (error) {
      console.error('[Mapel Edit Error]', error);
      req.flash('error', 'Gagal memuat data mata pelajaran.');
      res.redirect('/mapel');
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { kode_mapel, nama_mapel, kategori, guru_id } = req.body;

      if (!kode_mapel || !nama_mapel) {
        req.flash('error', 'Kode Mapel dan Nama Mata Pelajaran wajib diisi.');
        return res.redirect(`/mapel/edit/${id}`);
      }

      await Mapel.update(id, {
        kode_mapel: kode_mapel.toUpperCase().trim(),
        nama_mapel: nama_mapel.trim(),
        kategori: kategori || 'Wajib',
        guru_id: guru_id || null
      });

      req.flash('success', `Mata pelajaran '${nama_mapel}' berhasil diperbarui.`);
      res.redirect('/mapel');
    } catch (error) {
      console.error('[Mapel Update Error]', error);
      let errMsg = 'Gagal memperbarui data mata pelajaran.';
      if (error.code === 'ER_DUP_ENTRY') {
        errMsg = 'Kode Mata Pelajaran sudah digunakan.';
      }
      req.flash('error', errMsg);
      res.redirect(`/mapel/edit/${req.params.id}`);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const mapel = await Mapel.getById(id);
      if (!mapel) {
        req.flash('error', 'Data mata pelajaran tidak ditemukan.');
        return res.redirect('/mapel');
      }

      await Mapel.delete(id);
      req.flash('success', `Mata pelajaran '${mapel.nama_mapel}' berhasil dihapus.`);
      res.redirect('/mapel');
    } catch (error) {
      console.error('[Mapel Delete Error]', error);
      req.flash('error', 'Gagal menghapus mata pelajaran.');
      res.redirect('/mapel');
    }
  }
};

module.exports = mapelController;

