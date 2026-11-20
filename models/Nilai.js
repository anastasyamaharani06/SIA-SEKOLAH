const { pool } = require('../config/database');

const Nilai = {
  calculateGrade(tugas, uts, uas) {
    const t = parseFloat(tugas) || 0;
    const ut = parseFloat(uts) || 0;
    const ua = parseFloat(uas) || 0;
    const akhir = (t * 0.3) + (ut * 0.3) + (ua * 0.4);
    const finalScore = Math.round(akhir * 100) / 100;

    let predikat = 'D';
    let keterangan = 'Kurang (Remedial)';

    if (finalScore >= 88) {
      predikat = 'A';
      keterangan = 'Istimewa (Lulus)';
    } else if (finalScore >= 80) {
      predikat = 'B+';
      keterangan = 'Sangat Baik (Lulus)';
    } else if (finalScore >= 75) {
      predikat = 'B';
      keterangan = 'Baik (Lulus)';
    } else if (finalScore >= 70) {
      predikat = 'C+';
      keterangan = 'Cukup (Lulus)';
    } else if (finalScore >= 60) {
      predikat = 'C';
      keterangan = 'Cukup (Perlu Peningkatan)';
    }

    return {
      nilai_akhir: finalScore,
      predikat,
      keterangan
    };
  },

  async getAll({ search = '', mapel_id = '', kelas_id = '', semester = '', tahun_ajaran = '', limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT n.*, s.nama as siswa_nama, s.nis as siswa_nis, k.nama_kelas, mp.nama_mapel, mp.kode_mapel
      FROM nilai n
      JOIN siswa s ON n.siswa_id = s.id
      LEFT JOIN kelas k ON s.kelas_id = k.id
      JOIN mata_pelajaran mp ON n.mapel_id = mp.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (s.nama LIKE ? OR s.nis LIKE ? OR mp.nama_mapel LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    if (mapel_id) {
      sql += ` AND n.mapel_id = ?`;
      params.push(mapel_id);
    }

    if (kelas_id) {
      sql += ` AND s.kelas_id = ?`;
      params.push(kelas_id);
    }

    if (semester) {
      sql += ` AND n.semester = ?`;
      params.push(semester);
    }

    if (tahun_ajaran) {
      sql += ` AND n.tahun_ajaran = ?`;
      params.push(tahun_ajaran);
    }

    sql += ` ORDER BY n.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async count({ search = '', mapel_id = '', kelas_id = '', semester = '', tahun_ajaran = '' } = {}) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM nilai n
      JOIN siswa s ON n.siswa_id = s.id
      LEFT JOIN kelas k ON s.kelas_id = k.id
      JOIN mata_pelajaran mp ON n.mapel_id = mp.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (s.nama LIKE ? OR s.nis LIKE ? OR mp.nama_mapel LIKE ?)`;
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    if (mapel_id) {
      sql += ` AND n.mapel_id = ?`;
      params.push(mapel_id);
    }

    if (kelas_id) {
      sql += ` AND s.kelas_id = ?`;
      params.push(kelas_id);
    }

    if (semester) {
      sql += ` AND n.semester = ?`;
      params.push(semester);
    }

    if (tahun_ajaran) {
      sql += ` AND n.tahun_ajaran = ?`;
      params.push(tahun_ajaran);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async getById(id) {
    const sql = `
      SELECT n.*, s.nama as siswa_nama, s.nis as siswa_nis, s.kelas_id, k.nama_kelas, mp.nama_mapel, mp.kode_mapel
      FROM nilai n
      JOIN siswa s ON n.siswa_id = s.id
      LEFT JOIN kelas k ON s.kelas_id = k.id
      JOIN mata_pelajaran mp ON n.mapel_id = mp.id
      WHERE n.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  async getBySiswaId(siswaId, { semester = '', tahun_ajaran = '' } = {}) {
    let sql = `
      SELECT n.*, mp.nama_mapel, mp.kode_mapel, mp.kategori, g.nama as guru_nama
      FROM nilai n
      JOIN mata_pelajaran mp ON n.mapel_id = mp.id
      LEFT JOIN guru g ON mp.guru_id = g.id
      WHERE n.siswa_id = ?
    `;
    const params = [siswaId];

    if (semester) {
      sql += ` AND n.semester = ?`;
      params.push(semester);
    }

    if (tahun_ajaran) {
      sql += ` AND n.tahun_ajaran = ?`;
      params.push(tahun_ajaran);
    }

    sql += ` ORDER BY mp.nama_mapel ASC`;

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async create({ siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas }) {
    const grade = this.calculateGrade(nilai_tugas, nilai_uts, nilai_uas);
    const [result] = await pool.query(
      `INSERT INTO nilai (siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir, predikat, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas, grade.nilai_akhir, grade.predikat, grade.keterangan]
    );
    return result.insertId;
  },

  async update(id, { siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas }) {
    const grade = this.calculateGrade(nilai_tugas, nilai_uts, nilai_uas);
    await pool.query(
      `UPDATE nilai
       SET siswa_id = ?, mapel_id = ?, semester = ?, tahun_ajaran = ?, nilai_tugas = ?, nilai_uts = ?, nilai_uas = ?, nilai_akhir = ?, predikat = ?, keterangan = ?
       WHERE id = ?`,
      [siswa_id, mapel_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas, grade.nilai_akhir, grade.predikat, grade.keterangan, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM nilai WHERE id = ?', [id]);
  },

  async getSummaryStats() {
    const [rows] = await pool.query(`
      SELECT
        AVG(nilai_akhir) as rata_rata_keseluruhan,
        MAX(nilai_akhir) as nilai_tertinggi,
        MIN(nilai_akhir) as nilai_terendah,
        COUNT(*) as total_entri_nilai
      FROM nilai
    `);
    return rows[0];
  }
};

module.exports = Nilai;

