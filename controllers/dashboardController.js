const Siswa = require('../models/Siswa');
const Guru = require('../models/Guru');
const Kelas = require('../models/Kelas');
const Mapel = require('../models/Mapel');
const Nilai = require('../models/Nilai');
const Jadwal = require('../models/Jadwal');

const dashboardController = {
  async index(req, res) {
    try {
      const user = req.session.user;

      // Global counts for metrics
      const [totalSiswa, totalGuru, totalKelas, totalMapel] = await Promise.all([
        Siswa.count(),
        Guru.count(),
        Kelas.count(),
        Mapel.count()
      ]);

      const genderDistribution = await Siswa.getGenderDistribution();
      const studentsPerClass = await Siswa.getStudentsPerClass();
      const summaryStats = await Nilai.getSummaryStats();

      let roleData = {};

      if (user.role === 'siswa') {
        const siswa = await Siswa.getByUserId(user.id);
        if (siswa) {
          const [nilaiList, jadwalList] = await Promise.all([
            Nilai.getBySiswaId(siswa.id),
            siswa.kelas_id ? Jadwal.getByKelasId(siswa.kelas_id) : []
          ]);

          // Compute student's average score
          let totalAkhir = 0;
          nilaiList.forEach(n => {
            totalAkhir += parseFloat(n.nilai_akhir || 0);
          });
          const avgScore = nilaiList.length > 0 ? (totalAkhir / nilaiList.length).toFixed(2) : 0;

          roleData = {
            siswa,
            nilaiList: nilaiList.slice(0, 5), // top 5
            totalMataPelajaranDiambil: nilaiList.length,
            rataRataNilai: avgScore,
            jadwalList: jadwalList.slice(0, 5)
          };
        }
      } else if (user.role === 'guru') {
        const guru = await Guru.getByUserId(user.id);
        if (guru) {
          const [mapelList, jadwalList] = await Promise.all([
            Mapel.getByGuruId(guru.id),
            Jadwal.getByGuruId(guru.id)
          ]);

          roleData = {
            guru,
            mapelList,
            jadwalList: jadwalList.slice(0, 6)
          };
        }
      }

      res.render('dashboard/index', {
        title: 'Dashboard Utama',
        stats: {
          totalSiswa,
          totalGuru,
          totalKelas,
          totalMapel,
          rataRataNilai: summaryStats?.rata_rata_keseluruhan ? parseFloat(summaryStats.rata_rata_keseluruhan).toFixed(1) : 0,
          totalNilai: summaryStats?.total_entri_nilai || 0
        },
        genderDistribution,
        studentsPerClass,
        roleData
      });
    } catch (error) {
      console.error('[Dashboard Error]', error);
      res.render('dashboard/index', {
        title: 'Dashboard Utama',
        stats: { totalSiswa: 0, totalGuru: 0, totalKelas: 0, totalMapel: 0, rataRataNilai: 0, totalNilai: 0 },
        genderDistribution: [],
        studentsPerClass: [],
        roleData: {}
      });
    }
  }
};

module.exports = dashboardController;

