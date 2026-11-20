const { pool } = require('../config/database');

const Guru = {
  async getAll({ search = '', limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT g.*, u.email, u.username,
        (SELECT GROUP_CONCAT(nama_mapel SEPARATOR ', ') FROM mata_pelajaran mp WHERE mp.guru_id = g.id) AS mapel_diampu
      FROM guru g
      LEFT JOIN users u ON g.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (g.nama LIKE ? OR g.nip LIKE ? OR g.alamat LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    sql += ` ORDER BY g.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async count({ search = '' } = {}) {
    let sql = `SELECT COUNT(*) AS total FROM guru g WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (g.nama LIKE ? OR g.nip LIKE ? OR g.alamat LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async getById(id) {
    const sql = `
      SELECT g.*, u.email, u.username,
        (SELECT GROUP_CONCAT(nama_mapel SEPARATOR ', ') FROM mata_pelajaran mp WHERE mp.guru_id = g.id) AS mapel_diampu
      FROM guru g
      LEFT JOIN users u ON g.user_id = u.id
      WHERE g.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  async getByUserId(userId) {
    const sql = `
      SELECT g.*, u.email, u.username
      FROM guru g
      LEFT JOIN users u ON g.user_id = u.id
      WHERE g.user_id = ?
    `;
    const [rows] = await pool.query(sql, [userId]);
    return rows[0] || null;
  },

  async create({ user_id = null, nip, nama, jenis_kelamin, alamat, no_telp }) {
    const [result] = await pool.query(
      `INSERT INTO guru (user_id, nip, nama, jenis_kelamin, alamat, no_telp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, nip, nama, jenis_kelamin, alamat, no_telp]
    );
    return result.insertId;
  },

  async update(id, { nip, nama, jenis_kelamin, alamat, no_telp }) {
    await pool.query(
      `UPDATE guru
       SET nip = ?, nama = ?, jenis_kelamin = ?, alamat = ?, no_telp = ?
       WHERE id = ?`,
      [nip, nama, jenis_kelamin, alamat, no_telp, id]
    );
  },

  async delete(id) {
    const [rows] = await pool.query('SELECT user_id FROM guru WHERE id = ?', [id]);
    const userId = rows[0]?.user_id;

    await pool.query('DELETE FROM guru WHERE id = ?', [id]);

    if (userId) {
      await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    }
  },

  async getAllSimple() {
    const [rows] = await pool.query('SELECT id, nip, nama FROM guru ORDER BY nama ASC');
    return rows;
  }
};

module.exports = Guru;

