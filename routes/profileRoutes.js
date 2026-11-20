const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, profileController.index);
router.post('/password', isAuthenticated, profileController.updatePassword);
router.post('/bio', isAuthenticated, profileController.updateBio);

module.exports = router;

