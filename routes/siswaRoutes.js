const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswaController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// List students: Admin & Guru
router.get('/', isAuthenticated, hasRole(['admin', 'guru']), siswaController.index);

// Detail student: Admin & Guru
router.get('/detail/:id', isAuthenticated, hasRole(['admin', 'guru']), siswaController.showDetail);

// Create student: Admin only
router.get('/create', isAuthenticated, hasRole(['admin']), siswaController.showCreate);
router.post('/', isAuthenticated, hasRole(['admin']), siswaController.create);

// Edit student: Admin only
router.get('/edit/:id', isAuthenticated, hasRole(['admin']), siswaController.showEdit);
router.post('/edit/:id', isAuthenticated, hasRole(['admin']), siswaController.update);

// Delete student: Admin only
router.post('/delete/:id', isAuthenticated, hasRole(['admin']), siswaController.delete);

module.exports = router;

