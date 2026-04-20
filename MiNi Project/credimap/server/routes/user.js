const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// All routes are protected by auth middleware
router.use(auth);

// Profile & Theme
router.put('/profile', userController.updateProfile);
router.put('/theme', userController.updateTheme);

// Skills
router.post('/skills', userController.addSkill);
router.delete('/skills/:id', userController.deleteSkill);

// Experience
router.post('/experience', userController.addExperience);
router.delete('/experience/:id', userController.deleteExperience);

// Education
router.post('/education', userController.addEducation);
router.delete('/education/:id', userController.deleteEducation);

// Achievements
router.post('/achievements', userController.addAchievement);
router.delete('/achievements/:id', userController.deleteAchievement);

module.exports = router;
