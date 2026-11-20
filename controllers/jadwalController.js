const Jadwal = require('../models/Jadwal');
const Kelas = require('../models/Kelas');
const Mapel = require('../models/Mapel');
const Guru = require('../models/Guru');

const jadwalController = {
  async index(req, res) {
    try {
      const user = req.session.user;
      let kelas_id = req.query.kelas_id || '';
      let hari = req.query.hari || '';
      let guru_id = req.query.guru_id || '';

      // If logged in as siswa, default to student's class
      if (user.role === 'siswa' && user.detail?.kelas_id) {
        kelas_id = user.detail.kelas_id;
      }

      // If logged in as guru, default to guru's schedule if no filter
      if (user.role === 'guru' && user.detail?.id && !kelas_id && !guru_id) {
        guru_id = user.detail.id;
      }

      const [jadwalList, kelasList, guruList] = await Promise.all([
        Jadwal.getAll({ kelas_id, hari, guru_id }),
        Kelas.getAllSimple(),
        Guru.getAllSimple()
      ]);

      res.render('jadwal/index', {
        title: 'Manajemen Jadwal Pelajaran',
        jadwalList,
        kelasList,
        guruList,
        filters: { kelas_id, hari, guru_id }
      });
    } catch (error) {
      console.error('[Jadwal Index Error]', error);
      req.flash('error', 'Gagal memuat jadwal pelajaran.');
      res.redirect('/dashboard');
    }
  },

  async showCreate(req, res) {
    try {
      const [kelasList, mapelList, guruList] = await Promise.all([
        Kelas.getAllSimple(),
        Mapel.getAllSimple(),
        Guru.getAllSimple()
      ]);

      res.render('jadwal/create', {
        title: 'Tambah Jadwal Pelajaran',
        kelasList,
        mapelList,
        guruList,
        formData: {}
      });
    } catch (error) {
      console.error('[Jadwal Create Error]', error);
      req.flash('error', 'Gagal memuat form tambah jadwal.');
      res.redirect('/jadwal');
    }
  },

  async create(req, res) {
    try {
      const { kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan } = req.body;

      if (!kelas_id || !mapel_id || !guru_id || !hari || !jam_mulai || !jam_selesai) {
        req.flash('error', 'Mohon lengkapi seluruh kolom formulir jadwal.');
        const [kelasList, mapelList, guruList] = await Promise.all([
          Kelas.getAllSimple(),
          Mapel.getAllSimple(),
          Guru.getAllSimple()
        ]);
        return res.render('jadwal/create', {
          title: 'Tambah Jadwal Pelajaran',
          kelasList,
          mapelList,
          guruList,
          formData: req.body
        });
      }

      await Jadwal.create({
        kelas_id,
        mapel_id,
        guru_id,
        hari,
        jam_mulai,
        jam_selesai,
        ruangan: ruangan || 'Ruang Kelas'
      });

      req.flash('success', 'Jadwal pelajaran berhasil ditambahkan.');
      res.redirect('/jadwal');
    } catch (error) {
      console.error('[Jadwal Store Error]', error);
      req.flash('error', 'Gagal menyimpan jadwal pelajaran.');
      res.redirect('/jadwal/create');
    }
  },

  async showEdit(req, res) {
    try {
      const { id } = req.params;
      const [jadwal, kelasList, mapelList, guruList] = await Promise.all([
        Jadwal.getById(id),
        Kelas.getAllSimple(),
        Mapel.getAllSimple(),
        Guru.getAllSimple()
      ]);

      if (!jadwal) {
        req.flash('error', 'Data jadwal tidak ditemukan.');
        return res.redirect('/jadwal');
      }

      res.render('jadwal/edit', {
        title: 'Edit Jadwal Pelajaran',
        jadwal,
        kelasList,
        mapelList,
        guruList
      });
    } catch (error) {
      console.error('[Jadwal Edit Error]', error);
      req.flash('error', 'Gagal memuat data jadwal.');
      res.redirect('/jadwal');
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan } = req.body;

      if (!kelas_id || !mapel_id || !guru_id || !hari || !jam_mulai || !jam_selesai) {
        req.flash('error', 'Mohon lengkapi seluruh kolom formulir jadwal.');
        return res.redirect(`/jadwal/edit/${id}`);
      }

      await Jadwal.update(id, {
        kelas_id,
        mapel_id,
        guru_id,
        hari,
        jam_mulai,
        jam_selesai,
        ruangan: ruangan || 'Ruang Kelas'
      });

      req.flash('success', 'Jadwal pelajaran berhasil diperbarui.');
      res.redirect('/jadwal');
    } catch (error) {
      console.error('[Jadwal Update Error]', error);
      req.flash('error', 'Gagal memperbarui jadwal pelajaran.');
      res.redirect(`/jadwal/edit/${req.params.id}`);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const jadwal = await Jadwal.getById(id);
      if (!jadwal) {
        req.flash('error', 'Data jadwal tidak ditemukan.');
        return res.redirect('/jadwal');
      }

      await Jadwal.delete(id);
      req.flash('success', 'Jadwal pelajaran berhasil dihapus.');
      res.redirect('/jadwal');
    } catch (error) {
      console.error('[Jadwal Delete Error]', error);
      req.flash('error', 'Gagal menghapus jadwal pelajaran.');
      res.redirect('/jadwal');
    }
  }
};

module.exports = jadwalController;

