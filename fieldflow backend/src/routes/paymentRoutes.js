const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const paymentValidator = require('../validators/paymentValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', paymentController.getAll);
router.post('/', paymentValidator.create, validationHandler, paymentController.create);
router.patch('/job/:jobId', paymentValidator.updateStatus, validationHandler, paymentController.updateStatus);

module.exports = router;
