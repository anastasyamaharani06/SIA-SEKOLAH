const { pool } = require('../config/database');

const Kelas = {
  async getAll({ search = '', limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT k.*, g.nama as wali_kelas_nama,
        (SELECT COUNT(*) FROM siswa s WHERE s.kelas_id = k.id) as total_siswa
      FROM kelas k
      LEFT JOIN guru g ON k.wali_kelas_id = g.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (k.nama_kelas LIKE ? OR k.tingkat LIKE ? OR k.tahun_ajaran LIKE ? OR g.nama LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    sql += ` ORDER BY k.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async count({ search = '' } = {}) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM kelas k
      LEFT JOIN guru g ON k.wali_kelas_id = g.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (k.nama_kelas LIKE ? OR k.tingkat LIKE ? OR k.tahun_ajaran LIKE ? OR g.nama LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async getById(id) {
    const sql = `
      SELECT k.*, g.nama as wali_kelas_nama, g.nip as wali_kelas_nip,
        (SELECT COUNT(*) FROM siswa s WHERE s.kelas_id = k.id) as total_siswa
      FROM kelas k
      LEFT JOIN guru g ON k.wali_kelas_id = g.id
      WHERE k.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  async getStudentsByKelasId(kelasId) {
    const sql = `
      SELECT s.*
      FROM siswa s
      WHERE s.kelas_id = ?
      ORDER BY s.nama ASC
    `;
    const [rows] = await pool.query(sql, [kelasId]);
    return rows;
  },

  async create({ nama_kelas, tingkat, wali_kelas_id, tahun_ajaran }) {
    const [result] = await pool.query(
      `INSERT INTO kelas (nama_kelas, tingkat, wali_kelas_id, tahun_ajaran)
       VALUES (?, ?, ?, ?)`,
      [nama_kelas, tingkat, wali_kelas_id || null, tahun_ajaran]
    );
    return result.insertId;
  },

  async update(id, { nama_kelas, tingkat, wali_kelas_id, tahun_ajaran }) {
    await pool.query(
      `UPDATE kelas
       SET nama_kelas = ?, tingkat = ?, wali_kelas_id = ?, tahun_ajaran = ?
       WHERE id = ?`,
      [nama_kelas, tingkat, wali_kelas_id || null, tahun_ajaran, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM kelas WHERE id = ?', [id]);
  },

  async getAllSimple() {
    const [rows] = await pool.query('SELECT id, nama_kelas, tingkat, tahun_ajaran FROM kelas ORDER BY nama_kelas ASC');
    return rows;
  }
};

module.exports = Kelas;

