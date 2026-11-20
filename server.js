require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const morgan = require('morgan');

const { testConnection } = require('./config/database');
const { setLocals } = require('./middleware/auth');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const siswaRoutes = require('./routes/siswaRoutes');
const guruRoutes = require('./routes/guruRoutes');
const kelasRoutes = require('./routes/kelasRoutes');
const mapelRoutes = require('./routes/mapelRoutes');
const nilaiRoutes = require('./routes/nilaiRoutes');
const jadwalRoutes = require('./routes/jadwalRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'sia_sekolah_super_secret_key_2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.USE_HTTPS === 'true'
    }
  })
);

// Flash messages
app.use(flash());

// Custom locals middleware for views
app.use(setLocals);

// Route Bindings
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/siswa', siswaRoutes);
app.use('/guru', guruRoutes);
app.use('/kelas', kelasRoutes);
app.use('/mapel', mapelRoutes);
app.use('/nilai', nilaiRoutes);
app.use('/jadwal', jadwalRoutes);
app.use('/profile', profileRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('error/404', {
    title: 'Halaman Tidak Ditemukan'
  });
});

// Global 500 Error Handler
app.use((err, req, res, next) => {
  console.error('[Internal Server Error]', err);
  res.status(500).send(`
    <div style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: 40px auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <h2 style="color: #e11d48; margin-top: 0;">500 - Terjadi Kesalahan Sistem</h2>
      <p style="color: #475569;">Aplikasi mengalami kendala internal saat memproses permintaan Anda.</p>
      <pre style="background: #f1f5f9; padding: 1rem; border-radius: 8px; font-size: 0.85rem; overflow-x: auto;">${err.message}</pre>
      <a href="/dashboard" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">Kembali ke Dashboard</a>
    </div>
  `);
});

// Start Server
app.listen(PORT, async () => {
  console.log(`========================================================`);
  console.log(`🚀 SIA-SEKOLAH Server berjalan di http://localhost:${PORT}`);
  console.log(`📡 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================================`);
  await testConnection();
});

module.exports = app;

