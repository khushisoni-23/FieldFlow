const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const technicianValidator = require('../validators/technicianValidator');
const validationHandler = require('../middleware/validationHandler');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', technicianController.getAll);
router.get('/:id', technicianController.getById);
router.post('/', technicianValidator.create, validationHandler, technicianController.create);
router.patch('/:id/status', technicianValidator.updateStatus, validationHandler, technicianController.updateStatus);
router.delete('/:id', technicianController.delete);

module.exports = router;
