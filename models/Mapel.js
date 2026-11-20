const { pool } = require('../config/database');

const Mapel = {
  async getAll({ search = '', limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT mp.*, g.nama as guru_nama, g.nip as guru_nip
      FROM mata_pelajaran mp
      LEFT JOIN guru g ON mp.guru_id = g.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (mp.kode_mapel LIKE ? OR mp.nama_mapel LIKE ? OR mp.kategori LIKE ? OR g.nama LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    sql += ` ORDER BY mp.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async count({ search = '' } = {}) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM mata_pelajaran mp
      LEFT JOIN guru g ON mp.guru_id = g.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (mp.kode_mapel LIKE ? OR mp.nama_mapel LIKE ? OR mp.kategori LIKE ? OR g.nama LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async getById(id) {
    const sql = `
      SELECT mp.*, g.nama as guru_nama, g.nip as guru_nip
      FROM mata_pelajaran mp
      LEFT JOIN guru g ON mp.guru_id = g.id
      WHERE mp.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  async getByGuruId(guruId) {
    const sql = `
      SELECT mp.*
      FROM mata_pelajaran mp
      WHERE mp.guru_id = ?
      ORDER BY mp.nama_mapel ASC
    `;
    const [rows] = await pool.query(sql, [guruId]);
    return rows;
  },

  async create({ kode_mapel, nama_mapel, kategori, guru_id }) {
    const [result] = await pool.query(
      `INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, kategori, guru_id)
       VALUES (?, ?, ?, ?)`,
      [kode_mapel, nama_mapel, kategori || 'Wajib', guru_id || null]
    );
    return result.insertId;
  },

  async update(id, { kode_mapel, nama_mapel, kategori, guru_id }) {
    await pool.query(
      `UPDATE mata_pelajaran
       SET kode_mapel = ?, nama_mapel = ?, kategori = ?, guru_id = ?
       WHERE id = ?`,
      [kode_mapel, nama_mapel, kategori || 'Wajib', guru_id || null, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM mata_pelajaran WHERE id = ?', [id]);
  },

  async getAllSimple() {
    const [rows] = await pool.query('SELECT id, kode_mapel, nama_mapel, kategori FROM mata_pelajaran ORDER BY nama_mapel ASC');
    return rows;
  }
};

module.exports = Mapel;

