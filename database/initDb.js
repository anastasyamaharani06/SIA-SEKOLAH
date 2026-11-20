require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const dbName = process.env.DB_NAME || 'sia_sekolah';

  console.log(`[Init DB] Menghubungkan ke MySQL di ${host}:${port}...`);

  let connection;
  try {
    // Connect without selecting database first
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true
    });

    console.log('[Init DB] Koneksi berhasil. Membaca file sia_sekolah.sql...');
    const sqlPath = path.join(__dirname, 'sia_sekolah.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log(`[Init DB] Menjalankan script database '${dbName}'...`);
    await connection.query(sqlContent);

    console.log('========================================================');
    console.log(`[Init DB] Sukses! Database '${dbName}' dan data dummy berhasil disiapkan.`);
    console.log('Akun Pengujian:');
    console.log('1. Admin : username: admin        | password: admin123');
    console.log('2. Guru  : username: budi_santoso | password: guru123');
    console.log('3. Siswa : username: ahmad_fauzi  | password: siswa123');
    console.log('========================================================');
  } catch (error) {
    console.error('[Init DB Error] Terjadi kesalahan saat inisialisasi database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();

