const express = require('express');
const router = express.Router();
const mapelController = require('../controllers/mapelController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// List mapel can be viewed by all authenticated users
router.get('/', isAuthenticated, mapelController.index);

// Create, edit, delete: Admin only
router.get('/create', isAuthenticated, hasRole(['admin']), mapelController.showCreate);
router.post('/', isAuthenticated, hasRole(['admin']), mapelController.create);

router.get('/edit/:id', isAuthenticated, hasRole(['admin']), mapelController.showEdit);
router.post('/edit/:id', isAuthenticated, hasRole(['admin']), mapelController.update);

router.post('/delete/:id', isAuthenticated, hasRole(['admin']), mapelController.delete);

module.exports = router;

