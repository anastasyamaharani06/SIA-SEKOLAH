const User = require('../models/User');
const Siswa = require('../models/Siswa');
const Guru = require('../models/Guru');

const authController = {
  showLogin(req, res) {
    res.render('auth/login', {
      title: 'Masuk ke Sistem Informasi Akademik'
    });
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        req.flash('error', 'Username/Email dan Password wajib diisi.');
        return res.redirect('/auth/login');
      }

      const user = await User.findByUsernameOrEmail(username.trim());
      if (!user) {
        req.flash('error', 'Username atau Password tidak valid.');
        return res.redirect('/auth/login');
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        req.flash('error', 'Username atau Password tidak valid.');
        return res.redirect('/auth/login');
      }

      // Fetch linked profile based on role
      let profile = null;
      if (user.role === 'siswa') {
        profile = await Siswa.getByUserId(user.id);
      } else if (user.role === 'guru') {
        profile = await Guru.getByUserId(user.id);
      }

      // Save user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        nama: profile ? profile.nama : (user.role === 'admin' ? 'Administrator' : user.username),
        profileId: profile ? profile.id : null,
        detail: profile
      };

      req.flash('success', `Selamat datang kembali, ${req.session.user.nama}!`);
      res.redirect('/dashboard');
    } catch (error) {
      console.error('[Login Error]', error);
      req.flash('error', 'Terjadi kesalahan sistem saat mencoba masuk. Silakan coba beberapa saat lagi.');
      res.redirect('/auth/login');
    }
  },

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('[Logout Error]', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/auth/login');
    });
  }
};

module.exports = authController;

