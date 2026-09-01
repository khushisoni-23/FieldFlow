const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', authValidator.register, validationHandler, authController.register);
router.post('/login', authValidator.login, validationHandler, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getProfile);
router.get('/profile', authMiddleware, authController.getProfile); // supporting both aliases

module.exports = router;
