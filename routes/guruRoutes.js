const express = require('express');
const router = express.Router();
const guruController = require('../controllers/guruController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// List teachers: Admin & Guru
router.get('/', isAuthenticated, hasRole(['admin', 'guru']), guruController.index);

// Detail teacher: Admin & Guru
router.get('/detail/:id', isAuthenticated, hasRole(['admin', 'guru']), guruController.showDetail);

// Create teacher: Admin only
router.get('/create', isAuthenticated, hasRole(['admin']), guruController.showCreate);
router.post('/', isAuthenticated, hasRole(['admin']), guruController.create);

// Edit teacher: Admin only
router.get('/edit/:id', isAuthenticated, hasRole(['admin']), guruController.showEdit);
router.post('/edit/:id', isAuthenticated, hasRole(['admin']), guruController.update);

// Delete teacher: Admin only
router.post('/delete/:id', isAuthenticated, hasRole(['admin']), guruController.delete);

module.exports = router;

