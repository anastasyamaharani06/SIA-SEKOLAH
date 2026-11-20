const Siswa = require('../models/Siswa');
const Kelas = require('../models/Kelas');
const User = require('../models/User');
const Nilai = require('../models/Nilai');

const siswaController = {
  async index(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const kelas_id = req.query.kelas_id || '';

      const [siswaList, totalCount, kelasList] = await Promise.all([
        Siswa.getAll({ search, kelas_id, limit, offset }),
        Siswa.count({ search, kelas_id }),
        Kelas.getAllSimple()
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.render('siswa/index', {
        title: 'Manajemen Data Siswa',
        siswaList,
        kelasList,
        currentPage: page,
        totalPages,
        totalCount,
        search,
        kelas_id
      });
    } catch (error) {
      console.error('[Siswa Index Error]', error);
      req.flash('error', 'Gagal memuat data siswa.');
      res.redirect('/dashboard');
    }
  },

  async showCreate(req, res) {
    try {
      const kelasList = await Kelas.getAllSimple();
      res.render('siswa/create', {
        title: 'Tambah Siswa Baru',
        kelasList,
        formData: {}
      });
    } catch (error) {
      console.error('[Siswa Create Error]', error);
      req.flash('error', 'Gagal memuat form tambah siswa.');
      res.redirect('/siswa');
    }
  },

  async create(req, res) {
    try {
      const { nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id, no_telp, create_account, username, email, password } = req.body;

      if (!nis || !nisn || !nama || !jenis_kelamin || !tanggal_lahir) {
        req.flash('error', 'Mohon lengkapi seluruh kolom wajib.');
        const kelasList = await Kelas.getAllSimple();
        return res.render('siswa/create', {
          title: 'Tambah Siswa Baru',
          kelasList,
          formData: req.body
        });
      }

      let userId = null;
      if (create_account === 'yes') {
        const uname = username || `siswa_${nis}`;
        const uemail = email || `${nis}@siswa.sch.id`;
        const upass = password || 'siswa123';

        // Check if user already exists
        const existing = await User.findByUsernameOrEmail(uname);
        if (existing) {
          req.flash('error', `Username atau Email '${uname}' sudah terdaftar.`);
          const kelasList = await Kelas.getAllSimple();
          return res.render('siswa/create', {
            title: 'Tambah Siswa Baru',
            kelasList,
            formData: req.body
          });
        }

        userId = await User.create({
          username: uname,
          email: uemail,
          password: upass,
          role: 'siswa'
        });
      }

      await Siswa.create({
        user_id: userId,
        nis,
        nisn,
        nama,
        jenis_kelamin,
        tanggal_lahir,
        alamat,
        kelas_id: kelas_id || null,
        no_telp
      });

      req.flash('success', `Data siswa '${nama}' berhasil ditambahkan.`);
      res.redirect('/siswa');
    } catch (error) {
      console.error('[Siswa Store Error]', error);
      let errMsg = 'Gagal menyimpan data siswa.';
      if (error.code === 'ER_DUP_ENTRY') {
        errMsg = 'NIS atau NISN sudah terdaftar di sistem.';
      }
      req.flash('error', errMsg);
      const kelasList = await Kelas.getAllSimple();
      res.render('siswa/create', {
        title: 'Tambah Siswa Baru',
        kelasList,
        formData: req.body
      });
    }
  },

  async showEdit(req, res) {
    try {
      const { id } = req.params;
      const [siswa, kelasList] = await Promise.all([
        Siswa.getById(id),
        Kelas.getAllSimple()
      ]);

      if (!siswa) {
        req.flash('error', 'Data siswa tidak ditemukan.');
        return res.redirect('/siswa');
      }

      res.render('siswa/edit', {
        title: `Edit Siswa - ${siswa.nama}`,
        siswa,
        kelasList
      });
    } catch (error) {
      console.error('[Siswa Edit Error]', error);
      req.flash('error', 'Gagal memuat data siswa.');
      res.redirect('/siswa');
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id, no_telp } = req.body;

      if (!nis || !nisn || !nama || !jenis_kelamin || !tanggal_lahir) {
        req.flash('error', 'Mohon lengkapi seluruh kolom wajib.');
        return res.redirect(`/siswa/edit/${id}`);
      }

      await Siswa.update(id, {
        nis,
        nisn,
        nama,
        jenis_kelamin,
        tanggal_lahir,
        alamat,
        kelas_id: kelas_id || null,
        no_telp
      });

      req.flash('success', `Data siswa '${nama}' berhasil diperbarui.`);
      res.redirect('/siswa');
    } catch (error) {
      console.error('[Siswa Update Error]', error);
      let errMsg = 'Gagal memperbarui data siswa.';
      if (error.code === 'ER_DUP_ENTRY') {
        errMsg = 'NIS atau NISN sudah digunakan oleh siswa lain.';
      }
      req.flash('error', errMsg);
      res.redirect(`/siswa/edit/${req.params.id}`);
    }
  },

  async showDetail(req, res) {
    try {
      const { id } = req.params;
      const siswa = await Siswa.getById(id);

      if (!siswa) {
        req.flash('error', 'Data siswa tidak ditemukan.');
        return res.redirect('/siswa');
      }

      const nilaiList = await Nilai.getBySiswaId(id);

      res.render('siswa/detail', {
        title: `Detail Siswa - ${siswa.nama}`,
        siswa,
        nilaiList
      });
    } catch (error) {
      console.error('[Siswa Detail Error]', error);
      req.flash('error', 'Gagal memuat detail siswa.');
      res.redirect('/siswa');
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const siswa = await Siswa.getById(id);
      if (!siswa) {
        req.flash('error', 'Data siswa tidak ditemukan.');
        return res.redirect('/siswa');
      }

      await Siswa.delete(id);
      req.flash('success', `Data siswa '${siswa.nama}' berhasil dihapus.`);
      res.redirect('/siswa');
    } catch (error) {
      console.error('[Siswa Delete Error]', error);
      req.flash('error', 'Gagal menghapus data siswa.');
      res.redirect('/siswa');
    }
  }
};

module.exports = siswaController;

