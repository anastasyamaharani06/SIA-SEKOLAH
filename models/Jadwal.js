const { pool } = require('../config/database');

const Jadwal = {
  async getAll({ kelas_id = '', hari = '', guru_id = '', limit = 100, offset = 0 } = {}) {
    let sql = `
      SELECT j.*, k.nama_kelas, mp.nama_mapel, mp.kode_mapel, g.nama as guru_nama
      FROM jadwal j
      JOIN kelas k ON j.kelas_id = k.id
      JOIN mata_pelajaran mp ON j.mapel_id = mp.id
      JOIN guru g ON j.guru_id = g.id
      WHERE 1=1
    `;
    const params = [];

    if (kelas_id) {
      sql += ` AND j.kelas_id = ?`;
      params.push(kelas_id);
    }

    if (hari) {
      sql += ` AND j.hari = ?`;
      params.push(hari);
    }

    if (guru_id) {
      sql += ` AND j.guru_id = ?`;
      params.push(guru_id);
    }

    // Order by day of week then time
    sql += `
      ORDER BY
        FIELD(j.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'),
        j.jam_mulai ASC
      LIMIT ? OFFSET ?
    `;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async count({ kelas_id = '', hari = '', guru_id = '' } = {}) {
    let sql = `SELECT COUNT(*) AS total FROM jadwal j WHERE 1=1`;
    const params = [];

    if (kelas_id) {
      sql += ` AND j.kelas_id = ?`;
      params.push(kelas_id);
    }

    if (hari) {
      sql += ` AND j.hari = ?`;
      params.push(hari);
    }

    if (guru_id) {
      sql += ` AND j.guru_id = ?`;
      params.push(guru_id);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async getById(id) {
    const sql = `
      SELECT j.*, k.nama_kelas, mp.nama_mapel, mp.kode_mapel, g.nama as guru_nama
      FROM jadwal j
      JOIN kelas k ON j.kelas_id = k.id
      JOIN mata_pelajaran mp ON j.mapel_id = mp.id
      JOIN guru g ON j.guru_id = g.id
      WHERE j.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  async getByKelasId(kelasId) {
    const sql = `
      SELECT j.*, k.nama_kelas, mp.nama_mapel, mp.kode_mapel, g.nama as guru_nama
      FROM jadwal j
      JOIN kelas k ON j.kelas_id = k.id
      JOIN mata_pelajaran mp ON j.mapel_id = mp.id
      JOIN guru g ON j.guru_id = g.id
      WHERE j.kelas_id = ?
      ORDER BY FIELD(j.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'), j.jam_mulai ASC
    `;
    const [rows] = await pool.query(sql, [kelasId]);
    return rows;
  },

  async getByGuruId(guruId) {
    const sql = `
      SELECT j.*, k.nama_kelas, mp.nama_mapel, mp.kode_mapel, g.nama as guru_nama
      FROM jadwal j
      JOIN kelas k ON j.kelas_id = k.id
      JOIN mata_pelajaran mp ON j.mapel_id = mp.id
      JOIN guru g ON j.guru_id = g.id
      WHERE j.guru_id = ?
      ORDER BY FIELD(j.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'), j.jam_mulai ASC
    `;
    const [rows] = await pool.query(sql, [guruId]);
    return rows;
  },

  async create({ kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan }) {
    const [result] = await pool.query(
      `INSERT INTO jadwal (kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan || 'Ruang Kelas']
    );
    return result.insertId;
  },

  async update(id, { kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan }) {
    await pool.query(
      `UPDATE jadwal
       SET kelas_id = ?, mapel_id = ?, guru_id = ?, hari = ?, jam_mulai = ?, jam_selesai = ?, ruangan = ?
       WHERE id = ?`,
      [kelas_id, mapel_id, guru_id, hari, jam_mulai, jam_selesai, ruangan || 'Ruang Kelas', id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM jadwal WHERE id = ?', [id]);
  }
};

module.exports = Jadwal;

