const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwalController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// List jadwal: all authenticated users can view
router.get('/', isAuthenticated, jadwalController.index);

// Create, edit, delete: Admin only
router.get('/create', isAuthenticated, hasRole(['admin']), jadwalController.showCreate);
router.post('/', isAuthenticated, hasRole(['admin']), jadwalController.create);

router.get('/edit/:id', isAuthenticated, hasRole(['admin']), jadwalController.showEdit);
router.post('/edit/:id', isAuthenticated, hasRole(['admin']), jadwalController.update);

router.post('/delete/:id', isAuthenticated, hasRole(['admin']), jadwalController.delete);

module.exports = router;

