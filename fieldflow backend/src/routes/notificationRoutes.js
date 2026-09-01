const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const notificationValidator = require('../validators/notificationValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', notificationController.getAll);
router.post('/', notificationValidator.create, validationHandler, notificationController.create);
router.patch('/:id/read', notificationController.markRead);
router.post('/clear', notificationController.markAllRead);
router.post('/read-all', notificationController.markAllRead); // Alias support

module.exports = router;
