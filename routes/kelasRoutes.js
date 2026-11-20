const express = require('express');
const router = express.Router();
const kelasController = require('../controllers/kelasController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// List & detail can be viewed by all authenticated users
router.get('/', isAuthenticated, kelasController.index);
router.get('/detail/:id', isAuthenticated, kelasController.showDetail);

// Create, edit, delete: Admin only
router.get('/create', isAuthenticated, hasRole(['admin']), kelasController.showCreate);
router.post('/', isAuthenticated, hasRole(['admin']), kelasController.create);

router.get('/edit/:id', isAuthenticated, hasRole(['admin']), kelasController.showEdit);
router.post('/edit/:id', isAuthenticated, hasRole(['admin']), kelasController.update);

router.post('/delete/:id', isAuthenticated, hasRole(['admin']), kelasController.delete);

module.exports = router;

