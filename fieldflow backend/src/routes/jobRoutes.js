const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const jobValidator = require('../validators/jobValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', jobController.getAll);
router.get('/:id', jobController.getById);
router.post('/', jobValidator.create, validationHandler, jobController.create);
router.patch('/:id/status', jobValidator.updateStatus, validationHandler, jobController.updateStatus);
router.post('/:id/complete', jobValidator.complete, validationHandler, jobController.complete);
router.post('/:id/payment', jobValidator.payment, validationHandler, jobController.payment);
router.post('/:id/assign', jobValidator.assign, validationHandler, jobController.assign);
router.post('/:id/parts', jobController.addPart);
router.post('/:id/photos', jobController.uploadPhotos);
router.delete('/:id', jobController.delete);

module.exports = router;
