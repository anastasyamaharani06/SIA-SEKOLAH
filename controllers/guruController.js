const Guru = require('../models/Guru');
const User = require('../models/User');
const Mapel = require('../models/Mapel');
const Jadwal = require('../models/Jadwal');

const guruController = {
  async index(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';

      const [guruList, totalCount] = await Promise.all([
        Guru.getAll({ search, limit, offset }),
        Guru.count({ search })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.render('guru/index', {
        title: 'Manajemen Data Guru',
        guruList,
        currentPage: page,
        totalPages,
        totalCount,
        search
      });
    } catch (error) {
      console.error('[Guru Index Error]', error);
      req.flash('error', 'Gagal memuat data guru.');
      res.redirect('/dashboard');
    }
  },

  showCreate(req, res) {
    res.render('guru/create', {
      title: 'Tambah Guru Baru',
      formData: {}
    });
  },

  async create(req, res) {
    try {
      const { nip, nama, jenis_kelamin, alamat, no_telp, create_account, username, email, password } = req.body;

      if (!nip || !nama || !jenis_kelamin) {
        req.flash('error', 'NIP, Nama Lengkap, dan Jenis Kelamin wajib diisi.');
        return res.render('guru/create', {
          title: 'Tambah Guru Baru',
          formData: req.body
        });
      }

      let userId = null;
      if (create_account === 'yes') {
        const uname = username || `guru_${nip}`;
        const uemail = email || `${nip}@sekolah.sch.id`;
        const upass = password || 'guru123';

        const existing = await User.findByUsernameOrEmail(uname);
        if (existing) {
          req.flash('error', `Username atau Email '${uname}' sudah terdaftar.`);
          return res.render('guru/create', {
            title: 'Tambah Guru Baru',
            formData: req.body
          });
        }

        userId = await User.create({
          username: uname,
          email: uemail,
          password: upass,
          role: 'guru'
        });
      }

      await Guru.create({
        user_id: userId,
        nip,
        nama,
        jenis_kelamin,
        alamat,
        no_telp
      });

      req.flash('success', `Data guru '${nama}' berhasil ditambahkan.`);
      res.redirect('/guru');
    } catch (error) {
      console.error('[Guru Store Error]', error);
      let errMsg = 'Gagal menyimpan data guru.';
      if (error.code === 'ER_DUP_ENTRY') {
        errMsg = 'NIP sudah terdaftar di sistem.';
      }
      req.flash('error', errMsg);
      res.render('guru/create', {
        title: 'Tambah Guru Baru',
        formData: req.body
      });
    }
  },

  async showEdit(req, res) {
    try {
      const { id } = req.params;
      const guru = await Guru.getById(id);

      if (!guru) {
        req.flash('error', 'Data guru tidak ditemukan.');
        return res.redirect('/guru');
      }

      res.render('guru/edit', {
        title: `Edit Guru - ${guru.nama}`,
        guru
      });
    } catch (error) {
      console.error('[Guru Edit Error]', error);
      req.flash('error', 'Gagal memuat data guru.');
      res.redirect('/guru');
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nip, nama, jenis_kelamin, alamat, no_telp } = req.body;

      if (!nip || !nama || !jenis_kelamin) {
        req.flash('error', 'NIP, Nama Lengkap, dan Jenis Kelamin wajib diisi.');
        return res.redirect(`/guru/edit/${id}`);
      }

      await Guru.update(id, {
        nip,
        nama,
        jenis_kelamin,
        alamat,
        no_telp
      });

      req.flash('success', `Data guru '${nama}' berhasil diperbarui.`);
      res.redirect('/guru');
    } catch (error) {
      console.error('[Guru Update Error]', error);
      let errMsg = 'Gagal memperbarui data guru.';
      if (error.code === 'ER_DUP_ENTRY') {
        errMsg = 'NIP sudah digunakan oleh guru lain.';
      }
      req.flash('error', errMsg);
      res.redirect(`/guru/edit/${req.params.id}`);
    }
  },

  async showDetail(req, res) {
    try {
      const { id } = req.params;
      const guru = await Guru.getById(id);

      if (!guru) {
        req.flash('error', 'Data guru tidak ditemukan.');
        return res.redirect('/guru');
      }

      const [mapelList, jadwalList] = await Promise.all([
        Mapel.getByGuruId(id),
        Jadwal.getByGuruId(id)
      ]);

      res.render('guru/detail', {
        title: `Detail Guru - ${guru.nama}`,
        guru,
        mapelList,
        jadwalList
      });
    } catch (error) {
      console.error('[Guru Detail Error]', error);
      req.flash('error', 'Gagal memuat detail guru.');
      res.redirect('/guru');
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const guru = await Guru.getById(id);
      if (!guru) {
        req.flash('error', 'Data guru tidak ditemukan.');
        return res.redirect('/guru');
      }

      await Guru.delete(id);
      req.flash('success', `Data guru '${guru.nama}' berhasil dihapus.`);
      res.redirect('/guru');
    } catch (error) {
      console.error('[Guru Delete Error]', error);
      req.flash('error', 'Gagal menghapus data guru.');
      res.redirect('/guru');
    }
  }
};

module.exports = guruController;

