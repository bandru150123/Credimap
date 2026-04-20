const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth, userController.getProjects);
router.post('/', auth, userController.addProject);
router.put('/:id', auth, userController.updateProject);
router.delete('/:id', auth, userController.deleteProject);

module.exports = router;
