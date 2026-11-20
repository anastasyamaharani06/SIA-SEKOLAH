const express = require('express');
const router = express.Router();
const nilaiController = require('../controllers/nilaiController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Personal student report view: Siswa & Admin
router.get('/saya', isAuthenticated, nilaiController.siswaView);

// List all grades: Admin & Guru
router.get('/', isAuthenticated, hasRole(['admin', 'guru']), nilaiController.index);

// Create grade: Admin & Guru
router.get('/create', isAuthenticated, hasRole(['admin', 'guru']), nilaiController.showCreate);
router.post('/', isAuthenticated, hasRole(['admin', 'guru']), nilaiController.create);

// Edit grade: Admin & Guru
router.get('/edit/:id', isAuthenticated, hasRole(['admin', 'guru']), nilaiController.showEdit);
router.post('/edit/:id', isAuthenticated, hasRole(['admin', 'guru']), nilaiController.update);

// Delete grade: Admin & Guru
router.post('/delete/:id', isAuthenticated, hasRole(['admin', 'guru']), nilaiController.delete);

module.exports = router;

