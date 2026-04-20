const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getPublicProfile);
router.get('/portfolio/:publicId', userController.getSharedPortfolio);

module.exports = router;
