const { pool } = require('../config/database');

const Siswa = {
  async getAll({ search = '', kelas_id = '', limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT s.*, k.nama_kelas, u.email, u.username
      FROM siswa s
      LEFT JOIN kelas k ON s.kelas_id = k.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (s.nama LIKE ? OR s.nis LIKE ? OR s.nisn LIKE ? OR s.alamat LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    if (kelas_id) {
      sql += ` AND s.kelas_id = ?`;
      params.push(kelas_id);
    }

    sql += ` ORDER BY s.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async count({ search = '', kelas_id = '' } = {}) {
    let sql = `SELECT COUNT(*) AS total FROM siswa s WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (s.nama LIKE ? OR s.nis LIKE ? OR s.nisn LIKE ? OR s.alamat LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    if (kelas_id) {
      sql += ` AND s.kelas_id = ?`;
      params.push(kelas_id);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async getById(id) {
    const sql = `
      SELECT s.*, k.nama_kelas, k.tingkat, k.tahun_ajaran, u.email, u.username
      FROM siswa s
      LEFT JOIN kelas k ON s.kelas_id = k.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  async getByUserId(userId) {
    const sql = `
      SELECT s.*, k.nama_kelas, k.tingkat, k.tahun_ajaran, u.email, u.username
      FROM siswa s
      LEFT JOIN kelas k ON s.kelas_id = k.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
    `;
    const [rows] = await pool.query(sql, [userId]);
    return rows[0] || null;
  },

  async create({ user_id = null, nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id, no_telp }) {
    const [result] = await pool.query(
      `INSERT INTO siswa (user_id, nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id, no_telp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id || null, no_telp]
    );
    return result.insertId;
  },

  async update(id, { nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id, no_telp }) {
    await pool.query(
      `UPDATE siswa
       SET nis = ?, nisn = ?, nama = ?, jenis_kelamin = ?, tanggal_lahir = ?, alamat = ?, kelas_id = ?, no_telp = ?
       WHERE id = ?`,
      [nis, nisn, nama, jenis_kelamin, tanggal_lahir, alamat, kelas_id || null, no_telp, id]
    );
  },

  async delete(id) {
    // Also delete user account if associated
    const [rows] = await pool.query('SELECT user_id FROM siswa WHERE id = ?', [id]);
    const userId = rows[0]?.user_id;

    await pool.query('DELETE FROM siswa WHERE id = ?', [id]);

    if (userId) {
      await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    }
  },

  async getGenderDistribution() {
    const [rows] = await pool.query(
      `SELECT jenis_kelamin, COUNT(*) as count FROM siswa GROUP BY jenis_kelamin`
    );
    return rows;
  },

  async getStudentsPerClass() {
    const [rows] = await pool.query(`
      SELECT k.nama_kelas, COUNT(s.id) as total_siswa
      FROM kelas k
      LEFT JOIN siswa s ON k.id = s.kelas_id
      GROUP BY k.id, k.nama_kelas
      ORDER BY k.id ASC
    `);
    return rows;
  }
};

module.exports = Siswa;

