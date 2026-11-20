const User = require('../models/User');
const Siswa = require('../models/Siswa');
const Guru = require('../models/Guru');

const profileController = {
  async index(req, res) {
    try {
      const userSession = req.session.user;
      const user = await User.findById(userSession.id);

      let detail = null;
      if (user.role === 'siswa') {
        detail = await Siswa.getByUserId(user.id);
      } else if (user.role === 'guru') {
        detail = await Guru.getByUserId(user.id);
      }

      res.render('profile/index', {
        title: 'Profil Pengguna',
        user,
        detail
      });
    } catch (error) {
      console.error('[Profile Index Error]', error);
      req.flash('error', 'Gagal memuat profil pengguna.');
      res.redirect('/dashboard');
    }
  },

  async updatePassword(req, res) {
    try {
      const userId = req.session.user.id;
      const { old_password, new_password, confirm_password } = req.body;

      if (!old_password || !new_password || !confirm_password) {
        req.flash('error', 'Seluruh kolom ganti password wajib diisi.');
        return res.redirect('/profile');
      }

      if (new_password.length < 6) {
        req.flash('error', 'Password baru minimal harus 6 karakter.');
        return res.redirect('/profile');
      }

      if (new_password !== confirm_password) {
        req.flash('error', 'Konfirmasi password baru tidak cocok.');
        return res.redirect('/profile');
      }

      const user = await User.findById(userId);
      const isMatch = await User.comparePassword(old_password, user.password);
      if (!isMatch) {
        req.flash('error', 'Password lama Anda tidak sesuai.');
        return res.redirect('/profile');
      }

      await User.updatePassword(userId, new_password);

      req.flash('success', 'Password Anda berhasil diperbarui.');
      res.redirect('/profile');
    } catch (error) {
      console.error('[Update Password Error]', error);
      req.flash('error', 'Gagal memperbarui password.');
      res.redirect('/profile');
    }
  },

  async updateBio(req, res) {
    try {
      const user = req.session.user;
      const { alamat, no_telp } = req.body;

      if (user.role === 'siswa') {
        const siswa = await Siswa.getByUserId(user.id);
        if (siswa) {
          await Siswa.update(siswa.id, {
            nis: siswa.nis,
            nisn: siswa.nisn,
            nama: siswa.nama,
            jenis_kelamin: siswa.jenis_kelamin,
            tanggal_lahir: siswa.tanggal_lahir,
            alamat,
            kelas_id: siswa.kelas_id,
            no_telp
          });
        }
      } else if (user.role === 'guru') {
        const guru = await Guru.getByUserId(user.id);
        if (guru) {
          await Guru.update(guru.id, {
            nip: guru.nip,
            nama: guru.nama,
            jenis_kelamin: guru.jenis_kelamin,
            alamat,
            no_telp
          });
        }
      }

      req.flash('success', 'Informasi kontak berhasil diperbarui.');
      res.redirect('/profile');
    } catch (error) {
      console.error('[Update Bio Error]', error);
      req.flash('error', 'Gagal memperbarui data kontak.');
      res.redirect('/profile');
    }
  }
};

module.exports = profileController;

